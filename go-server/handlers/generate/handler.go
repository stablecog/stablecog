package generate

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/getsentry/sentry-go"
	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"

	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	"github.com/mileusna/useragent"
	"github.com/yekta/stablecog/go-server/loggers"
	"github.com/yekta/stablecog/go-server/shared"
)

var green = color.New(color.FgHiGreen).SprintFunc()
var yellow = color.New(color.FgHiYellow).SprintFunc()

var GENERATION_MIN_WAIT_FREE = shared.GetDurationFromEnv("GENERATION_MIN_WAIT_FREE", "10")

func Handler(c *fiber.Ctx) error {
	start := time.Now().UTC().UnixMilli()

	countryCode := c.Get("CF-IPCountry")
	if countryCode == "" {
		countryCode = c.Get("X-Vercel-IP-Country")
	}

	var req shared.SGenerateRequestBody
	if err := c.BodyParser(&req); err != nil {
		log.Printf("-- Invalid request body: %v --", err)
		sentry.CaptureException(err)
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "Invalid request body"},
		)
	}
	if req.Seed == -1 {
		rand.Seed(time.Now().Unix())
		req.Seed = rand.Intn(shared.MaxSeed)
	}
	if req.Width > shared.MaxWidth {
		log.Printf("Width is too large: %d", req.Width)
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: fmt.Sprintf("Width is too large, max is: %d", shared.MaxWidth)},
		)
	}
	if req.Height > shared.MaxHeight {
		log.Printf("Height is too large: %d", req.Height)
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: fmt.Sprintf("Height is too large, max is: %d", shared.MaxHeight)},
		)
	}
	if req.Width*req.Height*req.NumInferenceSteps >= shared.MaxProPixelSteps {
		log.Printf(
			"Pick fewer inference steps or smaller dimensions: %d - %d - %d",
			req.Width,
			req.Height,
			req.NumInferenceSteps,
		)
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "Pick fewer inference steps or smaller dimensions"},
		)
	}
	if shared.ModelIdToModelNameCog[req.ModelId] == "" {
		log.Printf("Invalid model ID: %s", req.ModelId)
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "Invalid model ID"},
		)
	}
	if shared.SchedulerIdToSchedulerNameCog[req.SchedulerId] == "" {
		log.Printf("Invalid scheduler ID: %s", req.SchedulerId)
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "Invalid scheduler ID"},
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
			log.Printf("Generation - Failed to get user tier: %v", err)
		} else {
			subscriptionTier = res.SubsciptionTier
			plan = res.SubsciptionTier
		}
	} else {
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "You need to create an account to generate images."},
		)
	}

	log.Printf("///// Generation - User plan: %s /////", plan)

	if plan != "PRO" && plan != "FREE" {
		return c.Status(http.StatusBadRequest).JSON(
			SGenerateResponse{Error: "You need to create an account to generate images."},
		)
	}

	// Generation setting checks for the free tier
	if plan == "FREE" {
		if shared.Contains(shared.AvailableModelIdsFree, req.ModelId) == false {
			return c.Status(http.StatusBadRequest).JSON(
				SGenerateResponse{Error: "That model is not available on the free plan :("},
			)
		}
		if shared.Contains(shared.AvailableWidthsFree, req.Width) == false {
			return c.Status(http.StatusBadRequest).JSON(
				SGenerateResponse{Error: "That generation width is not available on the free plan :("},
			)
		}
		if shared.Contains(shared.AvailableHeightsFree, req.Height) == false {
			return c.Status(http.StatusBadRequest).JSON(
				SGenerateResponse{Error: "That generation height is not available on the free plan :("},
			)
		}
		if shared.Contains(shared.AvailableInferenceStepsFree, req.NumInferenceSteps) == false {
			return c.Status(http.StatusBadRequest).JSON(
				SGenerateResponse{Error: "That inference steps setting is not available on the free plan :("},
			)
		}
		if shared.Contains(shared.AvailableSchedulerIdsFree, req.SchedulerId) == false {
			return c.Status(http.StatusBadRequest).JSON(
				SGenerateResponse{Error: "That scheduler is not available on the free plan :("},
			)
		}
	}

	if plan == "FREE" {
		duration := GENERATION_MIN_WAIT_FREE
		rateLimitedResponse := SGenerateResponse{Error: fmt.Sprintf("You can only start a generation once every %d seconds on the free plan.", int(GENERATION_MIN_WAIT_FREE.Seconds()))}
		isRateLimited := shared.IsRateLimited("goa", duration, supabaseUserId)
		if isRateLimited {
			log.Printf("-- Generation - Rate limited!: %s --", countryCode)
			return c.Status(http.StatusTooManyRequests).JSON(rateLimitedResponse)
		}
	}

	HasOnGoingGenerationOrUpscale := shared.HasOnGoingGenerationOrUpscale("goa_active", supabaseUserId)
	onGoingGenerationOrUpscaleResponse := SGenerateResponse{Error: "Please wait for your ongoing generation or upscale to finish."}
	if HasOnGoingGenerationOrUpscale {
		log.Printf("-- Generation - Has ongoing generation!: %s --", countryCode)
		return c.Status(http.StatusTooManyRequests).JSON(onGoingGenerationOrUpscaleResponse)
	}

	durationOngoing := 15 * time.Second
	shared.SetOngoingGenerationOrUpscale("goa_active", durationOngoing, supabaseUserId)

	if plan == "FREE" {
		time.Sleep(GENERATION_MIN_WAIT_FREE)
	}

	if req.OutputImageExt == "" {
		req.OutputImageExt = "jpg"
	}

	cleanedPrompt := shared.FormatPrompt(req.Prompt)
	cleanedNegativePrompt := shared.FormatPrompt(req.NegativePrompt)

	pickServerRes := shared.PickServer(
		shared.SPickServerProps{
			Type:        "generate",
			ServerUrl:   req.ServerUrl,
			ModelId:     req.ModelId,
			SchedulerId: req.SchedulerId,
		})
	if pickServerRes.Error {
		log.Printf("Failed to pick a server")
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SGenerateResponse{Error: "Failed to pick a server"},
		)
	}

	userAgent := c.Get("User-Agent")
	client := useragent.Parse(userAgent)
	generationIdChan := make(chan string)

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
		UserId:            supabaseUserId,
		ServerUrl:         pickServerRes.ServerUrl,
		CountryCode:       countryCode,
		UserAgent:         userAgent,
		DeviceType:        shared.GetDeviceType(client),
		DeviceOS:          client.OS,
		DeviceBrowser:     client.Name,
		LogObject:         logObj,
		GenerationIdChan:  generationIdChan,
		UserTier:          subscriptionTier,
	})
	requestId := uuid.NewString()
	cogReqBody := shared.SCogGenerateRequestQueue{
		WebhookEventsFilter: []shared.WebhookEventFilterOption{"start", "completed"},
		Webhook:             fmt.Sprintf("%s/queue/webhook/%s", shared.PUBLIC_API_URL, shared.QUEUE_SECRET),
		Input: shared.SCogGenerateRequestInput{
			ID:                requestId,
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
	generationCogStart := time.Now().UTC().UnixMilli()

	// ! Start V2 stuff
	// Create channel
	generateChannel := make(chan shared.WebhookRequest)
	// Cleanup
	defer close(generateChannel)
	// Add channel to sync array (basically a thread-safe map)
	shared.RequestSyncMap.Put(requestId, generateChannel)
	// Cleanup
	defer shared.RequestSyncMap.Delete(requestId)

	// Send request to cog
	_, err := shared.Redis.XAdd(c.Context(), &redis.XAddArgs{
		Stream: "input_queue",
		ID:     "*", // Auto generate ID
		Values: []interface{}{"value", cogReqBody},
	}).Result()
	if err != nil {
		generationCogEnd := time.Now().UTC().UnixMilli()
		go UpdateGenerationAsFailed(generationIdChan, generationCogEnd-generationCogStart, false)
		log.Printf("Failed to write request %s to queue: %v", requestId, err)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SGenerateResponse{Error: "Unable to add request to queue"},
		)
	}

	// Wait for response on generateChannel with timeout
	var output string
	select {
	case response := <-generateChannel:
		if response.Status == shared.WebhookFailed {
			generationCogEnd := time.Now().UTC().UnixMilli()
			cogResErr := fmt.Errorf("%s", response.Error)
			go UpdateGenerationAsFailed(generationIdChan, generationCogEnd-generationCogStart, false)
			sentry.CaptureException(cogResErr)
			log.Printf("Cog request returned an error: %v", cogResErr)
			shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
			return c.Status(http.StatusInternalServerError).JSON(
				SGenerateResponse{Error: "Cog returned an error"},
			)
		}
		// ! Success response
		if len(response.Output) == 0 {
			generationCogEnd := time.Now().UTC().UnixMilli()
			go UpdateGenerationAsFailed(generationIdChan, generationCogEnd-generationCogStart, false)
			log.Printf("Cog server returned empty output: %s", requestId)
			shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
			return c.Status(http.StatusInternalServerError).JSON(
				SGenerateResponse{Error: "Cog server returned empty output"},
			)
		}
		output = response.Output[0]
		// Timeout
	case <-time.After(shared.GenerationOrUpscaleTimeout):
		generationCogEnd := time.Now().UTC().UnixMilli()
		go UpdateGenerationAsFailed(generationIdChan, generationCogEnd-generationCogStart, false)
		log.Printf("Cog request timed out: %v", requestId)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SGenerateResponse{Error: "Cog returned an error"},
		)
	}

	generationCogEnd := time.Now().UTC().UnixMilli()
	generationCogDurationMs := generationCogEnd - generationCogStart
	if output == "" {
		go UpdateGenerationAsFailed(generationIdChan, generationCogDurationMs, false)
		log.Printf("Cog server returned empty output")
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
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
	splitStr := strings.Split(output, "cloudflarestorage.com/")
	if len(splitStr) < 2 {
		go UpdateGenerationAsFailed(generationIdChan, generationCogDurationMs, false)
		log.Printf("Cog server returned invalid output: %s", output)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SGenerateResponse{Error: "Cog server returned invalid output"},
		)
	}
	key := splitStr[1]
	res, err := shared.S3Client.GetObject(c.Context(), &s3.GetObjectInput{
		Bucket: &shared.S3BucketPrivate,
		Key:    &key,
	})
	if err != nil {
		go UpdateGenerationAsFailed(generationIdChan, generationCogDurationMs, false)
		log.Printf("Failed to get object from S3: %v", err)
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
		return c.Status(http.StatusInternalServerError).JSON(
			SGenerateResponse{Error: "Couldn't get the object from the bucket"},
		)
	}
	defer res.Body.Close()
	bytes, err := ioutil.ReadAll(res.Body)
	// Convert bytes to base64 string
	output = base64.StdEncoding.EncodeToString(bytes)
	output = "data:image/jpeg;base64," + output

	isNSFW := IsNSFW(output)
	if isNSFW {
		go UpdateGenerationAsFailed(generationIdChan, generationCogDurationMs, true)
		log.Printf("NSFW error")
		shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
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
		supabaseUserId,
		subscriptionTier,
		output,
	)
	if req.ShouldSubmitToGallery {
		go SubmitToGallery(SSubmitToGalleryProps{
			PromptIdChan:         promptIdChan,
			NegativePromptIdChan: negativePromptIdChan,
			ImageB64:             output,
			ModelId:              req.ModelId,
			SchedulerId:          req.SchedulerId,
			GuidanceScale:        req.GuidanceScale,
			NumInferenceSteps:    req.NumInferenceSteps,
			Seed:                 req.Seed,
			UserId:               supabaseUserId,
			UserTier:             subscriptionTier,
			Hidden:               true,
		})
	}
	end := time.Now().UTC().UnixMilli()
	loggers.LogGeneration(fmt.Sprintf("Generation successful result returned in: %v%s", green(end-start), green("ms")), logObj)
	shared.DeleteOngoingGenerationOrUpscale("goa_active", supabaseUserId)
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
