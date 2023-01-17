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

// GenerationG holds the schema definition for the Generation_G entity.
type GenerationG struct {
	ent.Schema
}

// Fields of the GenerationG.
func (GenerationG) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(uuid.New),
		field.UUID("prompt_id", uuid.UUID{}),
		field.UUID("negative_prompt_id", uuid.UUID{}).Nillable(),
		field.UUID("model_id", uuid.UUID{}),
		field.Text("image_id"),
		field.Int("width"),
		field.Int("height"),
		field.Int("seed").
			Optional().
			GoType(enttypes.BigInt{}).SchemaType(map[string]string{
			dialect.Postgres: "bigint",
		}).Nillable(),
		field.Int("num_inference_steps").Nillable(),
		field.Float("guidance_scale"),
		field.Bool("hidden").Default(true),
		field.UUID("scheduler_id", uuid.UUID{}),
		field.UUID("user_id", uuid.UUID{}).Nillable(),
		field.Enum("user_tier").Values("FREE", "PRO").Default("FREE"),
		field.Time("created_at").Default(time.Now).Immutable(),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

// Edges of the GenerationG.
func (GenerationG) Edges() []ent.Edge {
	return []ent.Edge{
		// M2O with users
		edge.From("user", User.Type).
			Ref("generation_g").
			Field("user_id").
			Required().
			Unique(),
		// M2O with model
		edge.From("model", Model.Type).
			Ref("generation_g").
			Field("model_id").
			Required().
			Unique(),
		// M2O with prompt
		edge.From("prompt", Prompt.Type).
			Ref("generation_g").
			Field("prompt_id").
			Required().
			Unique(),
		// M2O with negative_prompt
		edge.From("negative_prompt", NegativePrompt.Type).
			Ref("generation_g").
			Field("negative_prompt_id").
			Required().
			Unique(),
		// M2O with scheduler
		edge.From("scheduler", Scheduler.Type).
			Ref("generation_g").
			Field("scheduler_id").
			Required().
			Unique(),
	}
}

// Annotations of the GenerationG.
func (GenerationG) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "generation_g"},
	}
}
