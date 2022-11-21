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
