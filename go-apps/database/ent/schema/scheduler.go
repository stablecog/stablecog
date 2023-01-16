package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
)

// Scheduler holds the schema definition for the Scheduler entity.
type Scheduler struct {
	ent.Schema
}

// Fields of the Scheduler.
func (Scheduler) Fields() []ent.Field {
	return nil
}

// Edges of the Scheduler.
func (Scheduler) Edges() []ent.Edge {
	return nil
}

// Annotations of the Upscale.
func (Scheduler) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "scheduler"},
	}
}
