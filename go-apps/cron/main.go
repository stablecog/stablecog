// Sets up a CLI to trigger the various cron jobs
package cron

import (
	"context"
	"flag"
	"fmt"
	"os"

	"github.com/appditto/pippin_nano_wallet/apps/server"
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
	_, err := database.NewRedis(ctx)
	if err != nil {
		klog.Fatalf("Error connecting to redis: %v", err)
		os.Exit(1)
	}

	if *healthCheck {
		server.StartPippinServer()
		os.Exit(0)
	}

	// Generic path, they didn't say what they wanted.
	usage()
	os.Exit(1)

}
