package shared

type WebhookStatus string

const (
	WebhookSucceeded  WebhookStatus = "succeeded"
	WebhookFailed     WebhookStatus = "failed"
	WebhookProcessing WebhookStatus = "processing"
)

type WebhookEventFilterOption string

const (
	WebhookEventStart     WebhookEventFilterOption = "start"
	WebhookEventOutput    WebhookEventFilterOption = "output"
	WebhookEventCompleted WebhookEventFilterOption = "completed"
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
