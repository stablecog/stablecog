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
const maxGenerationDuration = 2 * time.Minute
const healthyNotificationInterval = 1 * time.Hour

func SendDiscordNotificationIfNeeded(
	status string,
	statusPrev string,
	servers []shared.SDBServer,
	serversStateChanged bool,
	generations []shared.SDBGeneration,
	lastGenerationTime time.Time,
	lastCheckTime time.Time,
) {
	if shared.IsDev {
		log.Printf("Not sending Discord notification in dev mode")
		return
	}
	sinceHealthyNotification := time.Since(lastHealthyNotificationTime)
	sinceUnhealthyNotification := time.Since(lastUnhealthyNotificationTime)
	if status == statusPrev &&
		!serversStateChanged &&
		((status == "unhealthy" && sinceUnhealthyNotification < unhealthyNotificationInterval) ||
			(status == "healthy" && sinceHealthyNotification < healthyNotificationInterval)) {
		log.Printf("Skipping Discord notification, not needed")
		return
	}
	start := time.Now().UnixMilli()
	log.Printf("Sending Discord notification...")
	webhookBody := getDiscordWebhookBody(status, servers, generations, lastGenerationTime, lastCheckTime)
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
		lastHealthyNotificationTime = lastNotificationTime
	} else {
		lastUnhealthyNotificationTime = lastNotificationTime
	}
	end := time.Now().UnixMilli()
	log.Printf("Sent Discord notification in: %dms", end-start)
	defer res.Body.Close()
}

func getDiscordWebhookBody(
	status string,
	servers []shared.SDBServer,
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
	serversStr := ""
	serversStrArr := []string{}
	generationsStr := ""
	generationsStrArr := []string{}
	for _, server := range servers {
		if !server.Enabled {
			serversStrArr = append(serversStrArr, "🖥️⚪️")
		} else if server.Healthy {
			serversStrArr = append(serversStrArr, "🖥️🟢")
		} else {
			serversStrArr = append(serversStrArr, "🖥️🔴")
		}
	}
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
	serversStr = strings.Join(serversStrArr, "  ")
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
						Name:  "Servers",
						Value: fmt.Sprintf("```%s```", serversStr),
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
