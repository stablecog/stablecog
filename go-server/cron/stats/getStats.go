package cronStats

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"sync"
	"time"

	"github.com/fatih/color"
	"github.com/go-redis/redis/v8"
	"github.com/yekta/stablecog/go-server/shared"
)

var green = color.New(color.FgHiGreen).SprintFunc()
var Stats SStats

const statsTTL = 15 * time.Second

var groupKey = "stats"

func GetAndSetStats() {
	start := time.Now()
	log.Printf("Getting stats...")

	rctx := shared.Redis.Context()
	var wg sync.WaitGroup
	var rpcNames = []string{
		"generation_duration_ms_total_estimate_with_constant",
		"generation_count",
		"upscale_duration_ms_total_estimate_with_constant",
		"upscale_count",
	}
	wg.Add(len(rpcNames))
	for _, rpcName := range rpcNames {
		go func(rpcName string) {
			GetAndSetStat(
				rpcName,
				groupKey,
				&Stats.GenerationDurationMsTotalEstimate,
				statsTTL,
				&wg,
				shared.Redis,
				rctx,
			)
			defer wg.Done()
		}(rpcName)
	}
	wg.Wait()

	end := time.Now()
	log.Printf("Got stats in: %s", green(end.Sub(start).Milliseconds(), "ms"))
}

func GetAndSetStat(
	rpcName string,
	groupKey string,
	statsValue *int64,
	statsTTL time.Duration,
	wg *sync.WaitGroup,
	redis *redis.Client,
	rctx context.Context,
) {
	rKey := fmt.Sprintf("%s:%s", groupKey, rpcName)
	val, _ := redis.Get(redis.Context(), rKey).Result()
	if val != "" {
		num, err := strconv.ParseInt(val, 10, 64)
		if err == nil {
			*statsValue = num
			log.Printf("Redis - Got '%s' from Redis, skipping Supabase", rKey)
			return
		}
	}
	data := shared.SupabaseDb.Rpc(rpcName, "", "")
	num, err := strconv.ParseInt(data, 10, 64)
	if err != nil {
		log.Printf("Couldn't parse stats data: %s", err)
	}
	*statsValue = num
	errSet := redis.Set(rctx, rKey, num, statsTTL).Err()
	if errSet != nil {
		log.Printf("Redis - Error setting '%s': %v", rKey, err)
	}
}

type SStats struct {
	GenerationDurationMsTotalEstimate int64 `json:"generation_duration_ms_total_estimate_with_constant"`
	UpscaleDurationMsTotalEstimate    int64 `json:"upscale_duration_ms_total_estimate_with_constant"`
	GenerationCount                   int64 `json:"generation_count"`
	UpscaleCount                      int64 `json:"upscale_count"`
}
