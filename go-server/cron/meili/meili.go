package cronMeili

import (
	"log"
	"time"

	"github.com/meilisearch/meilisearch-go"
	"github.com/supabase/postgrest-go"
	"github.com/yekta/stablecog/go-server/shared"
)

var lastSyncedGenUpdatedAt time.Time
var shouldSetSettings = true
var sortableAttributes = []string{"updated_at", "created_at"}
var maxTotalHits = 5000

func SyncMeili() {
	var generations []SDBGenerationGFlatRes
	lastSyncedGenUpdatedAtStr := lastSyncedGenUpdatedAt.Format(shared.DBTimeLayout)
	_, err := shared.SupabaseDb.
		From("generation_g_flat").
		Select("", "", false).
		Filter("updated_at", "gt", lastSyncedGenUpdatedAtStr).
		Filter("hidden", "in", "(false)").
		Order("updated_at", &postgrest.OrderOpts{Ascending: true}).
		Limit(1000, "").
		ExecuteTo(&generations)
	if err != nil {
		log.Printf("-- MeiliWorker - Supabase DB get error: %v", err)
		return
	}
	if len(generations) == 0 {
		log.Printf("-- MeiliWorker - No new generations to sync")
		return
	}
	lastGen := generations[len(generations)-1]
	lastGenUpdateAtTime, errParse := time.Parse(shared.DBTimeLayout, lastGen.UpdatedAt)
	if errParse != nil {
		log.Printf("-- MeiliWorker - Time parse error: %v", errParse)
		return
	}

	if shouldSetSettings {
		_, err := shared.Meili.Index("generation_g").UpdateSortableAttributes(&sortableAttributes)
		if err != nil {
			log.Printf("-- MeiliWorker - Meili update sortable attributes error: %v", err)
		} else {
			log.Printf("-- MeiliWorker - Meili sortable attributes updated")
		}
		_, errMax := shared.Meili.Index("generation_g").UpdatePagination(&meilisearch.Pagination{MaxTotalHits: int64(maxTotalHits)})
		if errMax != nil {
			log.Printf("-- MeiliWorker - Meili update max total hits error: %v", errMax)
		} else {
			log.Printf("-- MeiliWorker - Meili max total hits updated")
		}
		if err == nil && errMax == nil {
			shouldSetSettings = false
		}
	}

	var generationsMeili []SMeiliGenerationG

	for _, gen := range generations {
		newG := SMeiliGenerationG{
			Id:                gen.Id,
			ImageId:           gen.ImageId,
			Width:             gen.Width,
			Height:            gen.Height,
			Hidden:            gen.Hidden,
			Prompt:            SPrompt{Id: gen.PromptId, Text: gen.PromptText},
			Model:             SModel{Id: gen.ModelId, Name: gen.ModelName},
			Scheduler:         SScheduler{Id: gen.SchedulerId, Name: gen.SchedulerName},
			NumInferenceSteps: gen.NumInferenceSteps,
			GuidanceScale:     gen.GuidanceScale,
			Seed:              gen.Seed,
			UserId:            gen.UserId,
			UserTier:          gen.UserTier,
			CreatedAt:         gen.CreatedAt,
			UpdatedAt:         gen.UpdatedAt,
		}
		if gen.NegativePromptId != "" {
			newG.NegativePrompt = &SNegativePrompt{Id: gen.NegativePromptId, Text: gen.NegativePromptText}
		}
		generationsMeili = append(generationsMeili, newG)
	}

	_, errMeili := shared.Meili.Index("generation_g").AddDocuments(generationsMeili)
	if errMeili != nil {
		log.Printf("-- MeiliWorker - Meili error: %v", errMeili)
		return
	} else {
		lastSyncedGenUpdatedAt = lastGenUpdateAtTime
		log.Printf("-- MeiliWorker - Successfully indexed - %s -- ", lastSyncedGenUpdatedAt.UTC())
	}

	return
}

type SMeiliGenerationG struct {
	Id                string           `json:"id"`
	ImageId           string           `json:"image_id"`
	Width             int              `json:"width"`
	Height            int              `json:"height"`
	Hidden            bool             `json:"hidden"`
	Prompt            SPrompt          `json:"prompt"`
	NegativePrompt    *SNegativePrompt `json:"negative_prompt,omitempty"`
	Model             SModel           `json:"model"`
	Scheduler         SScheduler       `json:"scheduler"`
	NumInferenceSteps int              `json:"num_inference_steps"`
	GuidanceScale     int              `json:"guidance_scale"`
	Seed              int              `json:"seed"`
	UserId            string           `json:"user_id,omitempty"`
	UserTier          string           `json:"user_tier"`
	CreatedAt         string           `json:"created_at"`
	UpdatedAt         string           `json:"updated_at"`
}

type SDBGenerationGFlatRes struct {
	Id                 string `json:"id"`
	ImageId            string `json:"image_id"`
	Width              int    `json:"width"`
	Height             int    `json:"height"`
	Hidden             bool   `json:"hidden"`
	PromptId           string `json:"prompt_id"`
	PromptText         string `json:"prompt_text"`
	NegativePromptId   string `json:"negative_prompt_id,omitempty"`
	NegativePromptText string `json:"negative_prompt_text,omitempty"`
	ModelId            string `json:"model_id"`
	ModelName          string `json:"model_name"`
	SchedulerId        string `json:"scheduler_id"`
	SchedulerName      string `json:"scheduler_name"`
	NumInferenceSteps  int    `json:"num_inference_steps"`
	GuidanceScale      int    `json:"guidance_scale"`
	Seed               int    `json:"seed"`
	UserId             string `json:"user_id,omitempty"`
	UserTier           string `json:"user_tier"`
	CreatedAt          string `json:"created_at"`
	UpdatedAt          string `json:"updated_at"`
}

type SPrompt struct {
	Id   string `json:"id"`
	Text string `json:"text"`
}

type SNegativePrompt struct {
	Id   string `json:"id,omitempty"`
	Text string `json:"text,omitempty"`
}

type SModel struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type SScheduler struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}
