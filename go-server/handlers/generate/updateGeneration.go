package generate

import (
	"log"
	"sync"
	"time"

	"github.com/yekta/stablecog/go-server/shared"
)

func UpdateGenerationAsSucceeded(
	generationIdChan chan string,
	prompt string,
	negativePrompt string,
	durationMs int64,
	promptIdChan chan string,
	negativePromptIdChan chan string,
) {
	generationId := <-generationIdChan
	start := time.Now().UTC().UnixMilli()
	promptId := ""
	negativePromptId := ""

	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		if prompt != "" {
			var promptRes []SDBPromptSelectRes
			_, err := shared.Supabase.From("prompt").
				Select("id", "", false).
				Eq("text", prompt).
				ExecuteTo(&promptRes)
			if err != nil {
				log.Printf("-- DB - Error getting prompt ID: %v --", err)
				return
			}
			if len(promptRes) > 0 {
				promptId = promptRes[0].Id
			} else {
				var promptInsertRes SDBPromptInsertRes
				_, err := shared.Supabase.
					From("prompt").
					Insert(
						SDBPromptInsertBody{
							Text: prompt,
						},
						false,
						"", "", "",
					).
					Single().
					ExecuteTo(&promptInsertRes)
				if err != nil {
					log.Printf("-- DB - Error inserting prompt: %v --", err)
					return
				}
				promptId = promptInsertRes.Id
			}
		}
		defer wg.Done()
	}()
	go func() {
		if negativePrompt != "" {
			var negativePromptRes []SDBNegativePromptSelectRes
			_, err := shared.Supabase.From("negative_prompt").
				Select("id", "", false).
				Eq("text", negativePrompt).
				ExecuteTo(&negativePromptRes)
			if err != nil {
				log.Printf("-- DB - Error getting negative prompt ID: %v --", err)
				return
			}
			if len(negativePromptRes) > 0 {
				negativePromptId = negativePromptRes[0].Id
			} else {
				var negativePromptInsertRes SDBNegativePromptInsertRes
				_, err := shared.Supabase.
					From("negative_prompt").
					Insert(
						SDBNegativePromptInsertBody{
							Text: negativePrompt,
						},
						false,
						"", "", "",
					).
					Single().
					ExecuteTo(&negativePromptInsertRes)
				if err != nil {
					log.Printf("-- DB - Error inserting negative prompt: %v --", err)
					return
				}
				negativePromptId = negativePromptInsertRes.Id
			}
		}
		defer wg.Done()
	}()
	wg.Wait()

	var res SDBGenerationUpdateAsSucceededRes
	value := SDBGenerationSucceededUpdate{
		PromptId:         promptId,
		NegativePromptId: negativePromptId,
		Status:           "succeeded",
		DurationMs:       durationMs,
	}
	_, err := shared.Supabase.From("generation").Update(value, "", "").Eq("id", generationId).ExecuteTo(res)
	if err != nil {
		log.Printf("-- DB - Error updating generation as succeeded: %v --", err)
		return
	}
	promptIdChan <- promptId
	negativePromptIdChan <- negativePromptId
	end := time.Now().UTC().UnixMilli()
	log.Printf("-- DB - Updated generation as succeeded in: %s%s --", green(end-start), green("ms"))
}

func UpdateGenerationAsFailed(generationIdChan chan string, durationMs int64, isNSFW bool) {
	generationId := <-generationIdChan
	start := time.Now().UTC().UnixMilli()
	var res SDBGenerationUpdateAsFailedRes
	failureReason := ""
	if isNSFW {
		failureReason = "NSFW"
	}
	value := SDBGenerationFailedUpdate{
		Status:        "failed",
		DurationMs:    durationMs,
		FailureReason: failureReason,
	}
	_, err := shared.Supabase.From("generation").Update(value, "", "").Eq("id", generationId).ExecuteTo(res)
	if err != nil {
		log.Printf("-- DB - Error updating generation as failed: %v --", err)
		return
	}
	end := time.Now().UTC().UnixMilli()
	log.Printf("-- DB - Updated generation as failed in: %s%s --", green(end-start), green("ms"))
}

type SDBPromptSelectRes struct {
	Id string `json:"id"`
}

type SDBPromptInsertBody struct {
	Text string `json:"text"`
}

type SDBPromptInsertRes struct {
	Id        string `json:"id"`
	Text      string `json:"text"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type SDBNegativePromptSelectRes struct {
	Id string `json:"id"`
}

type SDBNegativePromptInsertBody struct {
	Text string `json:"text"`
}

type SDBNegativePromptInsertRes struct {
	Id        string `json:"id"`
	Text      string `json:"text"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type SDBGenerationSucceededUpdate struct {
	PromptId         string `json:"prompt_id"`
	NegativePromptId string `json:"negative_prompt_id,omitempty"`
	Status           string `json:"status"`
	DurationMs       int64  `json:"duration_ms"`
}

type SDBGenerationFailedUpdate struct {
	Status        string `json:"status"`
	DurationMs    int64  `json:"duration_ms"`
	FailureReason string `json:"failure_reason,omitempty"`
}

type SDBGenerationUpdateAsSucceededRes struct {
	Id string `json:"id"`
}

type SDBGenerationUpdateAsFailedRes struct {
	Id string `json:"id"`
}

type SUpdateGenerationAsSucceededRes struct {
	PromptId         string
	NegativePromptId string
}
