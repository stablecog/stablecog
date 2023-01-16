package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
)

// Prompt holds the schema definition for the Prompt entity.
type Prompt struct {
	ent.Schema
}

// Fields of the Prompt.
func (Prompt) Fields() []ent.Field {
	return nil
}

// Edges of the Prompt.
func (Prompt) Edges() []ent.Edge {
	return nil
}

// Annotations of the Prompt.
func (Prompt) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "prompt"},
	}
}
