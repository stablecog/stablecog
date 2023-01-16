package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
)

// UpscaleRealtime holds the schema definition for the UpscaleRealtime entity.
type UpscaleRealtime struct {
	ent.Schema
}

// Fields of the UpscaleRealtime.
func (UpscaleRealtime) Fields() []ent.Field {
	return nil
}

// Edges of the UpscaleRealtime.
func (UpscaleRealtime) Edges() []ent.Edge {
	return nil
}

// Annotations of the UpscaleRealtime.
func (UpscaleRealtime) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "upscale_realtime"},
	}
}
