package structs

type SDBGeneration struct {
	Id        string `json:"id"`
	Status    string `json:"status"`
	CreatedAt string `json:"created_at"`
}

type SDBServer struct {
	Id                string `json:"id"`
	Enabled           bool   `json:"enabled"`
	Healthy           bool   `json:"healthy"`
	LastHealthCheckAt string `json:"last_health_check_at"`
	Url               string `json:"url"`
}

type SDiscordWebhookBody struct {
	Content     *string                     `json:"content"`
	Embeds      []SDiscordWebhookEmbed      `json:"embeds"`
	Attachments []SDiscordWebhookAttachment `json:"attachments"`
}

type SDiscordWebhookEmbed struct {
	Title  string                     `json:"title"`
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
