package models

type Feature struct {
	Name   string   `json:"name"`
	Values []string `json:"values,omitempty"`
}
