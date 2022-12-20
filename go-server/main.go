package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/davidbyttow/govips/v2/vips"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/robfig/cron/v3"
	"github.com/yekta/stablecog/go-server/cron/health"
	"github.com/yekta/stablecog/go-server/handlers/gallery"
	"github.com/yekta/stablecog/go-server/handlers/generate"
	generationGImage "github.com/yekta/stablecog/go-server/handlers/generation-g-image"
	"github.com/yekta/stablecog/go-server/handlers/health"
	"github.com/yekta/stablecog/go-server/handlers/upscale"
	"github.com/yekta/stablecog/go-server/shared"
)

func main() {
	serverPort := flag.Int("port", 3001, "Port to listen on")

	vips.Startup(nil)
	defer vips.Shutdown()

	shared.SetSeed()

	app := fiber.New()
	cors := cors.New(cors.Config{
		AllowOrigins: fmt.Sprintf("%s, %s, %s, %s", shared.GetEnv("PUBLIC_CANONICAL_URL"), "https://stablecog.vercel.app", "http://localhost:5173", "http://localhost:3000"),
	})
	app.Use(cors)

	cron := cron.New()

	cron.AddFunc("@every 10s", cronHealth.CheckHealth)
	cron.AddFunc("@every 10s", cronHealth.SetDefaultServerHealths)
	cron.Start()
	go cronHealth.CheckHealth()
	go cronHealth.SetDefaultServerHealths()

	app.Post("/generate", generate.Handler)
	app.Post("/upscale", upscale.Handler)
	app.Get("/gallery", gallery.Handler)
	app.Post("/health", health.Handler)
	app.Get("/generation-g-image/:imageIdWithExt", generationGImage.Handler)

	app.Put("/test", func(c *fiber.Ctx) error {
		log.Printf("PUT /test")
		return c.SendString("OK")
	})
	app.Get("/test", func(c *fiber.Ctx) error {
		log.Printf("GET /test")
		return c.SendString("OK")
	})
	app.Post("/test", func(c *fiber.Ctx) error {
		log.Printf("POST /test")
		return c.SendString("OK")
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("API is up and running")
	})

	log.Fatal(app.Listen(fmt.Sprintf(":%d", *serverPort)))
}
