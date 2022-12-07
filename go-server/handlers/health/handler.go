package health

import (
	"log"
	"net/http"
	"time"

	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	cronHealth "github.com/yekta/stablecog/go-server/cron/health"
	"github.com/yekta/stablecog/go-server/shared"
)

var green = color.New(color.FgHiGreen).SprintFunc()
var magenta = color.New(color.FgHiMagenta).SprintFunc()
var red = color.New(color.FgHiRed).SprintFunc()
var defaultServerUrl = shared.GetEnv("PUBLIC_DEFAULT_SERVER_URL")

var defaultServerModels = []string{
	"Stable Diffusion v1.5",
	"Openjourney",
	"Redshift Diffusion",
	"Arcane Diffusion",
	"Mo-Di Diffusion",
	"Ghibli Diffusion",
}
var defaultServerSchedulers = []string{
	"K_LMS",
	"K_EULER",
	"K_EULER_ANCESTRAL",
}
var defaultServerFeatures = []shared.SFeature{
	{Name: "upscale"},
	{Name: "negative_prompt"},
	{Name: "model", Values: defaultServerModels},
	{Name: "scheduler", Values: defaultServerSchedulers},
}

func Handler(c *fiber.Ctx) error {
	start := time.Now().UTC().UnixMilli()
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
		res := shared.SHealthResponse{
			Status:   "unhealthy",
			Features: defaultServerFeatures,
		}
		if hasHealthyAndEnabled {
			res.Status = "healthy"
		}
		logEnd(start)
		return c.JSON(res)
	}
	healthRes := shared.CheckServer(req.ServerUrl)
	logEnd(start)
	return c.JSON(healthRes)
}

func logEnd(start int64) {
	end := time.Now().UTC().UnixMilli()
	log.Printf("-- Health - Returned server health response in: %s --", green(end-start, "ms"))
}

type SHealthRequestBody struct {
	ServerUrl string `json:"server_url"`
}
