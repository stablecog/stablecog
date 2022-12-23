package shared

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
)

func IsRateLimited(c *fiber.Ctx, minDuration time.Duration) bool {
	ip := c.Get("CF-Connecting-IP")
	if ip == "" {
		ip = c.Get("X-Forwarded-For")
	}
	if ip == "" {
		ip = c.IP()
	}
	ipKey := fmt.Sprintf("ip:%s", ip)
	Cache.DeleteExpired()
	res := Cache.Get(ipKey)
	if res == nil {
		Cache.Set(ipKey, "1", minDuration)
		return false
	}
	return true
}
