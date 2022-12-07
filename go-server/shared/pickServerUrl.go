package shared

import (
	"log"
	"math/rand"
	"time"
)

func PickServerUrl(serverUrl string) SServerUrlResult {
	start := time.Now().UTC().UnixMilli()
	if serverUrl != DEFAULT_SERVER_URL {
		return SServerUrlResult{
			ServerUrl: serverUrl,
			IsDefault: false,
			Error:     false,
		}
	}
	var servers []SDBServer
	_, err := Supabase.From("server").
		Select("id,url,healthy,enabled,created_at,updated_at,last_health_check_at", "", false).
		Filter("enabled", "eq", "true").
		Filter("healthy", "eq", "true").
		ExecuteTo(&servers)
	if err != nil || len(servers) == 0 {
		log.Println(err)
		return SServerUrlResult{
			ServerUrl: serverUrl,
			IsDefault: true,
			Error:     true,
		}
	}
	rand.Seed(time.Now().Unix())
	i := rand.Intn(len(servers))
	pickedServer := servers[i]
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
