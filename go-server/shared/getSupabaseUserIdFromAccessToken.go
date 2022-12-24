package shared

import (
	"context"
)

var ctx = context.Background()

func GetSupabaseUserIdFromAccessToken(accessToken string) string {
	if accessToken == "" {
		return ""
	}
	user, err := SupabaseAuth.WithToken(accessToken).GetUser()
	if err != nil || user == nil {
		return ""
	}
	return user.ID.String()
}
