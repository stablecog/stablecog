package shared

import (
	"context"
	"log"

	"github.com/getsentry/sentry-go"
)

var ctx = context.Background()

func GetSupabaseUserIdFromAccessToken(accessToken string) string {
	if accessToken == "" {
		return ""
	}

	user, err := SupabaseAuth.WithToken(accessToken).GetUser()
	if err != nil {
		log.Printf("Error getting user from Supabase: %v", err)
		sentry.CaptureException(err)
		return ""
	}

	if user == nil {
		log.Printf("User not found in Supabase")
		return ""
	}

	return user.ID.String()
}
