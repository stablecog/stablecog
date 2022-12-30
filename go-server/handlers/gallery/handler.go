package gallery

import (
	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	"log"
	"math/rand"
	"strconv"
	"time"
)

const batchSize = 50

var green = color.New(color.FgHiGreen).SprintFunc()
var magenta = color.New(color.FgHiMagenta).SprintFunc()
var red = color.New(color.FgHiRed).SprintFunc()

func Handler(c *fiber.Ctx) error {
	start := time.Now().UTC().UnixMilli()
	p, e := strconv.Atoi(c.Query("page"))
	if e != nil || p < 1 {
		p = 1
	}
	countryCode := c.Get("CF-IPCountry")
	if countryCode == "" {
		countryCode = c.Get("X-Vercel-IP-Country")
	}
	log.Printf("-- Request for gallery page - %s - %s --", magenta(p), magenta(countryCode))
	search := c.Query("search")
	generationGs := GetGenerationGs(p, batchSize+1, search, "")
	if generationGs == nil {
		log.Printf(red("-- Failed to get generations for gallery page - %d --", p))
		return c.Status(fiber.StatusInternalServerError).JSON("Failed to get generations")
	}
	next := 0
	if len(generationGs) > batchSize {
		generationGs = generationGs[:batchSize]
		next = p + 1
	}
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(
		len(generationGs),
		func(i, j int) { generationGs[i], generationGs[j] = generationGs[j], generationGs[i] },
	)
	res := SGalleryResponse{
		Generations: generationGs,
		Page:        p,
		Next:        next,
	}
	end := time.Now().UTC().UnixMilli()
	log.Printf(
		"-- Responded to gallery page request: %s - %s - %s --",
		magenta(p),
		green(end-start, "ms"),
		magenta(countryCode),
	)
	return c.JSON(res)
}

type SGalleryResponse struct {
	Generations []SDBGenerationG `json:"generations"`
	Page        int              `json:"page"`
	Next        int              `json:"next,omitempty"`
}
