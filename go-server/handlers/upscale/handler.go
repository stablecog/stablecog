package upscale

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/goccy/go-json"

	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	"github.com/mileusna/useragent"
	"github.com/yekta/stablecog/go-server/loggers"
	"github.com/yekta/stablecog/go-server/shared"
)

var green = color.New(color.FgHiGreen).SprintFunc()

const upscaleType = "Real-World Image Super-Resolution-Large"
const processType = "upscale"
const scale = 4

var minDuration = time.Second * 4

func Handler(c *fiber.Ctx) error {
	start := time.Now().UTC().UnixMilli()

	countryCode := c.Get("CF-IPCountry")
	if countryCode == "" {
		countryCode = c.Get("X-Vercel-IP-Country")
	}

	isRateLimited := shared.IsRateLimited(c, minDuration)
	if isRateLimited {
		log.Printf("-- Upscale - Rate limited!: %s --", countryCode)
		return c.Status(http.StatusTooManyRequests).JSON(
			SUpscaleResponse{Error: fmt.Sprintf("You can only start an upscale every %d seconds :(", minDuration/time.Second)},
		)
	}

	var req shared.SUpscaleRequestBody
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(
			SUpscaleResponse{Error: "Invalid request body"},
		)
	}

	cleanedPrompt := shared.FormatPrompt(req.Prompt)
	cleanedNegativePrompt := shared.FormatPrompt(req.NegativePrompt)

	pickServerRes := shared.PickServerUrl(req.ServerUrl)
	if pickServerRes.Error {
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Failed to pick a server"},
		)
	}

	userAgent := c.Get("User-Agent")
	client := useragent.Parse(userAgent)
	upscaleIdChan := make(chan string)

	var logObj = loggers.SUpscaleLogObject{
		Prompt:            cleanedPrompt,
		NegativePrompt:    cleanedNegativePrompt,
		Scale:             scale,
		Type:              upscaleType,
		Width:             req.Width,
		Height:            req.Height,
		NumInferenceSteps: req.NumInferenceSteps,
		GuidanceScale:     req.GuidanceScale,
		Seed:              req.Seed,
		CountryCode:       countryCode,
		ServerUrl:         pickServerRes.ServerUrl,
	}
	loggers.LogUpscale("Upscale started", logObj)

	supabaseUserId := shared.GetSupabaseUserIdFromAccessToken(req.AccessToken)

	log.Printf("User id is: %s", supabaseUserId)

	go InsertUpscaleInitial(SInsertUpscaleProps{
		Status:            "started",
		Scale:             scale,
		Type:              upscaleType,
		Prompt:            cleanedPrompt,
		NegativePrompt:    cleanedNegativePrompt,
		Width:             req.Width,
		Height:            req.Height,
		GuidanceScale:     req.GuidanceScale,
		NumInferenceSteps: req.NumInferenceSteps,
		Seed:              req.Seed,
		UserId:            supabaseUserId,
		ServerUrl:         pickServerRes.ServerUrl,
		UserAgent:         userAgent,
		DeviceType:        shared.GetDeviceType(client),
		CountryCode:       countryCode,
		DeviceOS:          client.OS,
		DeviceBrowser:     client.Name,
		LogObject:         logObj,
		UpscaleIdChan:     upscaleIdChan,
	})
	cogReq := shared.SCogUpscaleRequestBody{
		Input: shared.SCogUpscaleRequestInput{
			Image:       req.ImageB64,
			Task:        upscaleType,
			ProcessType: processType,
		},
	}
	cogReqBody, cogReqBodyErr := json.Marshal(cogReq)
	if cogReqBodyErr != nil {
		go UpdateUpscaleAsFailed(upscaleIdChan, 0)
		log.Printf("Error marshalling cog request body: %v", cogReqBodyErr)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Failed to marshal cog request body"},
		)
	}
	cogEndpoint := fmt.Sprintf("%s/predictions", pickServerRes.ServerUrl)
	upscaleCogStart := time.Now().UTC().UnixMilli()
	cogRes, cogResErr := http.Post(cogEndpoint, "application/json", bytes.NewBuffer(cogReqBody))
	if cogResErr != nil {
		upscaleCogEnd := time.Now().UTC().UnixMilli()
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
		log.Printf("Error posting to cog server: %v", cogResErr)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Failed to post to cog server"},
		)
	}
	if cogRes.StatusCode != http.StatusOK {
		upscaleCogEnd := time.Now().UTC().UnixMilli()
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
		log.Printf("Cog server returned non-200 status code: %v", cogRes.StatusCode)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Cog server returned non-200 status code"},
		)
	}
	var cogResBody shared.SCogGenerateResponseBody
	cogResBodyErr := json.NewDecoder(cogRes.Body).Decode(&cogResBody)
	if cogResBodyErr != nil {
		upscaleCogEnd := time.Now().UTC().UnixMilli()
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Failed to decode cog response body"},
		)
	}
	output := cogResBody.Output[0]
	upscaleCogEnd := time.Now().UTC().UnixMilli()
	upscaleCogDurationMs := upscaleCogEnd - upscaleCogStart
	if output == "" {
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogDurationMs)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Cog server returned empty output"},
		)
	}
	loggers.LogUpscale(
		fmt.Sprintf(
			"Upscale duration on cog was: %v%s",
			green(upscaleCogDurationMs),
			green("ms"),
		),
		logObj,
	)
	go UpdateUpscaleAsSucceeded(
		upscaleIdChan,
		upscaleCogDurationMs,
	)
	end := time.Now().UTC().UnixMilli()
	loggers.LogUpscale(fmt.Sprintf("Upscale successful result returned in: %v%s", green(end-start), green("ms")), logObj)
	return c.Status(http.StatusOK).JSON(SUpscaleResponse{
		Data: SUpscaleResponseData{
			ImageB64:   output,
			DurationMs: upscaleCogDurationMs,
		},
	})
}

type SUpscaleResponse struct {
	Data  SUpscaleResponseData `json:"data,omitempty"`
	Error string               `json:"error,omitempty"`
}

type SUpscaleResponseData struct {
	ImageB64   string `json:"image_b64"`
	DurationMs int64  `json:"duration_ms"`
}
