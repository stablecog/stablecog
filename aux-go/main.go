package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/robfig/cron/v3"
	"github.com/yekta/stablecog/aux-go/health"
)

func main() {
	serverPort := flag.Int("port", 3001, "Port to listen on")

	app := fiber.New()
	cors := cors.New()
	app.Use(cors)

	cron := cron.New()
	cron.AddFunc("@every 15s", health.CheckAndNotify)
	cron.Start()

	go health.CheckAndNotify()

	log.Fatal(app.Listen(fmt.Sprintf(":%d", *serverPort)))
}
