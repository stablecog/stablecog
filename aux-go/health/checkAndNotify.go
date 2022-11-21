package health

import (
	"log"
	"sync"
	"time"

	queries "github.com/yekta/stablecog/aux-go/queries"
	structs "github.com/yekta/stablecog/aux-go/structs"
)

const minSuccessRate = 0.4
const generationCountToCheck = 10
const timeLayout = "2006-01-02T15:04:05.875888+00:00"

var lastCheckTime time.Time
var lastGenerationTime time.Time

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

	var succeeded int
	for i, generation := range generations {
		if i == 0 {
			time, err := time.Parse(timeLayout, generation.CreatedAt)
			if err != nil {
				log.Println(err)
				return
			}
			lastGenerationTime = time
			log.Println(generation.CreatedAt)

		}
		if generation.Status == "succeeded" {
			succeeded++
		}
	}
	/* successRate := float64(succeeded) / float64(len(generations)) */
	log.Printf("Generation success rate: %d/%d", succeeded, len(generations))

	var healthyServers int
	var enabledServers int
	for _, server := range servers {
		if server.Healthy {
			healthyServers++
		}
		if server.Enabled {
			enabledServers++
		}
	}
	log.Printf("Healthy servers (enabled): %d/%d", healthyServers, enabledServers)
	log.Printf("Healthy servers (all): %d/%d", healthyServers, len(servers))

	lastCheckTime = time.Now()
	log.Printf("Done checking health in: %s\n\n", lastCheckTime.Sub(start))
}
