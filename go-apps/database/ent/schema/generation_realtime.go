package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
)

// GenerationRealtime holds the schema definition for the GenerationRealtime entity.
type GenerationRealtime struct {
	ent.Schema
}

// Fields of the GenerationRealtime.
func (GenerationRealtime) Fields() []ent.Field {
	return nil
}

// Edges of the GenerationRealtime.
func (GenerationRealtime) Edges() []ent.Edge {
	return nil
}

// Annotations of the GenerationRealtime.
func (GenerationRealtime) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "generation_realtime"},
	}
}
