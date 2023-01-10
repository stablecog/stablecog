package utils

import (
	"os"
)

func GetEnv(key string, fallback string) string {
	value := os.Getenv(key)
	if len(value) == 0 {
		return fallback
	}
	return value
}

func GetDefaultServerUrl() string {
	return GetEnv("PUBLIC_DEFAULT_SERVER_URL", "")
}
