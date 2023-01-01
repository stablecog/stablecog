package generate

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/getsentry/sentry-go"
	"github.com/google/uuid"
	"github.com/h2non/bimg"

	"github.com/yekta/stablecog/go-server/shared"
)

var accessKeyId = os.Getenv("R2_ACCESS_KEY_ID")
var secretKey = os.Getenv("R2_SECRET_ACCESS_KEY")
var endpoint = fmt.Sprintf("https://%s.r2.cloudflarestorage.com", os.Getenv("CLOUDFLARE_ACCOUNT_ID"))
var s3Conf = &aws.Config{
	Endpoint:    aws.String(endpoint),
	Region:      aws.String("auto"),
	Credentials: credentials.NewStaticCredentials(accessKeyId, secretKey, ""),
}
var s3sess = session.New(s3Conf)
var uploader = s3manager.NewUploader(s3sess)
var bucket = "stablecog"

var webpOptionsGallery = bimg.Options{
	Quality: 90,
	Type:    bimg.WEBP,
}

func SubmitToGallery(p SSubmitToGalleryProps) {
	promptId := <-p.PromptIdChan
	negativePromptId := <-p.NegativePromptIdChan
	close(p.PromptIdChan)
	close(p.NegativePromptIdChan)
	s := time.Now().UTC().UnixMilli()

	buff, bErr := shared.BufferFromB64(p.ImageB64)
	if bErr != nil {
		sentry.CaptureException(bErr)
		log.Printf("-- Gallery - Error decoding base64 image: %v --", bErr)
	}

	// Vips process for converting to WebP
	sVips := time.Now().UTC().UnixMilli()
	webpBuff, errBuff := bimg.NewImage(buff).Process(webpOptionsGallery)
	webpMeta, errMeta := bimg.Metadata(webpBuff)
	if errBuff != nil {
		sentry.CaptureException(errBuff)
		log.Printf("-- Gallery - Error converting to WebP: %v --", errBuff)
		return
	}
	if errMeta != nil {
		sentry.CaptureException(errMeta)
		log.Printf("-- Gallery - Error getting WebP metadata: %v --", errMeta)
		return
	}
	eVips := time.Now().UTC().UnixMilli()
	log.Printf("-- Gallery - Converted to WebP in: %s--", green(eVips-sVips, "ms"))
	// Vips process for converting to WebP - END

	log.Printf("-- Gallery - Image metadata - %s - %s --",
		green(webpMeta.Size.Width, " × ", webpMeta.Size.Height),
		green(len(webpBuff)/1000, "KB"),
	)
	id := uuid.New()
	imgId := id.String()
	imgKey := fmt.Sprintf("%s.webp", imgId)

	// Upload the file to S3
	input := &s3manager.UploadInput{
		Bucket:      aws.String(bucket),
		Key:         aws.String(imgKey),
		Body:        bytes.NewReader(webpBuff),
		ContentType: aws.String("image/webp"),
	}
	_, err := uploader.UploadWithContext(context.Background(), input)
	if err != nil {
		sentry.CaptureException(err)
		log.Printf("-- Gallery - Error uploading to S3: %v --", err)
		return
	}
	log.Printf("-- Gallery - Uploaded to S3: %s --", yellow(imgKey))
	// Upload the file to S3 - END

	// Insert to DB
	var insertRes SDBGalleryInsertRes
	_, insertErr := shared.SupabaseDb.From("generation_g").Insert(SDBGenerationGInsertBody{
		ImageId:           imgId,
		Width:             webpMeta.Size.Width,
		Height:            webpMeta.Size.Height,
		Hidden:            p.Hidden,
		PromptId:          promptId,
		NegativePromptId:  negativePromptId,
		ModelId:           p.ModelId,
		SchedulerId:       p.SchedulerId,
		NumInferenceSteps: p.NumInferenceSteps,
		GuidanceScale:     p.GuidanceScale,
		Seed:              p.Seed,
		UserId:            p.UserId,
		UserTier:          p.UserTier,
	}, false, "", "", "").Single().ExecuteTo(&insertRes)
	if insertErr != nil {
		sentry.CaptureException(insertErr)
		log.Printf("-- Gallery - Error inserting to DB: %v --", insertErr)
		return
	}
	// Insert to DB - END

	e := time.Now().UTC().UnixMilli()
	log.Printf("-- DB - Submitted to gallery in: %s --", green(e-s, "ms"))
}

type SSubmitToGalleryProps struct {
	ImageB64             string
	PromptIdChan         chan string
	NegativePromptIdChan chan string
	ModelId              string
	SchedulerId          string
	NumInferenceSteps    int
	GuidanceScale        int
	Seed                 int
	UserId               string
	UserTier             string
	Hidden               bool
}

type SDBGenerationGInsertBody struct {
	ImageId           string `json:"image_id"`
	Width             int    `json:"width"`
	Height            int    `json:"height"`
	Hidden            bool   `json:"hidden"`
	PromptId          string `json:"prompt_id"`
	NegativePromptId  string `json:"negative_prompt_id,omitempty"`
	ModelId           string `json:"model_id"`
	SchedulerId       string `json:"scheduler_id"`
	NumInferenceSteps int    `json:"num_inference_steps"`
	GuidanceScale     int    `json:"guidance_scale"`
	Seed              int    `json:"seed"`
	UserId            string `json:"user_id,omitempty"`
	UserTier          string `json:"user_tier"`
}

type SDBGalleryInsertRes struct {
	Id                string `json:"id"`
	PromptId          string `json:"prompt_id"`
	NegativePromptId  string `json:"negative_prompt_id,omitempty"`
	Hidden            bool   `json:"hidden"`
	ImageId           string `json:"image_id"`
	Width             int    `json:"width"`
	Height            int    `json:"height"`
	ModelId           string `json:"model_id"`
	SchedulerId       string `json:"scheduler_id"`
	NumInferenceSteps int    `json:"num_inference_steps"`
	GuidanceScale     int    `json:"guidance_scale"`
	Seed              int    `json:"seed"`
	UserId            string `json:"user_id,omitempty"`
	UserTier          string `json:"user_tier"`
	CreatedAt         string `json:"created_at"`
	UpdatedAt         string `json:"updated_at"`
}
