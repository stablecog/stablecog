package loggers

import (
	"log"

	"github.com/yekta/stablecog/aux-go/shared"
)

func LogGeneration(text string, obj SGenerationLogObject) {
	maxLen := 75
	var sPrompt string
	if len(obj.Prompt) > maxLen {
		sPrompt = obj.Prompt[:maxLen] + "..."
	} else {
		sPrompt = obj.Prompt
	}
	log.Printf(
		`-- %s - "%s" - "%s" - "%s" - %d - %d - %d - %d - %d - "%s"`,
		text,
		sPrompt,
		shared.ModelIdToModelNameCog[obj.ModelId],
		shared.SchedulerIdToSchedulerNameCog[obj.SchedulerId],
		obj.Width,
		obj.Height,
		obj.GuidanceScale,
		obj.NumInferenceSteps,
		obj.Seed,
		obj.ServerUrl,
	)
}

type SGenerationLogObject struct {
	Prompt            string
	NegativePrompt    string
	ModelId           string
	SchedulerId       string
	Width             int
	Height            int
	NumInferenceSteps int
	GuidanceScale     int
	Seed              int
	ServerUrl         string
}
