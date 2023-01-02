package shared

import (
	"fmt"
	"log"
	"os"
	"regexp"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/mileusna/useragent"
)

func GetEnv(key string, fallback string) string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("\nNo .env file, will try to use env variables...")
	}
	k := os.Getenv(key)
	if k == "" {
		return fallback
	}
	return k
}

func RelativeTimeStr(t time.Time) string {
	now := time.Now()
	diff := now.Sub(t)
	diffInSeconds := int(diff.Seconds())
	if diffInSeconds < 2 {
		return "Just now"
	}
	if diffInSeconds < 60 {
		return fmt.Sprint(diffInSeconds, "s ago")
	}
	if diffInSeconds < 60*60 {
		return fmt.Sprint(diffInSeconds/60, "m ago")
	}
	return fmt.Sprint(diffInSeconds/60/60, "h ago")
}

func FormatPrompt(s string) string {
	cleanStr := RemoveSuffixSpaces(RemoveRedundantSpaces(RemoveLineBreaks(s)))
	if len(cleanStr) > MaxPromptLen {
		cleanStr = cleanStr[:MaxPromptLen]
	}
	return cleanStr
}

func RemoveLineBreaks(s string) string {
	var result string
	r := regexp.MustCompile(`\n`)
	result = r.ReplaceAllString(s, " ")
	return result
}

func RemoveRedundantSpaces(s string) string {
	var result string
	r := regexp.MustCompile(`\s+`)
	result = r.ReplaceAllString(s, " ")
	return result
}

func RemoveSuffixSpaces(s string) string {
	var result string
	r := regexp.MustCompile(`\s+$`)
	result = r.ReplaceAllString(s, "")
	return result
}

func GetDeviceType(client useragent.UserAgent) string {
	if client.Mobile {
		return "mobile"
	} else if client.Tablet {
		return "tablet"
	} else if client.Desktop {
		return "desktop"
	} else if client.Bot {
		return "bot"
	} else {
		return "unknown"
	}
}

func GetDurationFromEnv(envVar string, envFallback string) time.Duration {
	val, err := strconv.ParseInt(GetEnv(envVar, envFallback), 10, 64)
	if err != nil {
		panic(err)
	}
	dur := time.Duration(val * int64(time.Second))
	return dur
}

func Contains[T comparable](slice []T, value T) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}
