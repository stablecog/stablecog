package queries

import (
	"log"

	"github.com/supabase/postgrest-go"
	shared "github.com/yekta/stablecog/aux-go/shared"
)

func GetServers() []shared.SDBServer {
	var servers []shared.SDBServer
	_, err := shared.Supabase.From("server").
		Select("url,enabled,healthy,last_health_check_at", "", false).
		Order("created_at", &postgrest.OrderOpts{Ascending: false}).
		ExecuteTo(&servers)
	if err != nil {
		log.Println(err)
		return nil
	}
	return servers
}
