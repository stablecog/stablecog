package generate

import (
	"log"
	"math/rand"
	"time"

	"github.com/fatih/color"
	shared "github.com/yekta/stablecog/go-server/shared"
)

var yellow = color.New(color.FgYellow).SprintFunc()

func PickServerUrl(serverUrl string) SServerUrlResult {
	start := time.Now().UTC().UnixMilli()
	if serverUrl != shared.DEFAULT_SERVER_URL {
		return SServerUrlResult{
			ServerUrl: serverUrl,
			IsDefault: false,
			Error:     false,
		}
	}
	var servers []SDBServer
	_, err := shared.Supabase.From("server").
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
	log.Printf("-- Picked server URL in: %s%s - %v --", green(end-start), green("ms"), yellow(pickedServer.Url))
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

type SDBServer struct {
	Id                string `json:"id"`
	Url               string `json:"url"`
	Healthy           bool   `json:"healthy"`
	Enabled           bool   `json:"enabled"`
	CreatedAt         string `json:"created_at"`
	UpdatedAt         string `json:"updated_at"`
	LastHealthCheckAt string `json:"last_health_check_at"`
}
