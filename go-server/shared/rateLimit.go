package shared

import (
	"fmt"
	"log"
	"time"
)

func IsRateLimited(prefix string, duration time.Duration, supabaseUserId string) bool {
	rctx := Redis.Context()
	userKey := fmt.Sprintf("rl:%s:uid:%s", prefix, supabaseUserId)
	val := Redis.Get(rctx, userKey).Val()
	if val == "1" {
		return true
	}
	err := Redis.Set(rctx, userKey, "1", duration).Err()
	if err != nil {
		log.Printf("Redis - Error setting Supabase User ID key: %v", err)
	}
	return false
}

func HasOnGoingGenerationOrUpscale(prefix string, supabaseUserId string) bool {
	rctx := Redis.Context()
	userKey := fmt.Sprintf("rl:%s:uid:%s", prefix, supabaseUserId)
	val := Redis.Get(rctx, userKey).Val()
	if val == "1" {
		return true
	}
	return false
}

func SetOngoingGenerationOrUpscale(prefix string, duration time.Duration, supabaseUserId string) {
	rctx := Redis.Context()
	userKey := fmt.Sprintf("rl:%s:uid:%s", prefix, supabaseUserId)
	err := Redis.Set(rctx, userKey, "1", duration).Err()
	if err != nil {
		log.Printf("Redis - Error setting Supabase User ID key: %v", err)
	}
}

func DeleteOngoingGenerationOrUpscale(prefix string, supabaseUserId string) {
	rctx := Redis.Context()
	userKey := fmt.Sprintf("rl:%s:uid:%s", prefix, supabaseUserId)
	err := Redis.Del(rctx, userKey).Err()
	if err != nil {
		log.Printf("Redis - Error deleting Supabase User ID key: %v", err)
	}
}
