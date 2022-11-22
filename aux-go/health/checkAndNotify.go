package health

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
	structs "github.com/yekta/stablecog/aux-go/structs"
)

const maxGenerationFailRate = 0.5
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

func CheckAndNotify() {
	start := time.Now()
	log.Printf("Checking health...")

	var generations []structs.SDBGeneration
	var servers []structs.SDBServer

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
		} else if generation.Status == "started" && time.Now().Sub(createdAt) > maxGenerationDuration {
			generationsFailed++
		}
	}
	generationFailRate := float64(generationsFailed) / float64(len(generations))
	log.Printf("Generation fail rate: %d/%d", generationsFailed, len(generations))

	var healthyServerCount int
	var enabledServerCount int
	for _, server := range servers {
		if server.Healthy && server.Enabled {
			healthyServerCount++
		}
		if server.Enabled {
			enabledServerCount++
		}
	}
	lastStatusPrev := lastStatus
	if healthyServerCount == 0 || generationFailRate > maxGenerationFailRate {
		lastStatus = "unhealthy"
	} else {
		lastStatus = "healthy"
	}
	lastCheckTime = time.Now()
	sinceHealthyNotification := time.Since(lastHealthyNotificationTime)
	sinceUnhealthyNotification := time.Since(lastUnhealthyNotificationTime)
	if lastStatus != lastStatusPrev || (lastStatus == "unhealthy" && sinceUnhealthyNotification > maxUnhealthyNotificationInterval) ||
		(lastStatus == "healthy" && sinceHealthyNotification > maxHealthyNotificationInterval) {
		sendDiscordNotification(lastStatus, servers, generations, lastGenerationTime, lastCheckTime)
	}
	log.Printf("Healthy servers (enabled): %d/%d", healthyServerCount, enabledServerCount)
	log.Printf("Healthy servers (all): %d/%d", healthyServerCount, len(servers))
	log.Printf("Done checking health in: %s\n\n", lastCheckTime.Sub(start))
}

func sendDiscordNotification(
	status string,
	servers []structs.SDBServer,
	generations []structs.SDBGeneration,
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
	servers []structs.SDBServer,
	generations []structs.SDBGeneration,
	lastGenerationTime time.Time,
	lastCheckTime time.Time,
) structs.SDiscordWebhookBody {
	var s string
	if status == "unhealthy" {
		s = "❌💀❌"
	} else {
		s = "🟢"
	}
	serversStr := ""
	serversStrArr := []string{}
	generationsStr := ""
	generationsStrArr := []string{}
	for _, server := range servers {
		if !server.Enabled {
			serversStrArr = append(serversStrArr, "🖥️ ⚪️")
		} else if server.Healthy {
			serversStrArr = append(serversStrArr, "🖥️ 🟢")
		} else {
			serversStrArr = append(serversStrArr, "🖥️ 🔴")
		}
	}
	for _, generation := range generations {
		if generation.Status == "failed" {
			generationsStrArr = append(generationsStrArr, "🔴")
		} else if generation.Status == "started" {
			generationsStrArr = append(generationsStrArr, "🕑")
		} else {
			generationsStrArr = append(generationsStrArr, "🟢")
		}
	}
	serversStr = strings.Join(serversStrArr, " --- ")
	generationsStr = strings.Join(generationsStrArr, " ")
	body := structs.SDiscordWebhookBody{
		Embeds: []structs.SDiscordWebhookEmbed{
			{
				Title: fmt.Sprintf("Health Status %s", s),
				Color: 11437547,
				Fields: []structs.SDiscordWebhookField{
					{
						Name:  "Servers",
						Value: serversStr,
					},
					{
						Name:  "Generations",
						Value: generationsStr,
					},
					{
						Name:  "Last Generation",
						Value: shared.RelativeTimeStr(lastGenerationTime),
					},
				},
				Footer: structs.SDiscordWebhookEmbedFooter{
					Text: lastCheckTime.Format(time.RFC1123),
				},
			},
		},
		Attachments: []structs.SDiscordWebhookAttachment{},
	}
	return body
}
