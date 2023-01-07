package shared

import (
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

var accessKeyId = os.Getenv("R2_ACCESS_KEY_ID")
var secretKey = os.Getenv("R2_SECRET_ACCESS_KEY")
var endpoint = fmt.Sprintf("https://%s.r2.cloudflarestorage.com", os.Getenv("CLOUDFLARE_ACCOUNT_ID"))
var s3Conf = &aws.Config{
	Endpoint:    aws.String(endpoint),
	Region:      aws.String("auto"),
	Credentials: credentials.NewStaticCredentials(accessKeyId, secretKey, ""),
}
var S3sess = session.New(s3Conf)
var S3Uploader = s3manager.NewUploader(S3sess)
var S3BucketPublic = "stablecog"
var S3BucketPrivate = "stablecog-private"
