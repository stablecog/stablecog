package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/h2non/bimg"
	cronStats "github.com/yekta/stablecog/go-server/cron/stats"
	"github.com/yekta/stablecog/go-server/handlers/detect_language"
	"github.com/yekta/stablecog/go-server/handlers/gallery"
	"github.com/yekta/stablecog/go-server/handlers/generate"
	"github.com/yekta/stablecog/go-server/handlers/health"
	queueUpload "github.com/yekta/stablecog/go-server/handlers/queue/upload"
	queueWebhook "github.com/yekta/stablecog/go-server/handlers/queue/webhook"
	"github.com/yekta/stablecog/go-server/handlers/upscale"
	"github.com/yekta/stablecog/go-server/handlers/user"
	"github.com/yekta/stablecog/go-server/shared"
)

func main() {
	err := sentry.Init(sentry.ClientOptions{
		Dsn:              shared.SENTRY_DSN_URL,
		TracesSampleRate: 1.0,
	})
	if err != nil {
		log.Fatalf("sentry.Init: %s", err)
	}
	defer sentry.Flush(2 * time.Second)

	serverPort := flag.Int("port", 3001, "Port to listen on")

	bimg.Initialize()
	bimg.VipsCacheSetMaxMem(0)
	bimg.VipsCacheSetMax(0)
	defer bimg.Shutdown()

	// ! I don't like either of these
	shared.SetupRedis()
	shared.InitSyncMap()
	shared.PrimeLanguageDetector()

	app := fiber.New()
	cors := cors.New(cors.Config{
		AllowOrigins:     fmt.Sprintf("%s, %s, %s, %s", shared.GetEnv("PUBLIC_CANONICAL_URL", ""), "https://stablecog.vercel.app", "http://localhost:5173", "http://localhost:3000"),
		AllowCredentials: true,
	})
	app.Use(cors)

	// cron := cron.New()

	if !shared.IsDev {
		shared.RandomWaitMs(5000)
	}
	// cron.AddFunc("@every 15s", cronHealth.CheckHealth)
	// cron.AddFunc("@every 10s", cronStats.GetAndSetStats)
	// cron.AddFunc("@every 60s", cronMeili.SyncMeili)
	// cron.Start()

	// go cronHealth.CheckHealth()
	// go cronStats.GetAndSetStats()
	// go cronMeili.SyncMeili()

	app.Post("/generate", generate.Handler)
	app.Post("/v2/generate", generate.HandlerV2)
	app.Post("/upscale", upscale.Handler)
	app.Post("/v2/upscale", upscale.HandlerV2)
	app.Get("/gallery", gallery.Handler)
	app.Post("/health", health.Handler)
	app.Get("/stats", func(c *fiber.Ctx) error {
		return c.JSON(cronStats.Stats)
	})
	app.Post("/detect_language", detect_language.Handler)

	app.Post(fmt.Sprintf("/queue/webhook/%s", shared.QUEUE_SECRET), queueWebhook.Handler)
	app.Put(fmt.Sprintf("/queue/upload/%s/*", shared.QUEUE_SECRET), queueUpload.Handler)

	app.Get("/user/generations", user.GenerationsHandler)

	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.SendString("pong")
	})
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("API is up and running")
	})

	// Subscribe to webhook channel
	ctx := context.Background()
	pubsub := shared.Redis.Subscribe(ctx, shared.WEBHOOK_QUEUE_COMPLETE_CHANNEL)
	defer pubsub.Close()

	// Listen for messages
	go func() {
		log.Printf("Listening for webhook messages on channel: %s", shared.WEBHOOK_QUEUE_COMPLETE_CHANNEL)
		for msg := range pubsub.Channel() {
			log.Printf("Received webhook message: %s", msg.Payload)
			var WebhookMessage shared.WebhookRequest
			err := json.Unmarshal([]byte(msg.Payload), &WebhookMessage)
			if err != nil {
				log.Printf("--- Error unmarshalling webhook message: %v", err)
				sentry.CaptureException(err)
				continue
			}

			activeChannel := shared.RequestSyncMap.Get(WebhookMessage.Input.Id)
			// Write to channel
			if activeChannel != nil {
				activeChannel <- WebhookMessage
			}
		}
	}()

	log.Printf("Listening on port %d", *serverPort)
	log.Fatal(app.Listen(fmt.Sprintf(":%d", *serverPort)))
}
