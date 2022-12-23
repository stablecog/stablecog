package shared

import (
	"encoding/hex"
	"fmt"
	"time"

	"crypto/sha256"
	"github.com/gofiber/fiber/v2"
)

var salt = GetEnv("IP_SALT")

func IsRateLimited(c *fiber.Ctx, minDuration time.Duration) bool {
	ip := c.Get("X-Forwarded-For")
	if ip == "" {
		ip = c.IP()
	}

	ipBytes := []byte(ip)
	saltBytes := []byte(salt)
	resBytes := append(ipBytes, saltBytes...)

	var sha256Hasher = sha256.New()
	sha256Hasher.Write(resBytes)

	hashedIpBytes := sha256Hasher.Sum(nil)
	hashedIpHex := hex.EncodeToString(hashedIpBytes)

	ipKey := fmt.Sprintf("ip:%s", hashedIpHex)

	res := Rdb.Get(ctx, ipKey)
	if res.Val() == "" {
		Rdb.Set(ctx, ipKey, 1, minDuration)
		return false
	}
	return true
}
