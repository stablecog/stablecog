package utils

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-redis/redis/v9"
	"github.com/yekta/stablecog/go-apps/cron/models"
	"github.com/yekta/stablecog/go-apps/database/ent"
	dbgeneration "github.com/yekta/stablecog/go-apps/database/ent/generation"
	"github.com/yekta/stablecog/go-apps/utils"
	"k8s.io/klog/v2"
)

// General redis key prefix
const redisDiscordKeyPrefix = "discord_notification"

// Keep state of health with these keys
var lastHealthyKey = fmt.Sprintf("%s:last_healthy", redisDiscordKeyPrefix)
var lastUnhealthyKey = fmt.Sprintf("%s:last_unhealthy", redisDiscordKeyPrefix)

// Constants
const unhealthyNotificationInterval = 5 * time.Minute
const healthyNotificationInterval = 1 * time.Hour
const rTTL = 2 * time.Hour

// For mocking
var klogInfof = klog.Infof

type DiscordHealthTracker struct {
	ctx                           context.Context
	webhookUrl                    string
	lastNotificationTime          time.Time
	lastUnhealthyNotificationTime time.Time
	lastHealthyNotificationTime   time.Time
	redis                         *redis.Client
}

func NewDiscordHealthTracker(ctx context.Context, redis *redis.Client) *DiscordHealthTracker {
	return &DiscordHealthTracker{
		ctx:        ctx,
		webhookUrl: utils.GetEnv("DISCORD_WEBHOOK_URL", ""),
		redis:      redis,
	}
}

func (d *DiscordHealthTracker) SendDiscordNotificationIfNeeded(
	status string,
	statusPrev string,
	servers []*ent.Server,
	serversStateChanged bool,
	generations []*ent.Generation,
	lastGenerationTime time.Time,
	lastCheckTime time.Time,
) error {
	lastHealthyStr := d.redis.Get(d.ctx, lastHealthyKey).Val()
	lastUnhealthyStr := d.redis.Get(d.ctx, lastUnhealthyKey).Val()
	d.lastHealthyNotificationTime, _ = time.Parse(time.RFC3339, lastHealthyStr)
	d.lastUnhealthyNotificationTime, _ = time.Parse(time.RFC3339, lastUnhealthyStr)

	sinceHealthyNotification := time.Since(d.lastHealthyNotificationTime)
	sinceUnhealthyNotification := time.Since(d.lastUnhealthyNotificationTime)

	if statusPrev == "unknown" || (status == statusPrev &&
		!serversStateChanged &&
		((status == "unhealthy" && sinceUnhealthyNotification < unhealthyNotificationInterval) ||
			(status == "healthy" && sinceHealthyNotification < healthyNotificationInterval))) {
		klogInfof("Skipping Discord notification, not needed")
		return nil
	}

	start := time.Now().UnixMilli()
	klog.Infoln("Sending Discord notification...")
	webhookBody := getDiscordWebhookBody(status, servers, generations, lastGenerationTime, lastCheckTime)
	reqBody, err := json.Marshal(webhookBody)
	if err != nil {
		klog.Errorf("Error marshalling webhook body: %s", err)
		return err
	}
	res, postErr := http.Post(d.webhookUrl, "application/json", bytes.NewBuffer(reqBody))
	if postErr != nil {
		klog.Errorf("Error sending webhook: %s", postErr)
		return postErr
	}
	defer res.Body.Close()
	d.lastNotificationTime = time.Now()
	if status == "healthy" {
		err := d.redis.Set(d.ctx, lastHealthyKey, d.lastNotificationTime.Format(time.RFC3339), rTTL).Err()
		if err != nil {
			klog.Error("Redis - Error setting last healthy key: %v", err)
			return err
		}
	} else {
		err := d.redis.Set(d.ctx, lastUnhealthyKey, d.lastNotificationTime.Format(time.RFC3339), rTTL).Err()
		if err != nil {
			klog.Errorf("Redis - Error setting last unhealthy key: %v", err)
			return err
		}
	}
	end := time.Now().UnixMilli()
	klog.Infof("Sent Discord notification in: %dms", end-start)
	return nil
}

func getDiscordWebhookBody(
	status string,
	servers []*ent.Server,
	generations []*ent.Generation,
	lastGenerationTime time.Time,
	lastCheckTime time.Time,
) models.DiscordWebhookBody {
	var statusStr string
	if status == "unhealthy" {
		statusStr = "🔴💀🔴"
	} else {
		statusStr = "🟢👌🟢"
	}
	serversStr := ""
	serversStrArr := []string{}
	generationsStr := ""
	generationsStrArr := []string{}
	for _, server := range servers {
		if !server.Enabled {
			serversStrArr = append(serversStrArr, "🖥️⚪️")
		} else if server.Healthy {
			serversStrArr = append(serversStrArr, "🖥️🟢")
		} else {
			serversStrArr = append(serversStrArr, "🖥️🔴")
		}
	}
	for _, generation := range generations {
		if generation.Status != nil {
			if *generation.Status == dbgeneration.StatusFailed {
				if generation.FailureReason != nil && *generation.FailureReason == "NSFW" {
					generationsStrArr = append(generationsStrArr, "🌶️")
				} else {
					generationsStrArr = append(generationsStrArr, "🔴")
				}
			} else if *generation.Status == "started" {
				generationsStrArr = append(generationsStrArr, "🟡")
			} else {
				generationsStrArr = append(generationsStrArr, "🟢")
			}
		}
	}
	serversStr = strings.Join(serversStrArr, "  ")
	generationsStr = strings.Join(generationsStrArr, "")
	body := models.DiscordWebhookBody{
		Embeds: []models.DiscordWebhookEmbed{
			{
				Color: 11437547,
				Fields: []models.DiscordWebhookField{
					{
						Name:  "Status",
						Value: fmt.Sprintf("```%s```", statusStr),
					},
					{
						Name:  "Servers",
						Value: fmt.Sprintf("```%s```", serversStr),
					},
					{
						Name:  "Generations",
						Value: fmt.Sprintf("```%s```", generationsStr),
					},
					{
						Name:  "Last Generation",
						Value: fmt.Sprintf("```%s```", utils.RelativeTimeStr(lastGenerationTime)),
					},
				},
				Footer: models.DiscordWebhookEmbedFooter{
					Text: lastCheckTime.Format(time.RFC1123),
				},
			},
		},
		Attachments: []models.DiscordWebhookAttachment{},
	}
	return body
}
