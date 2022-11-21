package shared

import (
	"github.com/supabase/postgrest-go"
)

var SUPABASE_ADMIN_KEY = GetEnv("SUPABASE_ADMIN_KEY")
var PUBLIC_SUPABASE_POSTGREST_URL = GetEnv("PUBLIC_SUPABASE_POSTGREST_URL")

var Supabase = postgrest.NewClient(PUBLIC_SUPABASE_POSTGREST_URL, "", map[string]string{
	"Authorization": "Bearer " + SUPABASE_ADMIN_KEY,
	"apikey":        SUPABASE_ADMIN_KEY,
})
