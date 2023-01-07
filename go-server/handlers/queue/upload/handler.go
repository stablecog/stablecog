package queueUpload

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/yekta/stablecog/go-server/shared"
)

var allowedExtensions []string = []string{"webp", "jpeg", "png"}

func Handler(c *fiber.Ctx) error {
	paths := strings.Split(c.Path(), "/")
	if len(paths) != 5 {
		return c.SendStatus(400)
	}
	imageFullName := paths[4]
	imageNameParts := strings.Split(imageFullName, ".")
	if len(imageNameParts) != 2 {
		return c.SendStatus(400)
	}
	imageExtension := imageNameParts[1]
	if imageExtension == "jpg" {
		imageExtension = "jpeg"
	}
	if !shared.Contains(allowedExtensions, imageExtension) {
		return c.SendStatus(400)
	}
	id := uuid.New()
	imageKey := fmt.Sprintf("%s/%s.%s", shared.S3BucketPrivateQueueOutputFolder, id, imageExtension)
	log.Printf("S3 bucket private presign image key: %v", imageKey)
	contentType := fmt.Sprintf("image/%s", imageExtension)
	presignResult, err := shared.S3PresignClientPrivate.PresignPutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(shared.S3BucketPrivate),
		Key:         aws.String(imageKey),
		ContentType: aws.String(contentType),
	})
	if err != nil {
		log.Printf("S3 bucket private presign error: %v", err)
		return err
	}
	log.Printf("S3 bucket private presign result: %v", presignResult)
	return c.Redirect(presignResult.URL, 307)
}
