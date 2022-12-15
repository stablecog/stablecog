package upscale

import (
	"log"
	"time"

	"github.com/yekta/stablecog/go-server/shared"
)

func UpdateUpscaleAsSucceeded(
	upscaleIdChan chan string,
	durationMs int64,
) {
	upscaleId := <-upscaleIdChan
	close(upscaleIdChan)
	start := time.Now().UTC().UnixMilli()

	var res SDBGenerationUpdateAsSucceededRes
	value := SDBGenerationSucceededUpdate{
		Status:     "succeeded",
		DurationMs: durationMs,
	}
	_, err := shared.Supabase.From("upscale").Update(value, "", "").Eq("id", upscaleId).ExecuteTo(res)
	if err != nil {
		log.Printf("-- DB - Error updating upscale as succeeded: %v --", err)
		return
	}
	end := time.Now().UTC().UnixMilli()
	log.Printf("-- DB - Updated upscale as succeeded in: %s --", green(end-start, "ms"))
}

func UpdateUpscaleAsFailed(upscaleIdChan chan string, durationMs int64) {
	upscaleId := <-upscaleIdChan
	close(upscaleIdChan)
	start := time.Now().UTC().UnixMilli()
	var res SDBGenerationUpdateAsFailedRes
	value := SDBGenerationFailedUpdate{
		Status:     "failed",
		DurationMs: durationMs,
	}
	_, err := shared.Supabase.From("upscale").Update(value, "", "").Eq("id", upscaleId).ExecuteTo(res)
	if err != nil {
		log.Printf("-- DB - Error updating upscale as failed: %v --", err)
		return
	}
	end := time.Now().UTC().UnixMilli()
	log.Printf("-- DB - Updated upscale as failed in: %s --", green(end-start, "ms"))
}

type SDBGenerationSucceededUpdate struct {
	Status     string `json:"status"`
	DurationMs int64  `json:"duration_ms"`
}

type SDBGenerationFailedUpdate struct {
	Status     string `json:"status"`
	DurationMs int64  `json:"duration_ms"`
}

type SDBGenerationUpdateAsSucceededRes struct {
	Id string `json:"id"`
}

type SDBGenerationUpdateAsFailedRes struct {
	Id string `json:"id"`
}
