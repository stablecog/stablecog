package constants

import "github.com/yekta/stablecog/go-apps/server/models"

var DefaultServerModels = []string{
	"Stable Diffusion v1.5",
	"Openjourney",
	"Redshift Diffusion",
	"Arcane Diffusion",
	"Mo-Di Diffusion",
	"Ghibli Diffusion",
}
var DefaultServerSchedulers = []string{
	"K_LMS",
	"K_EULER",
	"K_EULER_ANCESTRAL",
}
var DefaultServerFeatures = []models.Feature{
	{Name: "upscale"},
	{Name: "negative_prompt"},
	{Name: "model", Values: DefaultServerModels},
	{Name: "scheduler", Values: DefaultServerSchedulers},
}
