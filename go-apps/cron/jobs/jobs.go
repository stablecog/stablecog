package jobs

import (
	"context"

	"github.com/go-redis/redis/v9"
	"github.com/yekta/stablecog/go-apps/cron/utils"
	"github.com/yekta/stablecog/go-apps/database/ent"
)

type JobRunner struct {
	Redis   *redis.Client
	Ctx     context.Context
	Db      *ent.Client
	Discord *utils.DiscordHealthTracker
}
