package detect_language

import (
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/pemistahl/lingua-go"
)

var detector = lingua.NewLanguageDetectorBuilder().FromAllLanguages().Build()

func Handler(c *fiber.Ctx) error {
	var req SRequestBody
	if err := c.BodyParser(&req); err != nil {
		log.Printf("-- Invalid request body: %v --", err)
		return c.Status(http.StatusBadRequest).JSON("Invalid request body")
	}
	values := detector.ComputeLanguageConfidenceValues(req.Text)
	valueNames := make([]SValue, len(values))
	for i, value := range values {
		valueNames[i] = SValue{
			Language:   value.Language().IsoCode639_3().String(),
			Confidence: value.Value(),
		}
	}
	return c.JSON(valueNames)
}

type SRequestBody struct {
	Text string `json:"text"`
}

type SValue struct {
	Language   string  `json:"language"`
	Confidence float64 `json:"confidence"`
}
