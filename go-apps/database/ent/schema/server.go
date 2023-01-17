package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// Server holds the schema definition for the Server entity.
type Server struct {
	ent.Schema
}

// Fields of the Server.
func (Server) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(uuid.New),
		field.Text("url"),
		field.Bool("healthy").Default(true),
		field.Bool("enabled").Default(true),
		field.JSON("features", struct {
			Name   string   `json:"name"`
			Values []string `json:"values,omitempty"`
		}{}),
		field.Time("last_health_check_at").Default(time.Now).Immutable(),
		field.Time("created_at").Default(time.Now).Immutable(),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
		field.Enum("user_tier").Values("FREE", "PRO").Default("FREE"),
	}
}

// Edges of the Server.
func (Server) Edges() []ent.Edge {
	return nil
}

// Annotations of the Server.
func (Server) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "server"},
	}
}
