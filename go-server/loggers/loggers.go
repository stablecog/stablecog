package loggers

import (
	"log"

	"github.com/fatih/color"
	"github.com/yekta/stablecog/go-server/shared"
)

var yellow = color.New(color.FgHiYellow).SprintFunc()
var green = color.New(color.FgHiGreen).SprintFunc()
var magenta = color.New(color.FgHiMagenta).SprintFunc()

func LogGeneration(text string, obj SGenerationLogObject) {
	maxLen := 75
	var sPrompt string
	if len(obj.Prompt) > maxLen {
		sPrompt = obj.Prompt[:maxLen] + "..."
	} else {
		sPrompt = obj.Prompt
	}
	log.Printf(
		`-- %s - "%s" - "%s" - "%s" - %s - %s - %s - %s - %s - %s`,
		text,
		magenta(sPrompt),
		magenta(shared.ModelIdToModelNameCog[obj.ModelId]),
		magenta(shared.SchedulerIdToSchedulerNameCog[obj.SchedulerId]),
		magenta(obj.Width),
		magenta(obj.Height),
		magenta(obj.GuidanceScale),
		magenta(obj.NumInferenceSteps),
		magenta(obj.Seed),
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

func LogUpscale(text string, obj SUpscaleLogObject) {
	maxLen := 75
	var sPrompt string
	if len(obj.Prompt) > maxLen {
		sPrompt = obj.Prompt[:maxLen] + "..."
	} else {
		sPrompt = obj.Prompt
	}
	log.Printf(
		`-- %s - %s - %s - "%s" - %s - %s - %s - %s - %s - %s`,
		text,
		magenta(obj.Scale, "x"),
		magenta(obj.Type),
		magenta(sPrompt),
		magenta(obj.Width),
		magenta(obj.Height),
		magenta(obj.GuidanceScale),
		magenta(obj.NumInferenceSteps),
		magenta(obj.Seed),
		yellow(obj.ServerUrl),
	)
}

type SUpscaleLogObject struct {
	Type              string
	Scale             int
	Prompt            string
	NegativePrompt    string
	Width             int
	Height            int
	NumInferenceSteps int
	GuidanceScale     int
	Seed              int
	ServerUrl         string
}
