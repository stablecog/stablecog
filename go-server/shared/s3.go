package shared

import (
	"context"
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

var S3BucketPublic = "stablecog"
var S3BucketPrivate = "stablecog-private"
var S3BucketPrivateQueueOutputFolder = "queue/output"
var S3Hostname = fmt.Sprintf("%s.r2.cloudflarestorage.com", os.Getenv("CLOUDFLARE_ACCOUNT_ID"))
var S3PrivateUrl = os.Getenv("R2_PRIVATE_URL")
var accountId = os.Getenv("CLOUDFLARE_ACCOUNT_ID")
var accessKeyId = os.Getenv("R2_ACCESS_KEY_ID")
var secretKey = os.Getenv("R2_SECRET_ACCESS_KEY")
var s3resolver = aws.EndpointResolverWithOptionsFunc(
	func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL: fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountId),
		}, nil
	},
)
var cfg, err = config.LoadDefaultConfig(
	context.TODO(),
	config.WithEndpointResolverWithOptions(s3resolver),
	config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKeyId, secretKey, "")),
)
var S3Client = s3.NewFromConfig(cfg)
var S3PresignClientPrivate = s3.NewPresignClient(S3Client)
