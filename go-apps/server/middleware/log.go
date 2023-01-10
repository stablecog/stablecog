package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/yekta/stablecog/go-apps/server/utils"
	"github.com/yekta/stablecog/go-apps/server/utils/color"
	"k8s.io/klog/v2"
)

var klogInfof = klog.Infof

// Tracks duration of request and logs output
func LogMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Start time of request
		start := time.Now().UTC().UnixMilli()

		next.ServeHTTP(w, r)

		end := time.Now().UTC().UnixMilli()
		// Get route name
		rctx := chi.RouteContext(r.Context())
		routePattern := strings.Join(rctx.RoutePatterns, "")
		klogInfof("--- %s - Returned resonse in: %s - %s --", routePattern, color.Green(end-start, "ms"), color.Magenta(utils.GetCountryCode(r)))
	})
}
