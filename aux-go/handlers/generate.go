package handlers

import (
	"bytes"
	"fmt"
	"github.com/goccy/go-json"
	"log"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/yekta/stablecog/aux-go/queries"
	"github.com/yekta/stablecog/aux-go/shared"
)

func Generate(c *fiber.Ctx) error {
	start := time.Now().UTC().UnixNano()
	var req shared.SGenerateRequestBody
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON("Bad request")
	}
	pickServerRes := queries.PickServerUrl(req.ServerUrl)
	if pickServerRes.Error {
		return c.Status(http.StatusInternalServerError).JSON("Could not pick a server URL")
	}
	cogReq := shared.SCogGenerateRequestBody{
		Input: shared.SCogGenerateRequestInput{
			Prompt:         req.Prompt,
			Width:          fmt.Sprint(req.Width),
			Height:         fmt.Sprint(req.Height),
			OutputImageExt: "jpg",
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
	log.Printf("JSON decode in: %v ms", (endJson-startJson)/1000000)
	if cogResBodyErr != nil {
		return c.Status(http.StatusInternalServerError).JSON("Couldn't decode cog response body")
	}
	end := time.Now().UTC().UnixNano()
	log.Printf("Generate completed in: %v ms", (end-start)/1000000)
	return c.Status(http.StatusOK).JSON(cogResBody)
}
