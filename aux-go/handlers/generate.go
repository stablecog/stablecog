package handlers

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
	"github.com/yekta/stablecog/aux-go/loggers"
	"github.com/yekta/stablecog/aux-go/queries"
	"github.com/yekta/stablecog/aux-go/shared"
)

var green = color.New(color.FgHiGreen).SprintFunc()

func Generate(c *fiber.Ctx) error {
	start := time.Now().UTC().UnixNano()
	var req shared.SGenerateRequestBody
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON("Bad request")
	}
	rand.Seed(time.Now().Unix())

	if req.Seed == -1 {
		req.Seed = rand.Intn(shared.MaxSeed)
	}

	cleanedPrompt := shared.FormatPrompt(req.Prompt)
	cleanedNegativePrompt := shared.FormatPrompt(req.NegativePrompt)

	pickServerRes := queries.PickServerUrl(req.ServerUrl)
	if pickServerRes.Error {
		return c.Status(http.StatusInternalServerError).JSON("Could not pick a server URL")
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
		ServerUrl:         pickServerRes.ServerUrl,
	}
	loggers.LogGeneration("Generation started", logObj)
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
			OutputImageExt:    "jpg",
		},
	}
	cogReqBody, cogReqBodyErr := json.Marshal(cogReq)
	if cogReqBodyErr != nil {
		log.Printf("Error marshalling cog request body: %v", cogReqBodyErr)
		return c.Status(http.StatusInternalServerError).JSON("Couldn't marshal cog request body")
	}
	cogEndpoint := fmt.Sprintf("%s/predictions", pickServerRes.ServerUrl)
	cogRes, cogResErr := http.Post(cogEndpoint, "application/json", bytes.NewBuffer(cogReqBody))
	if cogResErr != nil {
		log.Printf("Error posting to cog server: %v", cogResErr)
		return c.Status(http.StatusInternalServerError).JSON("Cog request failed")
	}
	if cogRes.StatusCode != http.StatusOK {
		log.Printf("Cog server returned non-200 status code: %v", cogRes.StatusCode)
		return c.Status(http.StatusInternalServerError).JSON("Cog request failed")
	}
	var cogResBody shared.SCogGenerateResponseBody
	startJson := time.Now().UTC().UnixNano()
	cogResBodyErr := json.NewDecoder(cogRes.Body).Decode(&cogResBody)
	endJson := time.Now().UTC().UnixNano()
	loggers.LogGeneration(fmt.Sprintf("Generation JSON decode in: %v%s", green((endJson-startJson)/1000000), green("ms")), logObj)
	if cogResBodyErr != nil {
		return c.Status(http.StatusInternalServerError).JSON("Couldn't decode cog response body")
	}
	end := time.Now().UTC().UnixNano()
	loggers.LogGeneration(fmt.Sprintf("Generation completed in: %v%s", green((end-start)/1000000), green("ms")), logObj)
	return c.Status(http.StatusOK).JSON(cogResBody)
}
