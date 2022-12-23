package shared

import (
	"context"
	"fmt"
	"log"

	"github.com/go-redis/redis/v9"
)

var Rdb *redis.Client
var ctx = context.Background()

func SetRedis() {
	url := fmt.Sprintf(
		"redis://%s:%s@%s:%s",
		GetEnv("REDIS_USERNAME"),
		GetEnv("REDIS_PASSWORD"),
		GetEnv("REDIS_HOST"),
		GetEnv("REDIS_PORT"),
	)
	opts, optsErr := redis.ParseURL(url)
	if optsErr != nil {
		log.Printf("-- Redis - Error parsing url: %v --", optsErr)
	}
	Rdb = redis.NewClient(opts)
	res := Rdb.Ping(ctx)
	log.Printf("-- Redis - Status - %v --", res)
}
