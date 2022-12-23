package shared

import (
	"log"
	"math/rand"
	"time"

	"github.com/supabase/postgrest-go"
)

var seed int
var counter int

func SetupSeed() {
	rand.Seed(time.Now().Unix())
	seed = rand.Intn(1000)
	counter = seed
}

func PickServerUrl(serverUrl string) SServerUrlResult {
	start := time.Now().UTC().UnixMilli()
	if serverUrl != DEFAULT_SERVER_URL {
		return SServerUrlResult{
			ServerUrl: serverUrl,
			IsDefault: false,
			Error:     false,
		}
	}
	order := postgrest.OrderOpts{Ascending: false}
	var servers []SDBServer
	_, err := Supabase.From("server").
		Select("id,url,healthy,enabled,created_at,updated_at,last_health_check_at", "", false).
		Filter("enabled", "eq", "true").
		Filter("healthy", "eq", "true").
		Order("url", &order).
		ExecuteTo(&servers)
	if err != nil || len(servers) == 0 {
		log.Println(err)
		return SServerUrlResult{
			ServerUrl: serverUrl,
			IsDefault: true,
			Error:     true,
		}
	}
	pickedServer := servers[counter%len(servers)]
	counter = counter%len(servers) + 1
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
