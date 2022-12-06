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
	"github.com/yekta/stablecog/go-server/handlers/upscale"
	"github.com/yekta/stablecog/go-server/shared"
)

func main() {
	serverPort := flag.Int("port", 3001, "Port to listen on")

	vips.Startup(nil)
	defer vips.Shutdown()

	app := fiber.New()
	cors := cors.New(cors.Config{
		AllowOrigins: fmt.Sprintf("%s, %s, %s", shared.GetEnv("PUBLIC_CANONICAL_URL"), "http://localhost:5173", "http://localhost:3000"),
	})
	app.Use(cors)

	cron := cron.New()

	cron.AddFunc("@every 15s", health.CheckHealthAndNotify)
	cron.Start()
	go health.CheckHealthAndNotify()

	app.Post("/generate", generate.Handler)
	app.Post("/upscale", upscale.Handler)
	app.Get("/gallery", gallery.Handler)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("API is up and running")
	})

	log.Fatal(app.Listen(fmt.Sprintf(":%d", *serverPort)))
}
