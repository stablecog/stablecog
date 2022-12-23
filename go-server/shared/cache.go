package shared

import (
	"github.com/jellydator/ttlcache/v3"
)

var Cache *ttlcache.Cache[string, string]

func SetupCache() {
	Cache = ttlcache.New(
		ttlcache.WithTTL[string, string](ttlcache.DefaultTTL),
		ttlcache.WithDisableTouchOnHit[string, string](),
	)
	go Cache.Start()
}
