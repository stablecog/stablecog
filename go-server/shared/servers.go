package shared

import (
	"log"

	"github.com/supabase/postgrest-go"
)

func GetServers() []SDBServer {
	var servers []SDBServer
	_, err := Supabase.From("server").
		Select("id,url,enabled,healthy,last_health_check_at,created_at,updated_at", "", false).
		Order("created_at", &postgrest.OrderOpts{Ascending: false}).
		ExecuteTo(&servers)
	if err != nil {
		log.Printf(red("Error getting servers: %s"), err)
		return nil
	}
	return servers
}

func UpdateServerHealths(servers []SDBServerUpdate) []SDBServer {
	var res []SDBServer
	_, err := Supabase.From("server").Update(servers, "", "").ExecuteTo(&res)
	if err != nil {
		log.Printf(red("Error updating server healths: %s"), err)
	}
	return res
}
