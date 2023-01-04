package upscale

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/getsentry/sentry-go"
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

var UPSCALE_MIN_WAIT = shared.GetDurationFromEnv("UPSCALE_MIN_WAIT", "2")
var UPSCALE_MIN_WAIT_FREE = shared.GetDurationFromEnv("UPSCALE_MIN_WAIT_FREE", "10")

func Handler(c *fiber.Ctx) error {
	start := time.Now().UTC().UnixMilli()

	countryCode := c.Get("CF-IPCountry")
	if countryCode == "" {
		countryCode = c.Get("X-Vercel-IP-Country")
	}

	var req shared.SUpscaleRequestBody
	if err := c.BodyParser(&req); err != nil {
		sentry.CaptureException(err)
		return c.Status(http.StatusBadRequest).JSON(
			SUpscaleResponse{Error: "Invalid request body"},
		)
	}

	supabaseUserId := shared.GetSupabaseUserIdFromAccessToken(req.AccessToken)
	subscriptionTier := "FREE"
	plan := "ANONYMOUS"

	if supabaseUserId != "" {
		var res shared.SUserResponse
		_, err := shared.SupabaseDb.From("user").Select("subscription_tier", "", false).Eq("id", supabaseUserId).Single().ExecuteTo(&res)
		if err != nil {
			sentry.CaptureException(err)
			log.Printf("-- Upscale - Failed to get user tier: %v --", err)
		} else {
			subscriptionTier = res.SubsciptionTier
			plan = res.SubsciptionTier
		}
	}

	log.Printf("-- Upscale - User plan: %s --", plan)

	if plan != "PRO" {
		return c.Status(http.StatusBadRequest).JSON(
			SUpscaleResponse{Error: "Upscale feature isn't available on the free plan :("},
		)
	}

	if plan == "FREE" || plan == "ANONYMOUS" {
		isRateLimited := shared.IsRateLimited("goa", UPSCALE_MIN_WAIT, c)
		if isRateLimited {
			log.Printf("-- Upscale - Rate limited!: %s --", countryCode)
			return c.Status(http.StatusTooManyRequests).JSON(
				SUpscaleResponse{Error: fmt.Sprintf("You can only start an upscale every %d seconds :(", UPSCALE_MIN_WAIT/time.Second)},
			)
		}
	}

	hasOnGoingGenerationOrUpscale := shared.HasOnGoingGenerationOrUpscale("goa_active", c)
	onGoingGenerationOrUpscaleResponse := SUpscaleResponse{Error: "Please wait for your ongoing generation or upscale to finish before starting a new one."}
	if hasOnGoingGenerationOrUpscale {
		log.Printf("-- Generation - Has ongoing generation or upscale: %s --", countryCode)
		return c.Status(http.StatusTooManyRequests).JSON(onGoingGenerationOrUpscaleResponse)
	}

	durationOngoing := 15 * time.Second
	shared.SetOngoingGenerationOrUpscale("goa_active", durationOngoing, c)

	if plan == "FREE" || plan == "ANONYMOUS" {
		time.Sleep(UPSCALE_MIN_WAIT_FREE)
	}

	cleanedPrompt := shared.FormatPrompt(req.Prompt)
	cleanedNegativePrompt := shared.FormatPrompt(req.NegativePrompt)

	pickServerRes := shared.PickServer(shared.SPickServerProps{ServerUrl: req.ServerUrl, Type: "upscale"})
	if pickServerRes.Error {
		shared.DeleteOngoingGenerationOrUpscale("goa_active", c)
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
		UserTier:          subscriptionTier,
		ServerUrl:         pickServerRes.ServerUrl,
		UserAgent:         userAgent,
		DeviceType:        shared.GetDeviceType(client),
		CountryCode:       countryCode,
		DeviceOS:          client.OS,
		DeviceBrowser:     client.Name,
		LogObject:         logObj,
		UpscaleIdChan:     upscaleIdChan,
	})

	cogReqBody := shared.SCogUpscaleRequestBody{
		Input: shared.SCogUpscaleRequestInput{
			Image:       req.ImageB64,
			Task:        upscaleType,
			ProcessType: processType,
		},
	}
	cogReqBodyBuffer, cogReqBodyBufferErr := json.Marshal(cogReqBody)
	if cogReqBodyBufferErr != nil {
		go UpdateUpscaleAsFailed(upscaleIdChan, 0)
		sentry.CaptureException(cogReqBodyBufferErr)
		log.Printf("Error marshalling cog request body: %v", cogReqBodyBufferErr)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", c)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Failed to marshal cog request body"},
		)
	}

	upscaleCogStart := time.Now().UTC().UnixMilli()
	cogEndpoint := fmt.Sprintf("%s/predictions", pickServerRes.ServerUrl)
	ctx, cncl := context.WithTimeout(context.Background(), shared.GenerationOrUpscaleTimeout)
	defer cncl()

	cogReq, cogReqErr := http.NewRequestWithContext(ctx, http.MethodPost, cogEndpoint, bytes.NewBuffer(cogReqBodyBuffer))
	if cogReqErr != nil {
		upscaleCogEnd := time.Now().UTC().UnixMilli()
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
		sentry.CaptureException(cogReqErr)
		log.Printf("Error creating cog request: %v", cogReqErr)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", c)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Error creating cog request"},
		)
	}

	cogRes, cogResErr := http.DefaultClient.Do(cogReq)
	if cogResErr != nil {
		upscaleCogEnd := time.Now().UTC().UnixMilli()
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
		sentry.CaptureException(cogResErr)
		log.Printf("Error sending cog request: %v", cogResErr)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", c)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Error sending cog request"},
		)
	}
	if cogRes.StatusCode != http.StatusOK {
		upscaleCogEnd := time.Now().UTC().UnixMilli()
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
		log.Printf("Cog server returned non-200 status code: %v", cogRes.StatusCode)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", c)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Cog server returned non-200 status code"},
		)
	}
	var cogResBody shared.SCogGenerateResponseBody
	cogResBodyErr := json.NewDecoder(cogRes.Body).Decode(&cogResBody)
	if cogResBodyErr != nil {
		upscaleCogEnd := time.Now().UTC().UnixMilli()
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogEnd-upscaleCogStart)
		sentry.CaptureException(cogResBodyErr)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", c)
		return c.Status(http.StatusInternalServerError).JSON(
			SUpscaleResponse{Error: "Failed to decode cog response body"},
		)
	}
	output := cogResBody.Output[0]
	upscaleCogEnd := time.Now().UTC().UnixMilli()
	upscaleCogDurationMs := upscaleCogEnd - upscaleCogStart
	if output == "" {
		go UpdateUpscaleAsFailed(upscaleIdChan, upscaleCogDurationMs)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", c)
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
	shared.DeleteOngoingGenerationOrUpscale("goa_active", c)
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
