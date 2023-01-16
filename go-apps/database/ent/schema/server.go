package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
)

// Server holds the schema definition for the Server entity.
type Server struct {
	ent.Schema
}

// Fields of the Server.
func (Server) Fields() []ent.Field {
	return nil
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
