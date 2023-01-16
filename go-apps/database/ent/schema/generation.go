package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
)

// Generation holds the schema definition for the Generation entity.
type Generation struct {
	ent.Schema
}

// Fields of the Generation.
func (Generation) Fields() []ent.Field {
	return nil
}

// Edges of the Generation.
func (Generation) Edges() []ent.Edge {
	return nil
}

// Annotations of the Generation.
func (Generation) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "generation"},
	}
}
