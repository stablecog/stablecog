package health

import (
	"net/http"

	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	"github.com/yekta/stablecog/go-server/cron/health"
	"github.com/yekta/stablecog/go-server/shared"
)

var green = color.New(color.FgHiGreen).SprintFunc()
var magenta = color.New(color.FgHiMagenta).SprintFunc()
var red = color.New(color.FgHiRed).SprintFunc()
var defaultServerUrl = shared.GetEnv("PUBLIC_DEFAULT_SERVER_URL")

var serverFeatures = []string{"upscale", "generate"}

func Handler(c *fiber.Ctx) error {
	var req SHealthRequestBody
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusInternalServerError).JSON("Invalid request body")
	}
	if req.ServerUrl == "" {
		return c.Status(http.StatusBadRequest).JSON("Bad request, server_url is required")
	}
	if req.ServerUrl == defaultServerUrl {
		hasHealthyAndEnabled := false
		for _, server := range cronHealth.ServersLast {
			if server.Healthy && server.Enabled {
				hasHealthyAndEnabled = true
				break
			}
		}
		res := SHealthResponse{
			Status:   "unhealthy",
			Features: serverFeatures,
		}
		if hasHealthyAndEnabled {
			res.Status = "healthy"
		}
		return c.JSON(res)
	}
	return c.JSON(SHealthResponse{
		Status: "unhealthy",
	})
}

type SHealthRequestBody struct {
	ServerUrl string `json:"server_url"`
}

type SHealthResponse struct {
	Status   string   `json:"status"`
	Features []string `json:"features,omitempty"`
}
