package database

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/yekta/stablecog/go-apps/utils"
)

func TestGetSqlDbConnPostgres(t *testing.T) {
	// Postgres
	os.Setenv("POSTGRES_DB", "pippin")
	os.Setenv("POSTGRES_USER", "user")
	os.Setenv("POSTGRES_PASSWORD", "password")
	os.Setenv("POSTGRES_HOST", "127.0.0.1")
	defer os.Unsetenv("POSTGRES_DB")
	defer os.Unsetenv("POSTGRES_USER")
	defer os.Unsetenv("POSTGRES_PASSWORD")
	defer os.Unsetenv("POSTGRES_HOST")

	conn, err := GetSqlDbConn(false)
	assert.Nil(t, err)

	assert.Equal(t, "postgres://user:password@127.0.0.1:5432/pippin", conn.DSN())
	assert.Equal(t, "pgx", conn.Dialect())
}

func TestGetSqlDbConnSqlite(t *testing.T) {
	// Mock runtime.Caller and restore at end
	old := utils.RuntimeCaller
	defer func() { utils.RuntimeCaller = old }()

	utils.RuntimeCaller = func(x int) (uintptr, string, int, bool) {
		// This will be called, do whatever you want to,
		// return whatever you want to
		return 0, "/mock/app/utils/path.go", 0, true
	}

	conn, err := GetSqlDbConn(false)
	assert.Nil(t, err)

	assert.Equal(t, "file:/mock/app/stablecog.db?cache=shared&mode=rwc&_fk=1", conn.DSN())
	assert.Equal(t, "sqlite3", conn.Dialect())
}

func TestGetSqlDbConnMock(t *testing.T) {
	conn, err := GetSqlDbConn(true)
	assert.Nil(t, err)

	assert.Equal(t, "file:testing?cache=shared&mode=memory&_fk=1", conn.DSN())
	assert.Equal(t, "sqlite3", conn.Dialect())
}
