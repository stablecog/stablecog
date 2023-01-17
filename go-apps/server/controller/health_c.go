package controller

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/yekta/stablecog/go-apps/server/models"
	"github.com/yekta/stablecog/go-apps/utils"
)

// POST health endpoint
// Check the health of specified server
func (c *HttpController) PostHealth(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	reqBody, _ := io.ReadAll(r.Body)
	var healthRequest models.HealthRequestBody
	err := json.Unmarshal(reqBody, &healthRequest)
	if err != nil {
		models.ErrUnableToParseJson(w, r)
		return
	}

	// Validate
	if healthRequest.ServerUrl == "" {
		models.ErrBadRequest(w, r, "Bad request, server_url is required")
		return
	}

	// ! TODO
	if healthRequest.ServerUrl == utils.GetDefaultServerUrl() {
		return
	}
}
