package upscale

import (
	"log"
	"time"

	"github.com/fatih/color"
	"github.com/yekta/stablecog/go-server/loggers"
	"github.com/yekta/stablecog/go-server/shared"
)

var red = color.New(color.FgHiRed).SprintFunc()

func InsertUpscaleInitial(g SInsertUpscaleProps) string {
	start := time.Now().UTC().UnixMilli()
	insertBody := SDBUpscaleInsertInitial{
		Type:              g.Type,
		Scale:             g.Scale,
		Prompt:            g.Prompt,
		NegativePrompt:    g.NegativePrompt,
		Width:             g.Width,
		Height:            g.Height,
		GuidanceScale:     g.GuidanceScale,
		NumInferenceSteps: g.NumInferenceSteps,
		Seed:              g.Seed,
		ServerUrl:         g.ServerUrl,
		Status:            "started",
		DeviceType:        g.DeviceType,
		DeviceBrowser:     g.DeviceBrowser,
		DeviceOS:          g.DeviceOS,
		UserAgent:         g.UserAgent,
		CountryCode:       g.CountryCode,
	}
	var res SDBUpscaleInsertInitialRes
	_, err := shared.Supabase.From("upscale").Insert(insertBody, false, "", "", "").Single().ExecuteTo(&res)
	if err != nil {
		log.Printf(red("-- DB - Error inserting upscale: %v --"), err)
		return ""
	}
	end := time.Now().UTC().UnixMilli()
	log.Printf("-- DB - Upscale initial insert in: %s%s --", green(end-start), green("ms"))
	g.UpscaleIdChan <- res.Id
	return res.Id
}

type SInsertUpscaleProps struct {
	Scale             int
	Type              string
	Prompt            string
	NegativePrompt    string
	Width             int
	Height            int
	GuidanceScale     int
	NumInferenceSteps int
	Seed              int
	Status            string
	ServerUrl         string
	UserAgent         string
	DeviceType        string
	DeviceBrowser     string
	DeviceOS          string
	CountryCode       string
	LogObject         loggers.SUpscaleLogObject
	UpscaleIdChan     chan string
}

type SDBUpscaleInsertInitial struct {
	Scale             int    `json:"scale"`
	Type              string `json:"type"`
	Prompt            string `json:"prompt"`
	NegativePrompt    string `json:"negative_prompt,omitempty"`
	Width             int    `json:"width"`
	Height            int    `json:"height"`
	GuidanceScale     int    `json:"guidance_scale"`
	NumInferenceSteps int    `json:"num_inference_steps"`
	Seed              int    `json:"seed"`
	Status            string `json:"status"`
	ServerUrl         string `json:"server_url"`
	UserAgent         string `json:"user_agent,omitempty"`
	CountryCode       string `json:"country_code,omitempty"`
	DeviceType        string `json:"device_type,omitempty"`
	DeviceBrowser     string `json:"device_browser,omitempty"`
	DeviceOS          string `json:"device_os,omitempty"`
}

type SDBUpscaleInsertInitialRes struct {
	Id                string `json:"id"`
	Scale             int    `json:"scale"`
	Type              string `json:"type"`
	Prompt            string `json:"prompt"`
	NegativePrompt    string `json:"negative_prompt,omitempty"`
	Width             int    `json:"width"`
	Height            int    `json:"height"`
	GuidanceScale     int    `json:"guidance_scale"`
	NumInferenceSteps int    `json:"num_inference_steps"`
	Seed              int    `json:"seed"`
	Status            string `json:"status"`
	ServerUrl         string `json:"server_url"`
	UserAgent         string `json:"user_agent,omitempty"`
	CountryCode       string `json:"country_code,omitempty"`
	DeviceType        string `json:"device_type,omitempty"`
	DeviceBrowser     string `json:"device_browser,omitempty"`
	DeviceOS          string `json:"device_os,omitempty"`
}
