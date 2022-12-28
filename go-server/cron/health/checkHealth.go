package cronHealth

import (
	"log"
	"sync"
	"time"

	"github.com/fatih/color"
	"github.com/yekta/stablecog/go-server/shared"
)

const maxGenerationFailWithoutNSFWRate = 0.5
const generationCountToCheck = 10

var lastCheckTime time.Time
var lastGenerationTime time.Time
var lastStatus = "unknown"
var ServersLast []shared.SDBServer = make([]shared.SDBServer, 0)

const maxGenerationDuration = 2 * time.Minute

var red = color.New(color.FgHiRed).SprintFunc()

var firstTime = true

func CheckHealth() {
	start := time.Now()
	log.Printf("Checking health...")

	var generations []shared.SDBGeneration
	var servers []shared.SDBServer
	serversStateChanged := false

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		generations = shared.GetLastGenerations(generationCountToCheck)
		defer wg.Done()
	}()
	wg.Add(1)
	go func() {
		servers = shared.GetServers()
		defer wg.Done()
	}()
	wg.Wait()

	if servers == nil {
		log.Printf(red("Couldn't get servers"))
		return
	}
	if generations == nil {
		log.Printf(red("Couldn't get generations"))
		return
	}

	var generationsFailed int
	var generationsFailedWithoutNSFW int
	for i, generation := range generations {
		createdAt, err := time.Parse(shared.DBTimeLayout, generation.CreatedAt)
		if i == 0 {
			if err != nil {
				log.Printf("Couldn't parse createdAt: %s", red(err))
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
		for _, serverOld := range ServersLast {
			if serverOld.Url == server.Url {
				isNew = false
				if (serverOld.Enabled != server.Enabled || serverOld.Healthy != server.Healthy) && !firstTime {
					serversStateChanged = true
					break
				}
			}
		}
		if !serversStateChanged && isNew && !firstTime {
			serversStateChanged = true
		}
	}
	if len(ServersLast) != len(servers) {
		if !firstTime {
			serversStateChanged = true
		}
		ServersLast = make([]shared.SDBServer, len(servers))
	}
	copy(ServersLast, servers)
	firstTime = false
	lastStatusPrev := lastStatus
	if healthyServerCount == 0 || generationFailWithoutNSFWRate > maxGenerationFailWithoutNSFWRate {
		lastStatus = "unhealthy"
	} else {
		lastStatus = "healthy"
	}
	lastCheckTime = time.Now()
	log.Printf("Healthy servers (enabled): %d/%d", healthyServerCount, enabledServerCount)
	log.Printf("Healthy servers (all): %d/%d", healthyServerCount, len(servers))
	log.Printf("Done checking health in: %dms", lastCheckTime.Sub(start).Milliseconds())

	go SendDiscordNotificationIfNeeded(
		lastStatus,
		lastStatusPrev,
		servers,
		serversStateChanged,
		generations,
		lastGenerationTime,
		lastCheckTime,
	)
}
