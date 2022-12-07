package shared

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func CheckServer(serverUrl string) SHealthResponse {
	endpoint := fmt.Sprintf("%s/openapi.json", serverUrl)
	res, err := http.Get(endpoint)
	if res.StatusCode != http.StatusOK {
		log.Printf(red("Checking server HTTP status code: %d"), res.StatusCode)
		return SHealthResponse{
			Status: "unhealthy",
		}
	}
	if err != nil {
		log.Printf(red("Checking server HTTP error: %s"), err.Error())
		return SHealthResponse{
			Status: "unhealthy",
		}
	}
	var data SServerResult
	jErr := json.NewDecoder(res.Body).Decode(&data)
	if jErr != nil {
		log.Printf(red("Checking server JSON error: %s"), jErr.Error())
		return SHealthResponse{
			Status: "unhealthy",
		}
	}
	if data.Components.Schemas.Input.Properties.Prompt == nil ||
		data.Components.Schemas.Input.Properties.GuidanceScale == nil ||
		data.Components.Schemas.Input.Properties.NumInferenceSteps == nil ||
		data.Components.Schemas.Input.Properties.Seed == nil {
		log.Printf(red("Missing one of the critical features: Prompt, Width, Height, GuidanceScale, NumInferenceSteps, Seed"))
		return SHealthResponse{
			Status: "unhealthy",
		}
	}
	var features []string
	if data.Components.Schemas.Input.Properties.NegativePrompt != nil {
		features = append(features, "negative_prompt")
	}
	if data.Components.Schemas.Input.Properties.ImageU != nil {
		features = append(features, "upscale")
	}
	return SHealthResponse{
		Status:   "healthy",
		Features: features,
	}
}

type SServerResult struct {
	Components *struct {
		Schemas *struct {
			Input *struct {
				Properties *struct {
					Prompt *struct {
						Title string `json:"title,omitempty"`
					} `json:"prompt,omitempty"`
					NegativePrompt *struct {
						Title string `json:"title,omitempty"`
					} `json:"negative_prompt,omitempty"`
					GuidanceScale *struct {
						Title string `json:"title,omitempty"`
					} `json:"guidance_scale,omitempty"`
					NumInferenceSteps *struct {
						Title string `json:"title,omitempty"`
					} `json:"num_inference_steps,omitempty"`
					Seed *struct {
						Title string `json:"title,omitempty"`
					} `json:"seed,omitempty"`
					ImageU *struct {
						Title string `json:"title,omitempty"`
					} `json:"image_u,omitempty"`
				} `json:"properties,omitempty"`
			} `json:"Input,omitempty"`
		} `json:"schemas,omitempty"`
	} `json:"components,omitempty"`
}
