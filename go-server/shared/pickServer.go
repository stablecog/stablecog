package shared

import (
	"fmt"
	"log"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/supabase/postgrest-go"
)

var seed int

var groupKey = "picked_server"
var ttl = 60 * time.Second
var counter = 0

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
	var serversFromKeys []string
	for _, key := range keys {
		serversFromKeys = append(serversFromKeys, strings.Split(key, ":")[1])
	}
	if len(keys) > 0 {
		for i, server := range filteredServers {
			if !Contains(serversFromKeys, server.Id) {
				pickedServerIndex = i
				if err != nil {
					log.Println(err)
				}
				break
			}
		}
		if pickedServerIndex == -1 {
			var sortedKeyObjects []SKeyObject
			for _, key := range keys {
				serverId := strings.Split(key, ":")[1]
				timestamp, err := strconv.ParseInt(strings.Split(key, ":")[2], 10, 64)
				if err != nil {
					log.Printf("-- Redis time parse error - %v --", err)
					continue
				}
				sortedKeyObjects = append(sortedKeyObjects, SKeyObject{timestamp: timestamp, serverId: serverId})
			}
			sort.Slice(sortedKeyObjects, func(i, j int) bool { return sortedKeyObjects[i].timestamp < sortedKeyObjects[j].timestamp })
			lastBatchKeys := sortedKeyObjects[len(sortedKeyObjects)-len(servers):]
			pickedServerId := lastBatchKeys[0].serverId
			for i, server := range servers {
				if server.Id == pickedServerId {
					pickedServerIndex = i
					break
				}
			}
		}
	}
	if pickedServerIndex == -1 {
		pickedServerIndex = counter % len(servers)
		counter = (counter + 1) % len(servers)
	}
	pickedServer := servers[pickedServerIndex]
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
