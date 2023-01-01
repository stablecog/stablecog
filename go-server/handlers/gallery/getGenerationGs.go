package gallery

import (
	"encoding/json"
	"log"

	"github.com/getsentry/sentry-go"
	"github.com/meilisearch/meilisearch-go"
	"github.com/yekta/stablecog/go-server/shared"
)

func GetGenerationGs(page int, batchSize int, search string, filter string) []SDBGenerationG {
	var generationGs = []SDBGenerationG{}
	sortBy := []string{}
	if search == "" {
		sortBy = []string{"created_at:desc"}
	}
	res, err := shared.Meili.Index("generation_g").Search(search, &meilisearch.SearchRequest{
		Page:        int64(page),
		HitsPerPage: int64(batchSize),
		Sort:        sortBy,
	})
	if err != nil {
		sentry.CaptureException(err)
		log.Println(err)
		return nil
	}
	if len(res.Hits) == 0 {
		return generationGs
	}
	for _, hit := range res.Hits {
		j, err := json.Marshal(hit)
		if err != nil {
			sentry.CaptureException(err)
			log.Panicf("Error marshalling hit: %v", err)
			return nil
		}
		var gen SDBGenerationG
		err = json.Unmarshal(j, &gen)
		if err != nil {
			sentry.CaptureException(err)
			log.Panicf("Error unmarshalling hit: %v", err)
			return nil
		}
		generationGs = append(generationGs, gen)
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
