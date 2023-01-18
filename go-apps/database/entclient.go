package database

import (
	"database/sql"

	"entgo.io/ent/dialect"
	entsql "entgo.io/ent/dialect/sql"
	_ "github.com/jackc/pgx/v4/stdlib"
	_ "github.com/mattn/go-sqlite3"
	"github.com/yekta/stablecog/go-apps/database/ent"
)

func NewEntClient(connInfo SqlDBConn) (*ent.Client, error) {
	db, err := sql.Open(connInfo.Dialect(), connInfo.DSN())
	if err != nil {
		return nil, err
	}

	// For some reason, ent doesn't recognize pgx as a valid dialect
	entDialect := connInfo.Dialect()
	if entDialect == "pgx" {
		entDialect = dialect.Postgres
	}
	drv := entsql.OpenDB(entDialect, db)
	return ent.NewClient(ent.Driver(drv)), nil
}
