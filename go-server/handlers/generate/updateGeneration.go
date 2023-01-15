package generate

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"strings"
	"sync"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/getsentry/sentry-go"
	"github.com/google/uuid"
	"github.com/h2non/bimg"
	"github.com/yekta/stablecog/go-server/shared"
)

var bucketId = "generation"
var imageExt = "webp"

var webpOptionsStorage = bimg.Options{
	Quality: 90,
	Type:    bimg.WEBP,
}

func UpdateGenerationAsSucceeded(
	generationIdChan chan string,
	prompt string,
	negativePrompt string,
	durationMs int64,
	promptIdChan chan string,
	negativePromptIdChan chan string,
	supabaseUserId string,
	subscriptionTier string,
	b64 string,
) {
	generationId := <-generationIdChan
	close(generationIdChan)
	start := time.Now().UTC().UnixMilli()
	promptId := ""
	negativePromptId := ""

	imageObjectName := ""

	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		if prompt != "" {
			var promptRes []SDBPromptSelectRes
			_, err := shared.SupabaseDb.From("prompt").
				Select("id", "", false).
				Eq("text", prompt).
				ExecuteTo(&promptRes)
			if err != nil {
				sentry.CaptureException(err)
				log.Printf("-- DB - Error getting prompt ID: %v --", err)
				return
			}
			if len(promptRes) > 0 {
				promptId = promptRes[0].Id
			} else {
				var promptInsertRes SDBPromptInsertRes
				_, err := shared.SupabaseDb.
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
					sentry.CaptureException(err)
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
			_, err := shared.SupabaseDb.From("negative_prompt").
				Select("id", "", false).
				Eq("text", negativePrompt).
				ExecuteTo(&negativePromptRes)
			if err != nil {
				sentry.CaptureException(err)
				log.Printf("-- DB - Error getting negative prompt ID: %v --", err)
				return
			}
			if len(negativePromptRes) > 0 {
				negativePromptId = negativePromptRes[0].Id
			} else {
				var negativePromptInsertRes SDBNegativePromptInsertRes
				_, err := shared.SupabaseDb.
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
					sentry.CaptureException(err)
					log.Printf("-- DB - Error inserting negative prompt: %v --", err)
					return
				}
				negativePromptId = negativePromptInsertRes.Id
			}
		}
		defer wg.Done()
	}()
	wg.Add(1)
	go func() {
		imageId := uuid.New().String()
		path := fmt.Sprintf("%s/%s.%s", supabaseUserId, imageId, imageExt)
		name := fmt.Sprintf("%s.%s", imageId, imageExt)
		buff, bErr := shared.BufferFromB64(b64)
		if bErr != nil {
			sentry.CaptureException(bErr)
			log.Printf("-- Supabase Storage Upload - Error converting b64 to buffer: %v --", bErr)
			return
		}
		buffWebp, wErr := bimg.NewImage(buff).Process(webpOptionsStorage)
		if wErr != nil {
			sentry.CaptureException(wErr)
			log.Printf("-- Supabase Storage Upload - Error converting to webp: %v --", wErr)
			return
		}
		data := bytes.NewReader(buffWebp)
		res := shared.SupabaseStorage.UploadFile(bucketId, path, data)
		if res.Key != "" {
			imageObjectName = name
		}
		log.Printf("-- Supabase Storage Upload - Image Object Name: %s --", imageObjectName)
		defer wg.Done()
	}()
	wg.Wait()

	var res SDBGenerationUpdateAsSucceededRes
	value := SDBGenerationSucceededUpdate{
		PromptId:         promptId,
		NegativePromptId: negativePromptId,
		Status:           "succeeded",
		DurationMs:       durationMs,
		ImageObjectName:  imageObjectName,
	}
	_, err := shared.SupabaseDb.From("generation").Update(value, "", "").Eq("id", generationId).ExecuteTo(res)
	if err != nil {
		sentry.CaptureException(err)
		log.Printf("-- DB - Error updating generation as succeeded: %v --", err)
		return
	}
	promptIdChan <- promptId
	negativePromptIdChan <- negativePromptId
	end := time.Now().UTC().UnixMilli()
	log.Printf("-- DB - Updated generation as succeeded in: %s --", green(end-start, "ms"))
}

