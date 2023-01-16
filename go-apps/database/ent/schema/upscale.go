package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
)

// Upscale holds the schema definition for the Upscale entity.
type Upscale struct {
	ent.Schema
}

// Fields of the Upscale.
func (Upscale) Fields() []ent.Field {
	return nil
}

// Edges of the Upscale.
func (Upscale) Edges() []ent.Edge {
	return nil
}

// Annotations of the Upscale.
func (Upscale) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "upscale"},
	}
}
