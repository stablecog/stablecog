package loggers

import (
	"log"

	"github.com/fatih/color"
	"github.com/yekta/stablecog/go-server/shared"
)

var yellow = color.New(color.FgHiYellow).SprintFunc()
var green = color.New(color.FgHiGreen).SprintFunc()

func LogGeneration(text string, obj SGenerationLogObject) {
	maxLen := 75
	var sPrompt string
	if len(obj.Prompt) > maxLen {
		sPrompt = obj.Prompt[:maxLen] + "..."
	} else {
		sPrompt = obj.Prompt
	}
	log.Printf(
		`-- %s - "%s" - "%s" - "%s" - %s - %s - %s - %s - %d - %s`,
		text,
		sPrompt,
		shared.ModelIdToModelNameCog[obj.ModelId],
		shared.SchedulerIdToSchedulerNameCog[obj.SchedulerId],
		green(obj.Width),
		green(obj.Height),
		green(obj.GuidanceScale),
		green(obj.NumInferenceSteps),
		obj.Seed,
		yellow(obj.ServerUrl),
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
