package queries

import (
	"log"

	"github.com/supabase/postgrest-go"
	shared "github.com/yekta/stablecog/aux-go/shared"
	structs "github.com/yekta/stablecog/aux-go/structs"
)

func GetGenerations(limit int) []structs.SDBGeneration {
	var generations []structs.SDBGeneration
	_, err := shared.Supabase.From("generation").
		Select("status,created_at", "", false).Limit(limit, "").
		Order("created_at", &postgrest.OrderOpts{Ascending: false}).
		ExecuteTo(&generations)
	if err != nil {
		log.Println(err)
		return nil
	}
	return generations
}
