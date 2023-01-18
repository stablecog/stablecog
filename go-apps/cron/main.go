// Sets up a CLI to trigger the various cron jobs
package cron

import (
	"context"
	"flag"
	"fmt"
	"os"

	"github.com/yekta/stablecog/go-apps/cron/jobs"
	"github.com/yekta/stablecog/go-apps/cron/utils"
	"github.com/yekta/stablecog/go-apps/database"
	"k8s.io/klog/v2"
)

func usage() {
	fmt.Printf("Usage %s [options]\n", os.Args[0])
	flag.PrintDefaults()
	return
}

func main() {
	showHelp := flag.Bool("help", false, "Show help")
	healthCheck := flag.Bool("healthCheck", false, "Run the health check job")
	klog.InitFlags(nil)
	flag.Set("logtostderr", "true")
	flag.Set("stderrthreshold", "INFO")
	flag.Set("v", "3")

	flag.Parse()

	if *showHelp {
		usage()
		os.Exit(0)
	}

	ctx := context.Background()

	// Setup redis
	redis, err := database.NewRedis(ctx)
	if err != nil {
		klog.Fatalf("Error connecting to redis: %v", err)
		os.Exit(1)
	}

	// Setup sql
	klog.Infoln("🏡 Connecting to database...")
	dbconn, err := database.GetSqlDbConn(false)
	if err != nil {
		klog.Fatalf("Failed to connect to database: %v", err)
		os.Exit(1)
	}
	entClient, err := database.NewEntClient(dbconn)
	if err != nil {
		klog.Fatalf("Failed to create ent client: %v", err)
		os.Exit(1)
	}
	defer entClient.Close()

	// Create a job runner
	jobRunner := jobs.JobRunner{
		Ctx:     ctx,
		Db:      entClient,
		Redis:   redis,
		Discord: utils.NewDiscordHealthTracker(ctx, redis),
	}

	if *healthCheck {
		err := jobRunner.CheckHealth()
		if err != nil {
			klog.Fatalf("Error running health check: %v", err)
			os.Exit(1)
		}
		os.Exit(0)
	}

	// Generic path, they didn't say what they wanted.
	usage()
	os.Exit(1)

}
