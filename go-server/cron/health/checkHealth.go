package cronHealth

import (
	"log"
	"sync"
	"time"

	"github.com/fatih/color"
	"github.com/yekta/stablecog/go-server/shared"
)

const maxGenerationFailWithoutNSFWRate = 0.4
const generationCountToCheck = 10

var lastCheckTime time.Time
var lastGenerationTime time.Time
var lastStatus = "unknown"

const maxGenerationDuration = 2 * time.Minute

var red = color.New(color.FgHiRed).SprintFunc()

var firstTime = true

func CheckHealth() {
	start := time.Now()
	log.Printf("Checking health...")

	var generations []shared.SDBGeneration

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		generations = shared.GetLastGenerations(generationCountToCheck)
		defer wg.Done()
	}()
	wg.Wait()

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

	firstTime = false
	lastStatusPrev := lastStatus
	if generationFailWithoutNSFWRate > maxGenerationFailWithoutNSFWRate {
		lastStatus = "unhealthy"
	} else {
		lastStatus = "healthy"
	}
	lastCheckTime = time.Now()
	log.Printf("Done checking health in: %dms", lastCheckTime.Sub(start).Milliseconds())

	go SendDiscordNotificationIfNeeded(
		lastStatus,
		lastStatusPrev,
		generations,
		lastGenerationTime,
		lastCheckTime,
	)
}
