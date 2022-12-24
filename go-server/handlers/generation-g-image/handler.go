package generationGImage

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	"github.com/h2non/bimg"
	"github.com/yekta/stablecog/go-server/shared"
)

var r2Url = shared.GetEnv("PUBLIC_R2_URL")
var red = color.New(color.FgHiRed).SprintFunc()
var green = color.New(color.FgHiGreen).SprintFunc()
var yellow = color.New(color.FgHiYellow).SprintFunc()

var jpegParams = bimg.Options{
	Type:    bimg.JPEG,
	Quality: 100,
}
var pngParams = bimg.Options{
	Type:    bimg.PNG,
	Quality: 100,
}

func Handler(c *fiber.Ctx) error {
	start := time.Now().UnixMilli()
	imageIdWithExt := c.Params("imageIdWithExt")
	parts := strings.Split(imageIdWithExt, ".")
	imageId := parts[0]
	imageExt := parts[1]
	webpUrl := fmt.Sprintf("%s/%s.webp", r2Url, imageId)
	res, err := http.Get(webpUrl)
	if err != nil {
		log.Printf(red("Error fetching - %s: %s"), webpUrl, err)
		return c.Status(http.StatusInternalServerError).JSON("Error fetching")
	}
	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Printf(red("Error reading response - %s: %s"), webpUrl, err)
		return c.Status(http.StatusInternalServerError).JSON("Error reading response")
	}
	res.Body.Close()
	startC := time.Now().UnixMilli()

	img := bimg.NewImage(data)

	contentType := "image/jpeg"
	params := jpegParams
	ext := "jpg"

	if imageExt == "png" {
		ext = "png"
		params = pngParams
		contentType = "image/png"
	}

	buff, err := img.Process(params)
	if err != nil {
		log.Printf(red("Error converting image - %s: %s"), webpUrl, err)
		return c.Status(http.StatusInternalServerError).JSON("Error converting image")
	}

	endC := time.Now().UnixMilli()

	log.Printf(
		`-- GenerationG image converted in: %s - "%s" - "%s" --`,
		green(endC-startC, "ms"),
		yellow(imageId),
		yellow(ext),
	)
	c.Set("Content-Type", contentType)
	c.Set("Cache-Control", "public, immutable, no-transform, max-age=31536000")
	end := time.Now().UnixMilli()
	log.Printf(
		`-- GenerationG image response in: %s - "%s" - "%s" --`,
		green(end-start, "ms"),
		yellow(imageId),
		yellow(ext),
	)

	return c.Status(http.StatusOK).Send(buff)
}
