package user

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/supabase/postgrest-go"
	"github.com/yekta/stablecog/go-server/shared"
)

const pSize = 50

func GenerationsHandler(c *fiber.Ctx) error {
	token := c.Get("Authorization")
	_p, err := strconv.ParseInt(c.Query("page"), 10, 64)
	if err != nil || _p == 0 {
		_p = 1
	}
	p := int(_p)
	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(SGenerationsResult{
			Error: "Unauthorized",
		})
	}
	supabaseUserId := shared.GetSupabaseUserIdFromAccessToken(token)
	if supabaseUserId == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(SGenerationsResult{
			Error: "Unauthorized",
		})
	}
	var generations []SGeneration
	_, errGen := shared.SupabaseDb.
		From("generation").
		Select("id,width,height,num_inference_steps,guidance_scale,created_at,updated_at,model:model_id(id,name),scheduler:scheduler_id(id,name),prompt:prompt_id(id,text),negative_prompt:negative_prompt_id(id,text),image_object_name,seed,duration_ms", "", false).
		Eq("user_id", supabaseUserId).
		Not("image_object_name", "is", "null").
		Order("created_at", &postgrest.OrderOpts{Ascending: false}).
		Range((p-1)*pSize, p*pSize, "").
		ExecuteTo(&generations)
	if errGen != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(SGenerationsResult{
			Error: errGen.Error(),
		})
	}
	var generationsSliced []SGeneration
	if len(generations) > pSize {
		generationsSliced = generations[:len(generations)-1]
	} else {
		generationsSliced = generations
	}
	data := SGenerationsData{
		Generations: generationsSliced,
		Page:        p,
	}
	if len(generations) > pSize {
		data.Next = p + 1
	}
	return c.Status(fiber.StatusOK).JSON(SGenerationsResult{
		Data: data,
	})
}

type SGenerationsResult struct {
	Data  SGenerationsData `json:"data,omitempty"`
	Error string           `json:"error,omitempty"`
}

type SGenerationsData struct {
	Generations []SGeneration `json:"generations"`
	Page        int           `json:"page"`
	Next        int           `json:"next,omitempty"`
}

type SGeneration struct {
	Id              string           `json:"id"`
	Width           int              `json:"width"`
	Height          int              `json:"height"`
	InferenceSteps  int              `json:"num_inference_steps"`
	GuidanceScale   int              `json:"guidance_scale"`
	CreatedAt       string           `json:"created_at"`
	UpdatedAt       string           `json:"updated_at"`
	Model           SModel           `json:"model"`
	Scheduler       SScheduler       `json:"scheduler"`
	Prompt          SPrompt          `json:"prompt"`
	NegativePrompt  *SNegativePrompt `json:"negative_prompt,omitempty"`
	Seed            int64            `json:"seed"`
	ImageObjectName string           `json:"image_object_name,omitempty"`
	DurationMs      int              `json:"duration_ms,omitempty"`
}

type SModel struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type SScheduler struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type SPrompt struct {
	Id   string `json:"id"`
	Text string `json:"text"`
}

type SNegativePrompt struct {
	Id   string `json:"id"`
	Text string `json:"text"`
}
