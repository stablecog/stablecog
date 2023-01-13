package queueWebhook

type WebhookStatus string

const (
	Complete   WebhookStatus = "completed"
	Failed     WebhookStatus = "failed"
	Processing WebhookStatus = "processing"
)

type WebhookRequestInput struct {
	Id     string `json:"id"`
	Prompt string `json:"prompt"`
	Model  string `json:"model"`
	Width  string `json:"width"`
	Height string `json:"height"`
}

type WebhookRequest struct {
	Webook string              `json:"webhook"`
	Input  WebhookRequestInput `json:"input"`
	Status WebhookStatus       `json:"status"`
}
