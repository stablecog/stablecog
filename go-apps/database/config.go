package database

import (
	"fmt"
	"path"

	"entgo.io/ent/dialect"
	"github.com/yekta/stablecog/go-apps/utils"
	"k8s.io/klog/v2"
)

type SqlDBConn interface {
	DSN() string
	Dialect() string
}

type PostgresConn struct {
	Host     string
	Port     string
	Password string
	User     string
	DBName   string
}

func (c *PostgresConn) DSN() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s", c.User, c.Password, c.Host, c.Port, c.DBName)
}

func (c *PostgresConn) Dialect() string {
	return "pgx"
}

type SqliteConn struct {
	FileName string
	Mode     string
}

func (c *SqliteConn) DSN() string {
	return fmt.Sprintf("file:%s?cache=shared&mode=%s&_fk=1", c.FileName, c.Mode)
}

func (c *SqliteConn) Dialect() string {
	return dialect.SQLite
}

// Gets the DB connection information based on environment variables
func GetSqlDbConn(mock bool) (SqlDBConn, error) {
	if mock {
		return &SqliteConn{FileName: "testing", Mode: "memory"}, nil
	}
	// First see if postgres is confiugred
	postgresDb := utils.GetEnv("POSTGRES_DB", "")
	postgresUser := utils.GetEnv("POSTGRES_USER", "")
	postgresPassword := utils.GetEnv("POSTGRES_PASSWORD", "")
	postgresHost := utils.GetEnv("POSTGRES_HOST", "127.0.0.1")
	postgresPort := utils.GetEnv("POSTGRES_PORT", "5432")

	if postgresDb != "" && postgresUser != "" && postgresPassword != "" {
		klog.V(3).Infof("Using PostgreSQL database %s@%s:%s", postgresUser, postgresHost, postgresPort)
		return &PostgresConn{
			Host:     postgresHost,
			Port:     postgresPort,
			Password: postgresPassword,
			User:     postgresUser,
			DBName:   postgresDb,
		}, nil
	}

	klog.V(3).Infof("⚠️⚠️⚠️ No PostgreSQL configuration found, falling back to SQLite ⚠️⚠️⚠️")

	// Default to SQLite
	sqliteDb := path.Join(utils.RootDir(), "stablecog.db")
	klog.V(3).Infof("Using SQLite database at %s", sqliteDb)
	return &SqliteConn{
		FileName: sqliteDb,
		Mode:     "rwc",
	}, nil
}
