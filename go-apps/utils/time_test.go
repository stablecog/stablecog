package utils

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestRelativeTimeStr(t *testing.T) {
	// Now
	now := time.Now()
	assert.Equal(t, "Just now", RelativeTimeStr(now))
	// 10s ago
	assert.Equal(t, "10s ago", RelativeTimeStr(now.Add(-10*time.Second)))
	// 45 ago
	assert.Equal(t, "45m ago", RelativeTimeStr(now.Add(-45*time.Minute)))
	// 1h ago
	assert.Equal(t, "1h ago", RelativeTimeStr(now.Add(-1*time.Hour)))
}
