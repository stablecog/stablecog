package cronHealth

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/yekta/stablecog/go-server/shared"
)

var lastNotificationTime time.Time
var lastHealthyNotificationTime time.Time
var lastUnhealthyNotificationTime time.Time
var discordWebhookUrl = shared.GetEnv("DISCORD_WEBHOOK_URL", "")

const unhealthyNotificationInterval = 5 * time.Minute
const healthyNotificationInterval = 1 * time.Hour
const rTTL = 2 * time.Hour

var groupKey = "discord_notification"

func SendDiscordNotificationIfNeeded(
	status string,
	statusPrev string,
	generations []shared.SDBGeneration,
	lastGenerationTime time.Time,
	lastCheckTime time.Time,
) {
	var rctx = shared.Redis.Context()
	lastHealthyKey := fmt.Sprintf("%s:last_healthy", groupKey)
	lastUnhealthyKey := fmt.Sprintf("%s:last_unhealthy", groupKey)
	lastHealthyStr := shared.Redis.Get(rctx, lastHealthyKey).Val()
	lastUnhealthyStr := shared.Redis.Get(rctx, lastUnhealthyKey).Val()
	lastHealthyNotificationTime, _ = time.Parse(time.RFC3339, lastHealthyStr)
	lastUnhealthyNotificationTime, _ = time.Parse(time.RFC3339, lastUnhealthyStr)

	sinceHealthyNotification := time.Since(lastHealthyNotificationTime)
	sinceUnhealthyNotification := time.Since(lastUnhealthyNotificationTime)

	if statusPrev == "unknown" || (status == statusPrev &&
		((status == "unhealthy" && sinceUnhealthyNotification < unhealthyNotificationInterval) ||
			(status == "healthy" && sinceHealthyNotification < healthyNotificationInterval))) {
		log.Printf("Skipping Discord notification, not needed")
		return
	}

	start := time.Now().UnixMilli()
	log.Printf("Sending Discord notification...")
	webhookBody := getDiscordWebhookBody(status, generations, lastGenerationTime, lastCheckTime)
	reqBody, err := json.Marshal(webhookBody)
	if err != nil {
		log.Printf("Error marshalling webhook body: %s", err)
		return
	}
	res, postErr := http.Post(discordWebhookUrl, "application/json", bytes.NewBuffer(reqBody))
	if postErr != nil {
		log.Printf("Error sending webhook: %s", postErr)
	}
	lastNotificationTime = time.Now()
	if status == "healthy" {
		err := shared.Redis.Set(rctx, lastHealthyKey, lastNotificationTime.Format(time.RFC3339), rTTL).Err()
		if err != nil {
			log.Printf("Redis - Error setting last healthy key: %v", err)
		}
	} else {
		err := shared.Redis.Set(rctx, lastUnhealthyKey, lastNotificationTime.Format(time.RFC3339), rTTL).Err()
		if err != nil {
			log.Printf("Redis - Error setting last unhealthy key: %v", err)
		}
	}
	end := time.Now().UnixMilli()
	log.Printf("Sent Discord notification in: %dms", end-start)
	defer res.Body.Close()
}

func getDiscordWebhookBody(
	status string,
	generations []shared.SDBGeneration,
	lastGenerationTime time.Time,
	lastCheckTime time.Time,
) shared.SDiscordWebhookBody {
	var statusStr string
	if status == "unhealthy" {
		statusStr = "🔴💀🔴"
	} else {
		statusStr = "🟢👌🟢"
	}
	generationsStr := ""
	generationsStrArr := []string{}
	for _, generation := range generations {
		if generation.Status == "failed" {
			if generation.FailureReason == "NSFW" {
				generationsStrArr = append(generationsStrArr, "🌶️")
			} else {
				generationsStrArr = append(generationsStrArr, "🔴")
			}
		} else if generation.Status == "started" {
			generationsStrArr = append(generationsStrArr, "🟡")
		} else {
			generationsStrArr = append(generationsStrArr, "🟢")
		}
	}
	generationsStr = strings.Join(generationsStrArr, "")
	body := shared.SDiscordWebhookBody{
		Embeds: []shared.SDiscordWebhookEmbed{
			{
				Color: 11437547,
				Fields: []shared.SDiscordWebhookField{
					{
						Name:  "Status",
						Value: fmt.Sprintf("```%s```", statusStr),
					},
					{
						Name:  "Generations",
						Value: fmt.Sprintf("```%s```", generationsStr),
					},
					{
						Name:  "Last Generation",
						Value: fmt.Sprintf("```%s```", shared.RelativeTimeStr(lastGenerationTime)),
					},
				},
				Footer: shared.SDiscordWebhookEmbedFooter{
					Text: lastCheckTime.Format(time.RFC1123),
				},
			},
		},
		Attachments: []shared.SDiscordWebhookAttachment{},
	}
	return body
}
