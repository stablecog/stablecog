package shared

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func GetEnv(key string) string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("\nNo .env file, will try to use env variables...")
	}
	return os.Getenv(key)
}
