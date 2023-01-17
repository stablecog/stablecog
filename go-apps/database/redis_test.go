package database

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetRedisURL(t *testing.T) {
	// Setup
	os.Setenv("RENDER", "true")
	defer os.Unsetenv("RENDER")
	os.Setenv("REDIS_CONNECTION_STRING_RENDER", "wewantthis")
	defer os.Unsetenv("REDIS_CONNECTION_STRING_RENDER")
	os.Setenv("REDIS_CONNECTION_STRING", "weDoNotwantthisIfRenderIsSet")
	defer os.Unsetenv("REDIS_CONNECTION_STRING")

	// Assert
	assert.Equal(t, "wewantthis", GetRedisURL())
	os.Unsetenv("RENDER")
	assert.Equal(t, "weDoNotwantthisIfRenderIsSet", GetRedisURL())
}

func TestMockRedis(t *testing.T) {
	os.Setenv("MOCK_REDIS", "true")
	defer os.Unsetenv("MOCK_REDIS")

	// Mock logger
	orgKlogInfof := klogInfof
	defer func() { klogInfof = orgKlogInfof }()

	// Write log output to string
	logs := []string{}
	klogInfof = func(format string, args ...interface{}) {
		logs = append(logs, fmt.Sprintf(format, args...))
	}

	_, err := NewRedis(context.TODO())
	assert.Nil(t, err)
	assert.Equal(t, "Using mock redis client because MOCK_REDIS=true is set in environment", logs[0])
}

func TestInvalidConnUrlFails(t *testing.T) {
	// Setup
	os.Setenv("REDIS_CONNECTION_STRING", "invalidredisurl")

	// Mock logger
	orgKlogErrorf := klogErrorf
	defer func() { klogErrorf = orgKlogErrorf }()

	// Write log output to string
	logs := []string{}
	klogErrorf = func(format string, args ...interface{}) {
		logs = append(logs, fmt.Sprintf(format, args...))
	}

	_, err := NewRedis(context.TODO())
	assert.NotNil(t, err)
	assert.Equal(t, "Error parsing REDIS_CONNECTION_STRING: redis: invalid URL scheme: ", logs[0])
}

func TestPingErrorIfCantConnect(t *testing.T) {
	// Setup
	os.Setenv("REDIS_CONNECTION_STRING", "redis://notarealredishost:1234")

	// Mock logger
	orgKlogErrorf := klogErrorf
	defer func() { klogErrorf = orgKlogErrorf }()

	// Write log output to string
	logs := []string{}
	klogErrorf = func(format string, args ...interface{}) {
		logs = append(logs, fmt.Sprintf(format, args...))
	}

	_, err := NewRedis(context.TODO())
	assert.NotNil(t, err)
	assert.Equal(t, "Error pinging Redis: dial tcp: lookup notarealredishost on 127.0.0.11:53: no such host", logs[0])
}
