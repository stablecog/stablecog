package cronHealth

import (
	"log"

	"github.com/supabase/postgrest-go"
	shared "github.com/yekta/stablecog/go-server/shared"
)

func GetLastGenerations(limit int) []shared.SDBGeneration {
	var generations []shared.SDBGeneration
	_, err := shared.Supabase.From("generation").
		Select("status,created_at,failure_reason", "", false).Limit(limit, "").
		Order("created_at", &postgrest.OrderOpts{Ascending: false}).
		ExecuteTo(&generations)
	if err != nil {
		log.Println(err)
		return nil
	}
	return generations
}
