package shared

import (
	"log"

	"github.com/supabase/postgrest-go"
)

func GetLastGenerations(limit int) []SDBGeneration {
	var generations []SDBGeneration
	_, err := Supabase.From("generation").
		Select("status,created_at,failure_reason", "", false).Limit(limit, "").
		Order("created_at", &postgrest.OrderOpts{Ascending: false}).
		ExecuteTo(&generations)
	if err != nil {
		log.Println(err)
		return nil
	}
	return generations
}
