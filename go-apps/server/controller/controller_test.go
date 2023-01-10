// Test setup for the controller package
package controller

import (
	"os"
	"testing"
)

var MockController *HttpController

func TestMain(m *testing.M) {
	os.Exit(testMainWrapper(m))
}

func testMainWrapper(m *testing.M) int {
	// Setup controller
	MockController = &HttpController{}

	return m.Run()
}
