package shared

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
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
