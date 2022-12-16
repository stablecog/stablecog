package shared

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

func CheckServer(serverUrl string) SHealthResponse {
	endpoint := fmt.Sprintf("%s/openapi.json", serverUrl)
	ctx, cncl := context.WithTimeout(context.Background(), time.Second*10)
	defer cncl()
	req, reqErr := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if reqErr != nil {
		log.Printf(red("Checking server HTTP error: %s"), reqErr.Error())
		return SHealthResponse{
			Status: "unhealthy",
		}
	}
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf(red("Checking server HTTP error: %s"), err.Error())
		return SHealthResponse{
			Status: "unhealthy",
		}
	}
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
	if data.Components != nil && data.Components.Schemas != nil && data.Components.Schemas.Input.Properties.Prompt == nil ||
		data.Components.Schemas.Input.Properties.GuidanceScale == nil ||
		data.Components.Schemas.Input.Properties.NumInferenceSteps == nil ||
		data.Components.Schemas.Input.Properties.Seed == nil {
		log.Printf(red("Missing one of the critical features: Prompt, Width, Height, GuidanceScale, NumInferenceSteps, Seed"))
		return SHealthResponse{
			Status: "unhealthy",
		}
	}
	var features []SFeature
	if data.Components.Schemas.Input.Properties.NegativePrompt != nil {
		features = append(features, SFeature{
			Name: "negative_prompt",
		})
	}
	if data.Components.Schemas.Input.Properties.ImageU != nil {
		features = append(features, SFeature{
			Name: "upscale",
		})
	}
	if data.Components.Schemas.Model != nil {
		models := data.Components.Schemas.Model.Enum
		features = append(features, SFeature{
			Name:   "model",
			Values: models,
		})
	}
	if data.Components.Schemas.Scheduler != nil {
		schedulers := data.Components.Schemas.Scheduler.Enum
		features = append(features, SFeature{
			Name:   "scheduler",
			Values: schedulers,
		})
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
					Model *struct {
						Default string `json:"default,omitempty"`
					} `json:"model,omitempty"`
					Scheduler *struct {
						Default string `json:"default,omitempty"`
					}
				} `json:"properties,omitempty"`
			} `json:"Input,omitempty"`
			Model *struct {
				Enum []string `json:"enum,omitempty"`
			} `json:"model,omitempty"`
			Scheduler *struct {
				Enum []string `json:"enum,omitempty"`
			} `json:"scheduler,omitempty"`
		} `json:"schemas,omitempty"`
	} `json:"components,omitempty"`
}
