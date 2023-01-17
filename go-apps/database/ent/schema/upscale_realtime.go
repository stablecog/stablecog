package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// UpscaleRealtime holds the schema definition for the UpscaleRealtime entity.
type UpscaleRealtime struct {
	ent.Schema
}

// Fields of the UpscaleRealtime.
func (UpscaleRealtime) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(uuid.New),
		field.Enum("status").Values("started", "succeeded", "failed"),
		field.Text("country_code").Nillable(),
		field.Bool("uses_default_server"),
		field.Int("width").Nillable(),
		field.Int("height").Nillable(),
		field.Int("scale").Nillable(),
		field.Time("created_at").Default(time.Now).Immutable(),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
		field.Enum("user_tier").Values("FREE", "PRO").Default("FREE"),
	}
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
