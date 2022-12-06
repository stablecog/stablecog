package shared

import (
	"fmt"
	"log"
	"os"
	"regexp"
	"time"

	"github.com/joho/godotenv"
	"github.com/mileusna/useragent"
)

func GetEnv(key string) string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("\nNo .env file, will try to use env variables...")
	}
	return os.Getenv(key)
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
