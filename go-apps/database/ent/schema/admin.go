package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
)

// Admin holds the schema definition for the Admin entity.
type Admin struct {
	ent.Schema
}

// Fields of the Admin.
func (Admin) Fields() []ent.Field {
	return nil
}

// Edges of the Admin.
func (Admin) Edges() []ent.Edge {
	return nil
}

// Annotations of the Admin.
func (Admin) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.Annotation{Table: "admin"},
	}
}
