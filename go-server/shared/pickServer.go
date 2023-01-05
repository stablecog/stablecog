package shared

import (
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/supabase/postgrest-go"
)

var seed int

var groupKey = "picked_server"
var ttl = 10 * time.Second

func PickServer(props SPickServerProps) SServerUrlResult {
	start := time.Now().UTC().UnixMilli()
	if props.ServerUrl != DEFAULT_SERVER_URL {
		return SServerUrlResult{
			ServerUrl: props.ServerUrl,
			IsDefault: false,
			Error:     false,
		}
	}
	order := postgrest.OrderOpts{Ascending: false}
	var servers []SDBServer
	_, err := SupabaseDb.From("server").
		Select("id,url,healthy,enabled,created_at,updated_at,last_health_check_at,features", "", false).
		Filter("enabled", "eq", "true").
		Filter("healthy", "eq", "true").
		Order("url", &order).
		ExecuteTo(&servers)
	if err != nil || len(servers) == 0 {
		log.Println(err)
		return SServerUrlResult{
			ServerUrl: props.ServerUrl,
			IsDefault: true,
			Error:     true,
		}
	}
	var filteredServers []SDBServer
	var filteredServerIds []string

	if props.Type == "generate" {
		for _, server := range servers {
			hasModel := false
			hasScheduler := false
			var modelsOnServer []string
			var schedulersOnServer []string
			for _, feature := range server.Features {
				if feature.Name == "model" {
					modelsOnServer = feature.Values
					break
				}
			}
			for _, feature := range server.Features {
				if feature.Name == "scheduler" {
					schedulersOnServer = feature.Values
					break
				}
			}
			if Contains(modelsOnServer, ModelIdToModelNameCog[props.ModelId]) {
				hasModel = true
			}
			if Contains(schedulersOnServer, SchedulerIdToSchedulerNameCog[props.SchedulerId]) {
				hasScheduler = true
			}
			if hasModel && hasScheduler {
				filteredServers = append(filteredServers, server)
			}
		}
	} else {
		filteredServers = servers
	}
	for _, server := range filteredServers {
		filteredServerIds = append(filteredServerIds, server.Id)
	}
	if len(filteredServers) == 0 {
		log.Printf("No servers available to pick for these settings")
		return SServerUrlResult{
			ServerUrl: props.ServerUrl,
			IsDefault: true,
			Error:     true,
		}
	} else {
		log.Printf("Servers available to process the request: %d", len(filteredServers))
	}
	var pickedServerIndex = -1
	keys := Redis.Keys(Redis.Context(), fmt.Sprintf("%s:*", groupKey)).Val()
	var serverIdsFromRedis []string
	for _, key := range keys {
		serverIdsFromRedis = append(serverIdsFromRedis, strings.Split(key, ":")[1])
	}
	var serversNotInRedis []SDBServer
	for _, server := range filteredServers {
		if !Contains(serverIdsFromRedis, server.Id) {
			serversNotInRedis = append(serversNotInRedis, server)
		}
	}

	rand.Seed(time.Now().UnixNano())
	var pickedServer SDBServer
	if len(serversNotInRedis) > 0 {
		pickedServerIndex = rand.Intn(len(serversNotInRedis))
		pickedServer = serversNotInRedis[pickedServerIndex]
	} else {
		pickedServerIndex = rand.Intn(len(filteredServers))
		pickedServer = filteredServers[pickedServerIndex]
	}

	now := time.Now().UTC().UnixMilli()
	Redis.Set(Redis.Context(), fmt.Sprintf("%s:%s:%d", groupKey, pickedServer.Id, now), "1", ttl)
	end := time.Now().UTC().UnixMilli()
	log.Printf("-- Picked server URL in: %s - %v --", green(end-start, "ms"), yellow(pickedServer.Url))
	return SServerUrlResult{
		ServerUrl: pickedServer.Url,
		IsDefault: true,
		Error:     false,
	}
}

type SServerUrlResult struct {
	ServerUrl string
	IsDefault bool
	Error     bool
}

type SKeyObject struct {
	timestamp int64
	serverId  string
}

type SPickServerProps struct {
	ServerUrl   string
	ModelId     string
	SchedulerId string
	Type        string
}
