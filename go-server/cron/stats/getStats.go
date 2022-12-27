package cronStats

import (
	"log"
	"strconv"
	"sync"
	"time"

	"github.com/fatih/color"
	"github.com/yekta/stablecog/go-server/shared"
)

var green = color.New(color.FgHiGreen).SprintFunc()
var Stats SStats

func GetAndSetStats() {
	start := time.Now()
	log.Printf("Getting stats...")

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		data := shared.SupabaseDb.Rpc("generation_duration_ms_total_estimate_with_constant", "", "")
		num, err := strconv.ParseInt(data, 10, 64)
		if err != nil {
			log.Printf("Couldn't parse stats data: %s", err)
		}
		Stats.GenerationDurationMsTotalEstimate = num
		defer wg.Done()
	}()
	wg.Add(1)
	go func() {
		data := shared.SupabaseDb.Rpc("generation_count", "", "")
		num, err := strconv.ParseInt(data, 10, 64)
		if err != nil {
			log.Printf("Couldn't parse stats data: %s", err)
		}
		Stats.GenerationCount = num
		defer wg.Done()
	}()
	wg.Add(1)
	go func() {
		data := shared.SupabaseDb.Rpc("upscale_duration_ms_total_estimate_with_constant", "", "")
		num, err := strconv.ParseInt(data, 10, 64)
		if err != nil {
			log.Printf("Couldn't parse stats data: %s", err)
		}
		Stats.UpscaleDurationMsTotalEstimate = num
		defer wg.Done()
	}()
	wg.Add(1)
	go func() {
		data := shared.SupabaseDb.Rpc("upscale_count", "", "")
		num, err := strconv.ParseInt(data, 10, 64)
		if err != nil {
			log.Printf("Couldn't parse stats data: %s", err)
		}
		Stats.UpscaleCount = num
		defer wg.Done()
	}()
	wg.Wait()

	end := time.Now()
	log.Printf("Got stats in: %s", green(end.Sub(start).Milliseconds(), "ms"))
}

type SStats struct {
	GenerationDurationMsTotalEstimate int64 `json:"generation_duration_ms_total_estimate_with_constant"`
	UpscaleDurationMsTotalEstimate    int64 `json:"upscale_duration_ms_total_estimate_with_constant"`
	GenerationCount                   int64 `json:"generation_count"`
	UpscaleCount                      int64 `json:"upscale_count"`
}
