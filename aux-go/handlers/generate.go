package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/yekta/stablecog/aux-go/shared"
)

func Generate(c *fiber.Ctx) error {
	internalServerErrResp := shared.SInternalServerErrorResponse{
		Error: "Internal server error",
	}
	return c.Status(http.StatusInternalServerError).JSON(internalServerErrResp)
}
