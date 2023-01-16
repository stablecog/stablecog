package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
)

// NegativePrompt holds the schema definition for the NegativePrompt entity.
type NegativePrompt struct {
	ent.Schema
}

// Fields of the NegativePrompt.
func (NegativePrompt) Fields() []ent.Field {
	return nil
}

// Edges of the NegativePrompt.
func (NegativePrompt) Edges() []ent.Edge {
	return nil
}

// Annotations of the NegativePrompt.
func (NegativePrompt) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "negative_prompt"},
	}
}
