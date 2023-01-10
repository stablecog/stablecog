package middleware

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/stretchr/testify/assert"
)

func TestLogMiddleware(t *testing.T) {
	// Mock logger
	orgKlogInfof := klogInfof
	defer func() { klogInfof = orgKlogInfof }()

	// Write log output to string
	logs := []string{}
	klogInfof = func(format string, args ...interface{}) {
		logs = append(logs, fmt.Sprintf(format, args...))
	}

	// Test handler
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("[]"))
	})

	// Mock chi route context
	rctx := chi.NewRouteContext()
	rctx.RoutePatterns = []string{"/api/health"}

	req := httptest.NewRequest("GET", "/testlogmiddleware", nil)
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	w := httptest.NewRecorder()

	handler := LogMiddleware(testHandler)
	handler.ServeHTTP(w, req)

	resp := w.Result()
	defer resp.Body.Close()
	assert.Equal(t, 200, resp.StatusCode)
	assert.Equal(t, "--- /api/health - Returned resonse in: 0ms -  --", logs[0])
}
