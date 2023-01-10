package utils

import (
	"bytes"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetCountryCode(t *testing.T) {
	// 2 methods of getting country code, CF header or vercel header

	// Test that CF is preferred if both present
	request, _ := http.NewRequest(http.MethodPost, "stablecog.com", bytes.NewReader([]byte("")))
	request.Header.Set("CF-IPCountry", "cloudflare")
	request.Header.Set("X-Vercel-IP-Country", "vercel")
	assert.Equal(t, "cloudflare", GetCountryCode(request))

	// test that vercel is gotten if cloudflare not presnet
	request, _ = http.NewRequest(http.MethodPost, "stablecog.com", bytes.NewReader([]byte("")))
	request.Header.Set("X-Vercel-IP-Country", "vercel")
	assert.Equal(t, "vercel", GetCountryCode(request))

	// Test that empty string if neither provided
	request, _ = http.NewRequest(http.MethodPost, "stablecog.com", bytes.NewReader([]byte("")))
	assert.Empty(t, GetCountryCode(request))
}
