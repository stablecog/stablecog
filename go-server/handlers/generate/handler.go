package generate

import (
	"bytes"
	"fmt"
	"log"
	"math/rand"
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
var yellow = color.New(color.FgHiYellow).SprintFunc()

func Handler(c *fiber.Ctx) error {
	start := time.Now().UTC().UnixMilli()
	var req shared.SGenerateRequestBody
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "Invalid request body"},
		)
	}
	rand.Seed(time.Now().Unix())

	if req.Seed == -1 {
		req.Seed = rand.Intn(shared.MaxSeed)
	}
	if req.Width > shared.MaxWidth {
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "Width is too large"},
		)
	}
	if req.Height > shared.MaxHeight {
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "Height is too large"},
		)
	}

	if req.Width*req.Height*req.NumInferenceSteps >= shared.MaxFreePixelSteps {
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "Pick fewer inference steps or smaller dimensions"},
		)
	}

	if shared.ModelIdToModelNameCog[req.ModelId] == "" {
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "Invalid model ID"},
		)
	}
	if shared.SchedulerIdToSchedulerNameCog[req.SchedulerId] == "" {
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "Invalid scheduler ID"},
		)
	}

	if req.OutputImageExt == "" {
		req.OutputImageExt = "jpg"
	}

	cleanedPrompt := shared.FormatPrompt(req.Prompt)
	cleanedNegativePrompt := shared.FormatPrompt(req.NegativePrompt)

	pickServerRes := shared.PickServerUrl(req.ServerUrl)
	if pickServerRes.Error {
		return c.Status(http.StatusInternalServerError).JSON(
			SGenerateResponse{Error: "Failed to pick a server"},
		)
	}

	userAgent := c.Get("User-Agent")
	client := useragent.Parse(userAgent)
	generationIdChan := make(chan string)
	countryCode := c.Get("CF-IPCountry")
	if countryCode == "" {
		countryCode = c.Get("X-Vercel-IP-Country")
	}

	var logObj = loggers.SGenerationLogObject{
		Prompt:            cleanedPrompt,
		NegativePrompt:    cleanedNegativePrompt,
		ModelId:           req.ModelId,
		SchedulerId:       req.SchedulerId,
		Width:             req.Width,
		Height:            req.Height,
		NumInferenceSteps: req.NumInferenceSteps,
		GuidanceScale:     req.GuidanceScale,
		Seed:              req.Seed,
		CountryCode:       countryCode,
		ServerUrl:         pickServerRes.ServerUrl,
	}
	loggers.LogGeneration("Generation started", logObj)

	go InsertGenerationInitial(SInsertGenerationProps{
		Status:            "started",
		Width:             req.Width,
		Height:            req.Height,
		GuidanceScale:     req.GuidanceScale,
		NumInferenceSteps: req.NumInferenceSteps,
		Seed:              req.Seed,
		ModelId:           req.ModelId,
		SchedulerId:       req.SchedulerId,
		ServerUrl:         pickServerRes.ServerUrl,
		CountryCode:       countryCode,
		UserAgent:         userAgent,
		DeviceType:        shared.GetDeviceType(client),
		DeviceOS:          client.OS,
		DeviceBrowser:     client.Name,
		LogObject:         logObj,
		GenerationIdChan:  generationIdChan,
	})
	cogReq := shared.SCogGenerateRequestBody{
		Input: shared.SCogGenerateRequestInput{
			Prompt:            cleanedPrompt,
			NegativePrompt:    cleanedNegativePrompt,
			Width:             fmt.Sprint(req.Width),
			Height:            fmt.Sprint(req.Height),
			NumInferenceSteps: fmt.Sprint(req.NumInferenceSteps),
			GuidanceScale:     fmt.Sprint(req.GuidanceScale),
			Model:             shared.ModelIdToModelNameCog[req.ModelId],
			Scheduler:         shared.SchedulerIdToSchedulerNameCog[req.SchedulerId],
			Seed:              fmt.Sprint(req.Seed),
			InitImage:         req.InitImage,
			Mask:              req.Mask,
			PromptStrength:    req.PromptStrength,
			OutputImageExt:    req.OutputImageExt,
		},
	}
	cogReqBody, cogReqBodyErr := json.Marshal(cogReq)
	if cogReqBodyErr != nil {
		go UpdateGenerationAsFailed(generationIdChan, 0, false)
		log.Printf("Error marshalling cog request body: %v", cogReqBodyErr)
		return c.Status(http.StatusInternalServerError).JSON(
			SGenerateResponse{Error: "Failed to marshal cog request body"},
		)
	}
	cogEndpoint := fmt.Sprintf("%s/predictions", pickServerRes.ServerUrl)
	generationCogStart := time.Now().UTC().UnixMilli()
	cogRes, cogResErr := http.Post(cogEndpoint, "application/json", bytes.NewBuffer(cogReqBody))
	if cogResErr != nil {
		generationCogEnd := time.Now().UTC().UnixMilli()
		go UpdateGenerationAsFailed(generationIdChan, generationCogEnd-generationCogStart, false)
		log.Printf("Error posting to cog server: %v", cogResErr)
		return c.Status(http.StatusInternalServerError).JSON(
			SGenerateResponse{Error: "Failed to post to cog server"},
		)
	}
	if cogRes.StatusCode != http.StatusOK {
		generationCogEnd := time.Now().UTC().UnixMilli()
		go UpdateGenerationAsFailed(generationIdChan, generationCogEnd-generationCogStart, false)
		log.Printf("Cog server returned non-200 status code: %v", cogRes.StatusCode)
		return c.Status(http.StatusInternalServerError).JSON(
			SGenerateResponse{Error: "Cog server returned non-200 status code"},
		)
	}
	var cogResBody shared.SCogGenerateResponseBody
	cogResBodyErr := json.NewDecoder(cogRes.Body).Decode(&cogResBody)
	if cogResBodyErr != nil {
		generationCogEnd := time.Now().UTC().UnixMilli()
		go UpdateGenerationAsFailed(generationIdChan, generationCogEnd-generationCogStart, false)
		return c.Status(http.StatusInternalServerError).JSON(
			SGenerateResponse{Error: "Failed to decode cog response body"},
		)
	}
	output := cogResBody.Output[0]
	generationCogEnd := time.Now().UTC().UnixMilli()
	generationCogDurationMs := generationCogEnd - generationCogStart
	if output == "" {
		go UpdateGenerationAsFailed(generationIdChan, generationCogDurationMs, false)
		return c.Status(http.StatusInternalServerError).JSON(
			SGenerateResponse{Error: "Cog server returned empty output"},
		)
	}
	loggers.LogGeneration(
		fmt.Sprintf(
			"Generation duration on cog was: %v%s",
			green(generationCogDurationMs),
			green("ms"),
		),
		logObj,
	)
	isNSFW := IsNSFW(output)
	if isNSFW {
		go UpdateGenerationAsFailed(generationIdChan, generationCogDurationMs, true)
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "NSFW"},
		)
	}
	promptIdChan := make(chan string)
	negativePromptIdChan := make(chan string)
	go UpdateGenerationAsSucceeded(
		generationIdChan,
		cleanedPrompt,
		cleanedNegativePrompt,
		generationCogDurationMs,
		promptIdChan,
		negativePromptIdChan,
	)
	if req.ShouldSubmitToGallery {
		go SubmitToGallery(SSubmitToGalleryProps{
			PromptIdChan:         promptIdChan,
			NegativePromptIdChan: negativePromptIdChan,
			ImageB64:             output,
			ModelId:              req.ModelId,
			SchedulerId:          req.SchedulerId,
			GuidanceScale:        req.GuidanceScale,
			InferenceSteps:       req.NumInferenceSteps,
			Seed:                 req.Seed,
			Hidden:               true,
		})
	}
	end := time.Now().UTC().UnixMilli()
	loggers.LogGeneration(fmt.Sprintf("Generation successful result returned in: %v%s", green(end-start), green("ms")), logObj)
	return c.Status(http.StatusOK).JSON(SGenerateResponse{
		Data: SGenerateResponseData{
			ImageB64:   output,
			DurationMs: generationCogDurationMs,
		},
	})
}

type SGenerateResponse struct {
	Data  SGenerateResponseData `json:"data,omitempty"`
	Error string                `json:"error,omitempty"`
}

type SGenerateResponseData struct {
	ImageB64   string `json:"image_b64"`
	DurationMs int64  `json:"duration_ms"`
}
