package database

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewEntClient(t *testing.T) {
	dbconn, _ := GetSqlDbConn(true)

	client, err := NewEntClient(dbconn)
	assert.Nil(t, err)
	assert.NotNil(t, client)
}
