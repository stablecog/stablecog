package cron

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	queries "github.com/yekta/stablecog/aux-go/queries"
	"github.com/yekta/stablecog/aux-go/shared"
)

const maxGenerationFailWithoutNSFWRate = 0.5
const generationCountToCheck = 10
const timeLayout = "2006-01-02T15:04:05.999999-07:00"

var lastCheckTime time.Time
var lastGenerationTime time.Time
var lastStatus string
var lastNotificationTime time.Time
var lastHealthyNotificationTime time.Time
var lastUnhealthyNotificationTime time.Time
var maxUnhealthyNotificationInterval = 5 * time.Minute
var maxGenerationDuration = 2 * time.Minute
var maxHealthyNotificationInterval = 1 * time.Hour
var discordWebhookUrl = shared.GetEnv("DISCORD_WEBHOOK_URL")
var serversLast []shared.SDBServer = make([]shared.SDBServer, 0)

func CheckHealthAndNotify() {
	start := time.Now()
	log.Printf("Checking health...")

	var generations []shared.SDBGeneration
	var servers []shared.SDBServer
	serversStateChanged := false

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		generations = queries.GetGenerations(generationCountToCheck)
		defer wg.Done()
	}()
	wg.Add(1)
	go func() {
		servers = queries.GetServers()
		defer wg.Done()
	}()
	wg.Wait()

	var generationsFailed int
	var generationsFailedWithoutNSFW int
	for i, generation := range generations {
		createdAt, err := time.Parse(timeLayout, generation.CreatedAt)
		if i == 0 {
			if err != nil {
				log.Println(err)
				return
			}
			lastGenerationTime = createdAt
		}
		if generation.Status == "failed" {
			generationsFailed++
			if generation.FailureReason != "NSFW" {
				generationsFailedWithoutNSFW++
			}
		} else if generation.Status == "started" && time.Now().Sub(createdAt) > maxGenerationDuration {
			generationsFailed++
			generationsFailedWithoutNSFW++
		}
	}
	/* generationFailRate := float64(generationsFailed) / float64(len(generations)) */
	generationFailWithoutNSFWRate := float64(generationsFailedWithoutNSFW) / float64(len(generations))
	log.Printf("Generation fail rate: %d/%d", generationsFailed, len(generations))
	log.Printf("Generation fail rate without NSFW: %d/%d", generationsFailedWithoutNSFW, len(generations))

	var healthyServerCount int
	var enabledServerCount int
	for _, server := range servers {
		if server.Healthy && server.Enabled {
			healthyServerCount++
		}
		if server.Enabled {
			enabledServerCount++
		}
		isNew := true
		for _, serverOld := range serversLast {
			if serverOld.Url == server.Url {
				isNew = false
				if serverOld.Enabled != server.Enabled || serverOld.Healthy != server.Healthy {
					serversStateChanged = true
					break
				}
			}
		}
		if !serversStateChanged && isNew {
			serversStateChanged = true
		}
	}
	if len(serversLast) != len(servers) {
		serversStateChanged = true
		serversLast = make([]shared.SDBServer, len(servers))
	}
	copy(serversLast, servers)
	if serversStateChanged {
		log.Printf("Servers state changed")
	}
	lastStatusPrev := lastStatus
	if healthyServerCount == 0 || generationFailWithoutNSFWRate > maxGenerationFailWithoutNSFWRate {
		lastStatus = "unhealthy"
	} else {
		lastStatus = "healthy"
	}
	lastCheckTime = time.Now()
	sinceHealthyNotification := time.Since(lastHealthyNotificationTime)
	sinceUnhealthyNotification := time.Since(lastUnhealthyNotificationTime)
	if lastStatus != lastStatusPrev || (lastStatus == "unhealthy" && sinceUnhealthyNotification > maxUnhealthyNotificationInterval) ||
		(lastStatus == "healthy" && sinceHealthyNotification > maxHealthyNotificationInterval) || serversStateChanged {
		sendDiscordNotification(lastStatus, servers, generations, lastGenerationTime, lastCheckTime)
	}
	log.Printf("Healthy servers (enabled): %d/%d", healthyServerCount, enabledServerCount)
	log.Printf("Healthy servers (all): %d/%d", healthyServerCount, len(servers))
	log.Printf("Done checking health in: %d ms\n\n", lastCheckTime.Sub(start).Milliseconds())
}

func sendDiscordNotification(
	status string,
	servers []shared.SDBServer,
	generations []shared.SDBGeneration,
	lastGenerationTime time.Time,
	lastCheckTime time.Time,
) {
	webhookBody := getDiscordWebhookBody(status, servers, generations, lastGenerationTime, lastCheckTime)
	reqBody, err := json.Marshal(webhookBody)
	if err != nil {
		log.Fatalln(err)
		return
	}
	res, postErr := http.Post(discordWebhookUrl, "application/json", bytes.NewBuffer(reqBody))
	if postErr != nil {
		log.Fatalln(postErr)
	}
	lastNotificationTime = time.Now()
	if status == "healthy" {
		lastHealthyNotificationTime = lastNotificationTime
	} else {
		lastUnhealthyNotificationTime = lastNotificationTime
	}
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
