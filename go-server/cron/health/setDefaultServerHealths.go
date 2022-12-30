package cronHealth

import (
	"log"
	"sync"
	"time"

	"github.com/fatih/color"
	"github.com/yekta/stablecog/go-server/shared"
)

var green = color.New(color.FgHiGreen).SprintFunc()

func SetDefaultServerHealths() {
	start := time.Now().UnixMilli()
	var serversToCheck []shared.SDBServer
	servers := shared.GetServers()
	for _, s := range servers {
		if s.Enabled {
			serversToCheck = append(serversToCheck, s)
		}
	}
	var results []shared.SDBServer
	var wg sync.WaitGroup
	for _, server := range serversToCheck {
		wg.Add(1)
		go func(server shared.SDBServer) {
			res := shared.CheckServer(server.Url)
			now := time.Now()
			lastCheck := now.UTC().Format(shared.DBTimeLayout)
			results = append(results, shared.SDBServer{
				Id:                server.Id,
				Healthy:           res.Status == "healthy",
				LastHealthCheckAt: lastCheck,
				Url:               server.Url,
				Enabled:           server.Enabled,
			})
			defer wg.Done()
		}(server)
	}
	wg.Wait()
	updateResults := make([]shared.SDBServer, len(results))
	for i, r := range results {
		updateResults[i] = shared.SDBServer{
			Id:                r.Id,
			Healthy:           r.Healthy,
			LastHealthCheckAt: r.LastHealthCheckAt,
			Url:               r.Url,
		}
	}
	shared.UpdateServerHealths(updateResults)
	end := time.Now().UnixMilli()
	log.Printf("Setting default server healths took: %s", green(end-start, "ms"))
}
