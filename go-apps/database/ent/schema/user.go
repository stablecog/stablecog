package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).Default(uuid.New),
		field.Text("email"),
		field.Text("stripe_customer_id").Nillable(),
		field.Enum("subscription_tier").Values("FREE", "PRO").Default("FREE"),
		field.Enum("subscription_category").Values("GIFTED", "FRIEND_BOUGHT").Nillable(),
		field.Time("created_at").Default(time.Now).Immutable(),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
		field.Time("confirmed_at").Nillable(),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		// O2M with upscale
		edge.To("upscale", Upscale.Type).
			Annotations(entsql.Annotation{
				OnDelete: entsql.Cascade,
			}),
		// O2M with generation
		edge.To("generation", Generation.Type).
			Annotations(entsql.Annotation{
				OnDelete: entsql.Cascade,
			}),
		// O2M with generation_g
		edge.To("generation_g", GenerationG.Type).
			Annotations(entsql.Annotation{
				OnDelete: entsql.Cascade,
			}),
		// // O2O with admin
		// edge.To("admin", Admin.Type).
		// 	Annotations(entsql.Annotation{
		// 		OnDelete: entsql.Cascade,
		// 	}).Unique(),
	}
}

// Annotations of the User.
func (User) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "user"},
	}
}
