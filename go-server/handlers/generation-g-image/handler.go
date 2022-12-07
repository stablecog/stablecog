package generationGImage

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/davidbyttow/govips/v2/vips"
	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	"github.com/yekta/stablecog/go-server/shared"
)

var r2Url = shared.GetEnv("PUBLIC_R2_URL")
var red = color.New(color.FgHiRed).SprintFunc()
var green = color.New(color.FgHiGreen).SprintFunc()
var yellow = color.New(color.FgHiYellow).SprintFunc()

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
	img, err := vips.NewImageFromBuffer(data)
	if err != nil {
		log.Printf(red("Error creating image from buffer - %s: %s"), webpUrl, err)
		return c.Status(http.StatusInternalServerError).JSON("Error creating image from buffer")
	}
	ext := "jpg"
	if imageExt == "png" {
		ext = "png"
	}
	jpegParams := vips.NewJpegExportParams()
	pngParams := vips.NewPngExportParams()
	var converted []byte
	if ext == "png" {
		buff, _, err := img.ExportPng(pngParams)
		if err != nil {
			log.Printf(red("Error converting image - %s: %s"), webpUrl, err)
			return c.Status(http.StatusInternalServerError).JSON("Error converting image")
		}
		converted = buff
	} else {
		buff, _, err := img.ExportJpeg(jpegParams)
		if err != nil {
			log.Printf(red("Error converting image - %s: %s"), webpUrl, err)
			return c.Status(http.StatusInternalServerError).JSON("Error converting image")
		}
		converted = buff
	}
	endC := time.Now().UnixMilli()
	log.Printf(
		`-- GenerationG image converted in: %s - "%s" - "%s" --`,
		green(endC-startC, "ms"),
		yellow(imageId),
		yellow(ext),
	)
	contentType := "image/jpeg"
	if ext == "png" {
		contentType = "image/png"
	}
	c.Set("Content-Type", contentType)
	c.Set("Cache-Control", "public, immutable, no-transform, max-age=31536000")
	end := time.Now().UnixMilli()
	log.Printf(
		`-- GenerationG image response in: %s - "%s" - "%s" --`,
		green(end-start, "ms"),
		yellow(imageId),
		yellow(ext),
	)
	return c.Status(http.StatusOK).Send(converted)
}
