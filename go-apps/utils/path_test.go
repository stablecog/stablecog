package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRootDir(t *testing.T) {
	// Setup

	// Mock runtime.Caller and restore at end
	old := RuntimeCaller
	defer func() { RuntimeCaller = old }()

	RuntimeCaller = func(x int) (uintptr, string, int, bool) {
		// This will be called, do whatever you want to,
		// return whatever you want to
		return 0, "/mock/app/utils/path.go", 0, true
	}

	// Test
	rootDir := RootDir()

	// Assert
	assert.Equal(t, "/mock/app", rootDir)
}
