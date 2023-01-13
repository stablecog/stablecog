package shared

type SDBGeneration struct {
	Id            string `json:"id"`
	Status        string `json:"status"`
	FailureReason string `json:"failure_reason"`
	CreatedAt     string `json:"created_at"`
}

type SDBServer struct {
	Id                string     `json:"id"`
	Healthy           bool       `json:"healthy"`
	LastHealthCheckAt string     `json:"last_health_check_at"`
	Url               string     `json:"url"`
	Enabled           bool       `json:"enabled,omitempty"`
	CreatedAt         string     `json:"created_at,omitempty"`
	UpdatedAt         string     `json:"updated_at,omitempty"`
	Features          []SFeature `json:"features,omitempty"`
}

type SDBServerUpdate struct {
	Id                string `json:"id"`
	Healthy           bool   `json:"healthy"`
	LastHealthCheckAt string `json:"last_health_check_at,omitempty"`
}

type SDiscordWebhookBody struct {
	Content     *string                     `json:"content"`
	Embeds      []SDiscordWebhookEmbed      `json:"embeds"`
	Attachments []SDiscordWebhookAttachment `json:"attachments"`
}

type SDiscordWebhookEmbed struct {
	Title  string                     `json:"title,omitempty"`
	Fields []SDiscordWebhookField     `json:"fields"`
	Color  int                        `json:"color"`
	Footer SDiscordWebhookEmbedFooter `json:"footer"`
}

type SDiscordWebhookEmbedFooter struct {
	Text string `json:"text"`
}

type SDiscordWebhookField struct {
	Name   string `json:"name"`
	Value  string `json:"value"`
	Inline bool   `json:"inline"`
}

type SDiscordWebhookAttachment struct {
	Filename string `json:"filename"`
	Content  string `json:"content"`
}

type SInternalServerErrorResponse struct {
	Error string `json:"error"`
}

type SCogGenerateResponseBody struct {
	Output []string `json:"output,omitempty"`
}

type SCogUpscaleResponseBody struct {
	Output []string `json:"output,omitempty"`
}

type SGenerateRequestBody struct {
	Prompt                string  `json:"prompt"`
	NegativePrompt        string  `json:"negative_prompt,omitempty"`
	Width                 int     `json:"width"`
	Height                int     `json:"height"`
	NumInferenceSteps     int     `json:"num_inference_steps"`
	GuidanceScale         int     `json:"guidance_scale"`
	ServerUrl             string  `json:"server_url"`
	ModelId               string  `json:"model_id"`
	SchedulerId           string  `json:"scheduler_id"`
	Seed                  int     `json:"seed"`
	OutputImageExt        string  `json:"output_image_ext,omitempty"`
	InitImage             string  `json:"init_image,omitempty"`
	Mask                  string  `json:"mask,omitempty"`
	PromptStrength        float32 `json:"prompt_strength,omitempty"`
	ShouldSubmitToGallery bool    `json:"should_submit_to_gallery"`
	AccessToken           string  `json:"access_token,omitempty"`
}

type SCogGenerateRequestBody struct {
	Input SCogGenerateRequestInput `json:"input"`
}
type SCogGenerateRequestInput struct {
	ID                string  `json:"id"`
	Prompt            string  `json:"prompt"`
	NegativePrompt    string  `json:"negative_prompt,omitempty"`
	Width             string  `json:"width"`
	Height            string  `json:"height"`
	OutputImageExt    string  `json:"output_image_ext"`
	NumInferenceSteps string  `json:"num_inference_steps"`
	GuidanceScale     string  `json:"guidance_scale"`
	Model             string  `json:"model"`
	Scheduler         string  `json:"scheduler"`
	InitImage         string  `json:"init_image,omitempty"`
	PromptStrength    float32 `json:"prompt_strength,omitempty"`
	Mask              string  `json:"mask,omitempty"`
	Seed              string  `json:"seed"`
}

type SUpscaleRequestBody struct {
	Prompt            string `json:"prompt"`
	NegativePrompt    string `json:"negative_prompt,omitempty"`
	Width             int    `json:"width"`
	Height            int    `json:"height"`
	NumInferenceSteps int    `json:"num_inference_steps"`
	GuidanceScale     int    `json:"guidance_scale"`
	ServerUrl         string `json:"server_url"`
	Seed              int    `json:"seed"`
	ImageB64          string `json:"image_b64"`
	AccessToken       string `json:"access_token,omitempty"`
}

type SCogUpscaleRequestBody struct {
	Input SCogUpscaleRequestInput `json:"input"`
}
type SCogUpscaleRequestInput struct {
	Image       string `json:"image_u"`
	Task        string `json:"task_u,omitempty"`
	ProcessType string `json:"process_type"`
}

type SHealthResponse struct {
	Status   string     `json:"status"`
	Features []SFeature `json:"features,omitempty"`
}

type SFeature struct {
	Name   string   `json:"name"`
	Values []string `json:"values,omitempty"`
}

type SUserResponse struct {
	SubsciptionTier string `json:"subscription_tier"`
}

type SGenerateOrUpscaleRequestBody struct {
	Prompt                string  `json:"prompt,omitempty"`
	NegativePrompt        string  `json:"negative_prompt,omitempty"`
	Width                 int     `json:"width,omitempty"`
	Height                int     `json:"height,omitempty"`
	NumInferenceSteps     int     `json:"num_inference_steps,omitempty"`
	GuidanceScale         int     `json:"guidance_scale,omitempty"`
	ServerUrl             string  `json:"server_url,omitempty"`
	ModelId               string  `json:"model_id,omitempty"`
	SchedulerId           string  `json:"scheduler_id,omitempty"`
	Seed                  int     `json:"seed,omitempty"`
	OutputImageExt        string  `json:"output_image_ext,omitempty"`
	InitImage             string  `json:"init_image,omitempty"`
	Mask                  string  `json:"mask,omitempty"`
	PromptStrength        float32 `json:"prompt_strength,omitempty"`
	ShouldSubmitToGallery bool    `json:"should_submit_to_gallery,omitempty"`
	AccessToken           string  `json:"access_token,omitempty"`
	ImageB64              string  `json:"image_b64,omitempty"`
}

type SCogGenerateRequestQueue struct {
	Input               SCogGenerateRequestInput   `json:"input"`
	WebhookEventFilters []WebhookEventFilterOption `json:"webhook_event_filters"`
	Webhook             string                     `json:"webhook"`
}
