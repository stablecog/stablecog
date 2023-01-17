package utils

import (
	"net/http"
)

// Retrieves a country code via request header, prefer cloudflare, then vercel
func GetCountryCode(r *http.Request) string {
	countryCode := r.Header.Get("CF-IPCountry")
	if countryCode == "" {
		countryCode = r.Header.Get("X-Vercel-IP-Country")
	}
	return countryCode
}