func UpdateGenerationAsSucceededV2(
	generationIdChan chan string,
	prompt string,
	negativePrompt string,
	durationMs int64,
	promptIdChan chan string,
	negativePromptIdChan chan string,
	supabaseUserId string,
	subscriptionTier string,
	output []string,
) {
	generationId := <-generationIdChan
	close(generationIdChan)
	start := time.Now().UTC().UnixMilli()
	promptId := ""
	negativePromptId := ""

	var imageObjectNames []string

	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		if prompt != "" {
			var promptRes []SDBPromptSelectRes
			_, err := shared.SupabaseDb.From("prompt").
				Select("id", "", false).
				Eq("text", prompt).
				ExecuteTo(&promptRes)
			if err != nil {
				sentry.CaptureException(err)
				log.Printf("-- DB - Error getting prompt ID: %v --", err)
				return
			}
			if len(promptRes) > 0 {
				promptId = promptRes[0].Id
			} else {
				var promptInsertRes SDBPromptInsertRes
				_, err := shared.SupabaseDb.
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
					sentry.CaptureException(err)
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
			_, err := shared.SupabaseDb.From("negative_prompt").
				Select("id", "", false).
				Eq("text", negativePrompt).
				ExecuteTo(&negativePromptRes)
			if err != nil {
				sentry.CaptureException(err)
				log.Printf("-- DB - Error getting negative prompt ID: %v --", err)
				return
			}
			if len(negativePromptRes) > 0 {
				negativePromptId = negativePromptRes[0].Id
			} else {
				var negativePromptInsertRes SDBNegativePromptInsertRes
				_, err := shared.SupabaseDb.
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
					sentry.CaptureException(err)
					log.Printf("-- DB - Error inserting negative prompt: %v --", err)
					return
				}
				negativePromptId = negativePromptInsertRes.Id
			}
		}
		defer wg.Done()
	}()
	wg.Add(1)
	go func() {
		for _, imageUrl := range output {
			splitStr := strings.Split(imageUrl, fmt.Sprintf("%s/", shared.S3PrivateUrl))
			if len(splitStr) < 2 {
				log.Printf("-- Couldn't split the image url string: %s", imageUrl)
				continue
			}
			key := splitStr[1]
			res, err := shared.S3Client.GetObject(context.Background(), &s3.GetObjectInput{
				Bucket: &shared.S3BucketPrivate,
				Key:    &key,
			})
			if err != nil {
				log.Printf("Failed to get object from S3: %v", err)
				continue
			}
			defer res.Body.Close()

			buff, bErr := ioutil.ReadAll(res.Body)
			if bErr != nil {
				sentry.CaptureException(bErr)
				log.Printf("-- Supabase Storage Upload - Error converting b64 to buffer: %v --", bErr)
				continue
			}
			buffWebp, wErr := bimg.NewImage(buff).Process(webpOptionsStorage)
			if wErr != nil {
				sentry.CaptureException(wErr)
				log.Printf("-- Supabase Storage Upload - Error converting to webp: %v --", wErr)
				continue
			}
			data := bytes.NewReader(buffWebp)
			imageId := uuid.New().String()
			path := fmt.Sprintf("%s/%s.%s", supabaseUserId, imageId, imageExt)
			name := fmt.Sprintf("%s.%s", imageId, imageExt)
			resSupa := shared.SupabaseStorage.UploadFile(bucketId, path, data)
			if resSupa.Key != "" {
				if imageObjectNames == nil {
					imageObjectNames = []string{}
				}
				imageObjectNames = append(imageObjectNames, name)
			}
			log.Printf("-- Supabase Storage Upload - Image Object Name: %s --", name)
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
		ImageObjectNames: imageObjectNames,
	}
	_, err := shared.SupabaseDb.From("generation").Update(value, "", "").Eq("id", generationId).ExecuteTo(res)
	if err != nil {
		sentry.CaptureException(err)
		log.Printf("-- DB - Error updating generation as succeeded: %v --", err)
		return
	}
	promptIdChan <- promptId
	negativePromptIdChan <- negativePromptId
	end := time.Now().UTC().UnixMilli()
	log.Printf("-- DB - Updated generation as succeeded in: %s --", green(end-start, "ms"))
}

func UpdateGenerationAsFailed(generationIdChan chan string, durationMs int64, isNSFW bool) {
	generationId := <-generationIdChan
	close(generationIdChan)
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
	_, err := shared.SupabaseDb.From("generation").Update(value, "", "").Eq("id", generationId).ExecuteTo(res)
	if err != nil {
		sentry.CaptureException(err)
		log.Printf("-- DB - Error updating generation as failed: %v --", err)
		return
	}
	end := time.Now().UTC().UnixMilli()
	log.Printf("-- DB - Updated generation as failed in: %s --", green(end-start, "ms"))
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
	PromptId         string   `json:"prompt_id"`
	NegativePromptId string   `json:"negative_prompt_id,omitempty"`
	Status           string   `json:"status"`
	DurationMs       int64    `json:"duration_ms"`
	ImageObjectName  string   `json:"image_object_name,omitempty"`
	ImageObjectNames []string `json:"image_object_names,omitempty"`
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
