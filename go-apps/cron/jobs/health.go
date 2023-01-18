package jobs

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/yekta/stablecog/go-apps/database/ent"
	dbgeneration "github.com/yekta/stablecog/go-apps/database/ent/generation"
	"github.com/yekta/stablecog/go-apps/database/ent/server"
	"k8s.io/klog/v2"
)

// General redis key prefix
const redisHealthKeyPrefix = "health_check"

const maxGenerationFailWithoutNSFWRate = 0.5
const generationCountToCheck = 10
const maxGenerationDuration = 2 * time.Minute

const rTTL = 2 * time.Hour

var lastGenerationKey = fmt.Sprintf("%s:last_generation", redisHealthKeyPrefix)
var lastServersKey = fmt.Sprintf("%s:last_servers", redisHealthKeyPrefix)
var firstTimeKey = fmt.Sprintf("%s:first_time", redisHealthKeyPrefix)
var lastStatusKey = fmt.Sprintf("%s:last_status", redisHealthKeyPrefix)

// Query last generations from database
func (j *JobRunner) GetLastGenerations(limit int) ([]*ent.Generation, error) {
	return j.Db.Generation.Query().
		Select(dbgeneration.FieldStatus, dbgeneration.FieldCreatedAt, dbgeneration.FieldFailureReason).
		Order(ent.Desc(dbgeneration.FieldCreatedAt)).
		Limit(limit).
		All(j.Ctx)
}

// Query servers from database
func (j *JobRunner) GetServers() ([]*ent.Server, error) {
	return j.Db.Server.Query().Select(server.FieldID, server.FieldURL, server.FieldEnabled, server.FieldHealthy, server.FieldLastHealthCheckAt, server.FieldCreatedAt, server.FieldUpdatedAt, server.FieldFeatures).
		Order(ent.Desc(server.FieldCreatedAt)).
		All(j.Ctx)
}

// CheckHealth cron job
func (j *JobRunner) CheckHealth() error {
	start := time.Now()
	klog.Infof("Checking health...")

	serversStateChanged := false

	generations, err := j.GetLastGenerations(generationCountToCheck)
	if err != nil {
		klog.Errorf("Couldn't get generations %v", err)
		return err
	}

	servers, err := j.GetServers()
	if err != nil {
		klog.Errorf("Couldn't get servers %v", err)
		return err
	}

	// Get last servers list
	lastServersStr := j.Redis.Get(j.Ctx, lastServersKey).Val()
	var lastServers []*ent.Server
	if lastServersStr != "" {
		err := json.Unmarshal([]byte(lastServersStr), &lastServers)
		if err != nil {
			klog.Errorf("Couldn't unmarshal last servers %v", err)
			return err
		}
	}

	// See if first time running this job
	firstTimeStr := j.Redis.Get(j.Ctx, firstTimeKey).Val()
	firstTime := true
	if firstTimeStr != "" {
		firstTime = false
	}

	// Get last status
	lastStatus := "unknown"
	lastStatusStr := j.Redis.Get(j.Ctx, lastStatusKey).Val()
	if lastStatusStr != "" {
		lastStatus = lastStatusStr
	}

	var generationsFailed int
	var generationsFailedWithoutNSFW int
	var lastGenerationTime time.Time
	lastGenerationTimeStr := j.Redis.Get(j.Ctx, lastGenerationKey).Val()
	lastGenerationTime, _ = time.Parse(time.RFC3339, lastGenerationTimeStr)
	for i, generation := range generations {
		if i == 0 {
			lastGenerationTime = generation.CreatedAt
			err := j.Redis.Set(j.Ctx, lastGenerationKey, lastGenerationTime.Format(time.RFC3339), rTTL).Err()
			if err != nil {
				klog.Error("Redis - Error setting last generation key: %v", err)
				return err
			}
		}
		if generation.Status == nil {
			continue
		} else if *generation.Status == dbgeneration.StatusFailed {
			generationsFailed++
			if generation.FailureReason != nil && *generation.FailureReason != "NSFW" {
				generationsFailedWithoutNSFW++
			}
		} else if *generation.Status == dbgeneration.StatusStarted && time.Now().Sub(generation.CreatedAt) > maxGenerationDuration {
			generationsFailed++
			generationsFailedWithoutNSFW++
		}
	}
	/* generationFailRate := float64(generationsFailed) / float64(len(generations)) */
	generationFailWithoutNSFWRate := float64(generationsFailedWithoutNSFW) / float64(len(generations))
	klog.Infof("Generation fail rate: %d/%d", generationsFailed, len(generations))
	klog.Infof("Generation fail rate without NSFW: %d/%d", generationsFailedWithoutNSFW, len(generations))

	var healthyServerCount int
	var enabledServerCount int
	for _, server := range servers {
		if server.Healthy && server.Enabled {
			healthyServerCount++
		}
		if server.Enabled {
			enabledServerCount++
		}
		isNew := true
		for _, serverOld := range lastServers {
			if serverOld.URL == server.URL {
				isNew = false
				if (serverOld.Enabled != server.Enabled || serverOld.Healthy != server.Healthy) && !firstTime {
					serversStateChanged = true
					break
				}
			}
		}
		if !serversStateChanged && isNew && !firstTime {
			serversStateChanged = true
		}
	}
	if len(lastServers) != len(servers) {
		if !firstTime {
			serversStateChanged = true
		}
		lastServers = make([]*ent.Server, len(servers))
	}
	copy(lastServers, servers)
	j.Redis.Set(j.Ctx, firstTimeKey, "false", rTTL).Err()

	lastStatusPrev := lastStatus
	if healthyServerCount == 0 || generationFailWithoutNSFWRate > maxGenerationFailWithoutNSFWRate {
		lastStatus = "unhealthy"
	} else {
		lastStatus = "healthy"
	}
	now := time.Now()
	klog.Errorf("Healthy servers (enabled): %d/%d", healthyServerCount, enabledServerCount)
	klog.Errorf("Healthy servers (all): %d/%d", healthyServerCount, len(servers))
	klog.Errorf("Done checking health in: %dms", now.Sub(start).Milliseconds())

	return j.Discord.SendDiscordNotificationIfNeeded(
		lastStatus,
		lastStatusPrev,
		servers,
		serversStateChanged,
		generations,
		lastGenerationTime,
		now,
	)
}
