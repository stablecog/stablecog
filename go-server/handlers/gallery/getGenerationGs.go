package gallery

import (
	"log"

	"github.com/supabase/postgrest-go"
	"github.com/yekta/stablecog/go-server/shared"
)

func GetGenerationGs(page int, batchSize int, filter string) []SDBGenerationG {
	var generationGs []SDBGenerationG
	var filterValue = "(false)"
	if filter == "hidden-only" {
		filterValue = "(true)"
	} else if filter == "all" {
		filterValue = "(true,false)"
	}
	_, err := shared.Supabase.From("generation_g").
		Select(`prompt:prompt_id(id,text),negative_prompt:negative_prompt_id(id,text),model:model_id(id,name),scheduler:scheduler_id(id,name),width,height,seed,inference_steps,guidance_scale,image_id,created_at,updated_at,id`, "", false).
		Filter("hidden", "in", filterValue).
		Order("created_at", &postgrest.OrderOpts{Ascending: false}).
		Range((page-1)*batchSize, page*batchSize-1, "").
		ExecuteTo(&generationGs)
	if err != nil {
		log.Println(err)
		return nil
	}
	return generationGs
}

type SDBGenerationG struct {
	Width          int                        `json:"width"`
	Height         int                        `json:"height"`
	Prompt         SDBGalleryGPrompt          `json:"prompt"`
	NegativePrompt *SDBGalleryGNegativePrompt `json:"negative_prompt,omitempty"`
	Model          SDBGalleryGModel           `json:"model"`
	Scheduler      SDBGalleryGScheduler       `json:"scheduler"`
	Seed           int                        `json:"seed"`
	InferenceSteps int                        `json:"inference_steps"`
	GuidanceScale  int                        `json:"guidance_scale"`
	ImageId        string                     `json:"image_id"`
	CreatedAt      string                     `json:"created_at"`
	UpdatedAt      string                     `json:"updated_at"`
	Id             string                     `json:"id"`
}

type SDBGalleryGPrompt struct {
	Id   string `json:"id"`
	Text string `json:"text"`
}

type SDBGalleryGNegativePrompt struct {
	Id   string `json:"id"`
	Text string `json:"text"`
}

type SDBGalleryGModel struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type SDBGalleryGScheduler struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}
