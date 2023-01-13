package shared

type WebhookStatus string

const (
	WebhookComplete   WebhookStatus = "completed"
	WebhookFailed     WebhookStatus = "failed"
	WebhookProcessing WebhookStatus = "processing"
)

type WebhookRequestInput struct {
	Id     string `json:"id"`
	Prompt string `json:"prompt"`
	Model  string `json:"model"`
	Width  string `json:"width"`
	Height string `json:"height"`
}

type WebhookRequest struct {
	Webhook string              `json:"webhook"`
	Input   WebhookRequestInput `json:"input"`
	Status  WebhookStatus       `json:"status"`
	Error   string              `json:"error"`
	Output  []string            `json:"output"`
}
