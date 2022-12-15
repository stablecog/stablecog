package generate

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/davidbyttow/govips/v2/vips"
	"github.com/google/uuid"

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

func SubmitToGallery(p SSubmitToGalleryProps) {
	promptId := <-p.PromptIdChan
	negativePromptId := <-p.NegativePromptIdChan
	close(p.PromptIdChan)
	close(p.NegativePromptIdChan)
	s := time.Now().UTC().UnixMilli()

	arr := strings.Split(p.ImageB64, ";base64,")
	b64str := arr[len(arr)-1]
	buf, bErr := base64.StdEncoding.DecodeString(b64str)
	if bErr != nil {
		log.Printf("-- Gallery - Error decoding base64 image: %v --", bErr)
		return
	}

	// Vips process for converting to WebP
	sVips := time.Now().UTC().UnixMilli()
	img, iErr := vips.NewImageFromBuffer(buf)
	if iErr != nil {
		log.Printf("-- Gallery - Error creating vips image: %v --", iErr)
		return
	}
	exportParam := vips.NewWebpExportParams()
	exportParam.ReductionEffort = 6
	exportParam.Quality = 85
	webpBuff, webpMeta, wErr := img.ExportWebp(exportParam)
	if wErr != nil {
		log.Printf("-- Gallery - Error exporting to WebP: %v --", wErr)
		return
	}
	eVips := time.Now().UTC().UnixMilli()
	log.Printf("-- Gallery - Converted to WebP in: %s--", green(eVips-sVips, "ms"))
	// Vips process for converting to WebP - END

	log.Printf("-- Gallery - Image metadata - %s - %s --",
		green(webpMeta.Width, " × ", webpMeta.Height),
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
		log.Printf("-- Gallery - Error uploading to S3: %v --", err)
		return
	}
	log.Printf("-- Gallery - Uploaded to S3: %s --", yellow(imgKey))
	// Upload the file to S3 - END

	// Insert to DB
	var insertRes SDBGalleryInsertRes
	_, insertErr := shared.Supabase.From("generation_g").Insert(SDBGenerationGInsertBody{
		ImageId:           imgId,
		Width:             webpMeta.Width,
		Height:            webpMeta.Height,
		Hidden:            p.Hidden,
		PromptId:          promptId,
		NegativePromptId:  negativePromptId,
		ModelId:           p.ModelId,
		SchedulerId:       p.SchedulerId,
		NumInferenceSteps: p.NumInferenceSteps,
		GuidanceScale:     p.GuidanceScale,
		Seed:              p.Seed,
	}, false, "", "", "").Single().ExecuteTo(&insertRes)
	if insertErr != nil {
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
	CreatedAt         string `json:"created_at"`
	UpdatedAt         string `json:"updated_at"`
}
