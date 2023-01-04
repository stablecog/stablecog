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
	log.Printf("IP: %s", ip)
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

func HasOnGoingGenerationOrUpscale(prefix string, c *fiber.Ctx) bool {
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
	return false
}

func SetOngoingGenerationOrUpscale(prefix string, duration time.Duration, c *fiber.Ctx) {
	rctx := Redis.Context()
	ip := c.Get("CF-Connecting-IP")
	if ip == "" {
		ip = c.Get("X-Forwarded-For")
	}
	if ip == "" {
		ip = c.IP()
	}
	ipKey := fmt.Sprintf("rl:%s:ip:%s", prefix, ip)
	err := Redis.Set(rctx, ipKey, "1", duration).Err()
	if err != nil {
		log.Printf("Redis - Error setting IP key: %v", err)
	}
}

func DeleteOngoingGenerationOrUpscale(prefix string, c *fiber.Ctx) {
	rctx := Redis.Context()
	ip := c.Get("CF-Connecting-IP")
	if ip == "" {
		ip = c.Get("X-Forwarded-For")
	}
	if ip == "" {
		ip = c.IP()
	}
	ipKey := fmt.Sprintf("rl:%s:ip:%s", prefix, ip)
	err := Redis.Del(rctx, ipKey).Err()
	if err != nil {
		log.Printf("Redis - Error deleting IP key: %v", err)
	}
}
