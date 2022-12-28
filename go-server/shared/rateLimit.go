package shared

import (
	"fmt"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
)

func IsRateLimited(prefix string, duration time.Duration, c *fiber.Ctx) bool {
	rctx := Redis.Context()
	ip := c.Get("CF-Connecting-IP")
	if ip == "" {
		ip = c.Get("X-Forwarded-For")
	}
	if ip == "" {
		ip = c.IP()
	}
	ipKey := fmt.Sprintf("rl:%s:ip:%s", prefix, ip)
	val := Redis.Get(rctx, ipKey).Val()
	if val == "1" {
		return true
	}
	err := Redis.Set(rctx, ipKey, "1", duration).Err()
	if err != nil {
		log.Printf("Redis - Error setting IP key: %v", err)
	}
	return false
}
