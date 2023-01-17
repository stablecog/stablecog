package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	"github.com/yekta/stablecog/go-apps/database/enttypes"
)

// Upscale holds the schema definition for the Upscale entity.
type Upscale struct {
	ent.Schema
}

// Fields of the Upscale.
func (Upscale) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(uuid.New),
		field.Int("width"),
		field.Int("height"),
		field.Int("scale"),
		field.Enum("status").Values("started", "succeeded", "failed"),
		field.Text("server_url"),
		field.Int("duration_msg").Nillable(),
		field.Text("type").Nillable(),
		field.Text("prompt").Nillable(),
		field.Text("negative_prompt").Nillable(),
		field.Int("seed").
			Optional().
			GoType(enttypes.BigInt{}).SchemaType(map[string]string{
			dialect.Postgres: "bigint",
		}).Nillable(),
		field.Int("num_inference_steps").Nillable(),
		field.Float("guidance_scale").Nillable(),
		field.Text("country_code").Nillable(),
		field.Text("device_type").Nillable(),
		field.Text("device_os").Nillable(),
		field.Text("device_browser").Nillable(),
		field.Text("user_agent").Nillable(),
		field.Time("created_at").Default(time.Now).Immutable(),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
		field.UUID("user_id", uuid.UUID{}).Nillable(),
		field.Enum("user_tier").Values("FREE", "PRO").Default("FREE"),
	}
}

// Edges of the Upscale.
func (Upscale) Edges() []ent.Edge {
	return []ent.Edge{
		// M2O with users
		edge.From("user", User.Type).
			Ref("upscale").
			Field("user_id").
			Required().
			Unique(),
	}
}

// Annotations of the Upscale.
func (Upscale) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "upscale"},
	}
}
