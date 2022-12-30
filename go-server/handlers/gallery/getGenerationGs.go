package gallery

import (
	"encoding/json"
	"log"

	"github.com/meilisearch/meilisearch-go"
	"github.com/supabase/postgrest-go"
	"github.com/yekta/stablecog/go-server/shared"
)

func GetGenerationGs(page int, batchSize int, search string, filter string) []SDBGenerationG {
	var generationGs = []SDBGenerationG{}
	if search != "" {
		res, err := shared.Meili.Index("generation_g").Search(search, &meilisearch.SearchRequest{
			Limit:  int64(batchSize),
			Offset: int64((page - 1) * batchSize),
		})
		if err != nil {
			log.Println(err)
			return nil
		}
		if len(res.Hits) == 0 {
			return generationGs
		}
		for _, hit := range res.Hits {
			j, err := json.Marshal(hit)
			if err != nil {
				log.Panicf("Error marshalling hit: %v", err)
				return nil
			}
			var gen SDBGenerationG
			err = json.Unmarshal(j, &gen)
			if err != nil {
				log.Panicf("Error unmarshalling hit: %v", err)
				return nil
			}
			generationGs = append(generationGs, gen)
		}
		return generationGs
	} else {
		var filterValue = "(false)"
		if filter == "hidden-only" {
			filterValue = "(true)"
		} else if filter == "all" {
			filterValue = "(true,false)"
		}
		_, err := shared.SupabaseDb.From("generation_g").
			Select(`prompt:prompt_id(id,text),negative_prompt:negative_prompt_id(id,text),model:model_id(id,name),scheduler:scheduler_id(id,name),width,height,seed,num_inference_steps,guidance_scale,image_id,created_at,updated_at,id`, "", false).
			Filter("hidden", "in", filterValue).
			Order("created_at", &postgrest.OrderOpts{Ascending: false}).
			Range((page-1)*batchSize, page*batchSize-1, "").
			ExecuteTo(&generationGs)
		if err != nil {
			log.Println(err)
			return nil
		}
	}
	return generationGs
}

type SDBGenerationG struct {
	Width             int                        `json:"width"`
	Height            int                        `json:"height"`
	Prompt            SDBGalleryGPrompt          `json:"prompt"`
	NegativePrompt    *SDBGalleryGNegativePrompt `json:"negative_prompt,omitempty"`
	Model             SDBGalleryGModel           `json:"model"`
	Scheduler         SDBGalleryGScheduler       `json:"scheduler"`
	Seed              int                        `json:"seed"`
	NumInferenceSteps int                        `json:"num_inference_steps"`
	GuidanceScale     int                        `json:"guidance_scale"`
	ImageId           string                     `json:"image_id"`
	CreatedAt         string                     `json:"created_at"`
	UpdatedAt         string                     `json:"updated_at"`
	Id                string                     `json:"id"`
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
