package utils

import (
	"fmt"
	"time"
)

// Create a relative time string from now to past (e.g., "1h ago")
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
