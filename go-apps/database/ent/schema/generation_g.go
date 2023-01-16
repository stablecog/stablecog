package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
)

// GenerationG holds the schema definition for the Generation_G entity.
type GenerationG struct {
	ent.Schema
}

// Fields of the GenerationG.
func (GenerationG) Fields() []ent.Field {
	return nil
}

// Edges of the GenerationG.
func (GenerationG) Edges() []ent.Edge {
	return nil
}

// Annotations of the GenerationG.
func (GenerationG) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "generation_g"},
	}
}
