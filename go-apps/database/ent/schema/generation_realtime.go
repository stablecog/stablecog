package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// GenerationRealtime holds the schema definition for the GenerationRealtime entity.
type GenerationRealtime struct {
	ent.Schema
}

// Fields of the GenerationRealtime.
func (GenerationRealtime) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(uuid.New),
		field.Text("country_code").Nillable(),
		field.Int("duration_ms").Nillable(),
		field.Enum("status").Values("started", "succeeded", "failed", "rejected").Nillable(),
		field.Bool("uses_default_server"),
		field.Int("width").Nillable(),
		field.Int("height").Nillable(),
		field.Int("num_interference_steps").Nillable(),
		field.Time("created_at").Default(time.Now).Immutable(),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
		field.Enum("user_tier").Values("FREE", "PRO").Default("FREE"),
	}
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
