package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	/* "github.com/robfig/cron/v3"
	scCron "github.com/yekta/stablecog/aux-go/cron" */
	"github.com/yekta/stablecog/aux-go/handlers"
)

func main() {
	serverPort := flag.Int("port", 3001, "Port to listen on")

	app := fiber.New()
	cors := cors.New()
	app.Use(cors)

	/* cron := cron.New()
	cron.AddFunc("@every 15s", scCron.CheckHealthAndNotify)
	cron.Start()

	go scCron.CheckHealthAndNotify() */

	app.Post("/generate", handlers.Generate)

	log.Fatal(app.Listen(fmt.Sprintf(":%d", *serverPort)))
}
