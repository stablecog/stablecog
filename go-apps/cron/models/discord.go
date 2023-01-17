package models

type DiscordWebhookBody struct {
	Content     *string                    `json:"content"`
	Embeds      []DiscordWebhookEmbed      `json:"embeds"`
	Attachments []DiscordWebhookAttachment `json:"attachments"`
}

type DiscordWebhookEmbed struct {
	Title  string                    `json:"title,omitempty"`
	Fields []DiscordWebhookField     `json:"fields"`
	Color  int                       `json:"color"`
	Footer DiscordWebhookEmbedFooter `json:"footer"`
}

type DiscordWebhookEmbedFooter struct {
	Text string `json:"text"`
}

type DiscordWebhookField struct {
	Name   string `json:"name"`
	Value  string `json:"value"`
	Inline bool   `json:"inline"`
}

type DiscordWebhookAttachment struct {
	Filename string `json:"filename"`
	Content  string `json:"content"`
}
