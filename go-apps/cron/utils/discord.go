package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"
)

func SendDiscordNotificationIfNeeded(
	status string,
	statusPrev string,
	servers []shared.SDBServer,
	serversStateChanged bool,
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
		!serversStateChanged &&
		((status == "unhealthy" && sinceUnhealthyNotification < unhealthyNotificationInterval) ||
			(status == "healthy" && sinceHealthyNotification < healthyNotificationInterval))) {
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
