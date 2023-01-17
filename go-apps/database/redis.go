package database

import (
	"context"

	"github.com/alicebob/miniredis/v2"
	"github.com/go-redis/redis/v9"
	"github.com/yekta/stablecog/go-apps/utils"
	"k8s.io/klog/v2"
)

var klogInfof = klog.Infof
var klogErrorf = klog.Errorf

// Should return render redis url if render is set
func GetRedisURL() string {
	if utils.GetEnv("RENDER", "") != "" {
		return utils.GetEnv("REDIS_CONNECTION_STRING_RENDER", "")
	}
	return utils.GetEnv("REDIS_CONNECTION_STRING", "")
}

func NewRedis(ctx context.Context) (*redis.Client, error) {
	var opts *redis.Options
	var err error
	if utils.GetEnv("MOCK_REDIS", "false") == "true" {
		klogInfof("Using mock redis client because MOCK_REDIS=true is set in environment")
		mr, _ := miniredis.Run()
		opts = &redis.Options{
			Addr: mr.Addr(),
		}
	} else {
		opts, err = redis.ParseURL(GetRedisURL())
		if err != nil {
			klogErrorf("Error parsing REDIS_CONNECTION_STRING: %v", err)
			return nil, err
		}
	}
	redis := redis.NewClient(opts)
	_, err = redis.Ping(ctx).Result()
	if err != nil {
		klogErrorf("Error pinging Redis: %v", err)
		return nil, err
	}
	return redis, nil
}
