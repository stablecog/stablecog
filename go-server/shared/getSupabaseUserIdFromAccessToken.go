package shared

import (
	"context"
)

var ctx = context.Background()

func GetSupabaseUserIdFromAccessToken(accessToken string) string {
	if accessToken == "" {
		return ""
	}
	user, err := Supabase.Auth.User(ctx, accessToken)
	if err != nil || user == nil {
		return ""
	}
	return user.ID
}
