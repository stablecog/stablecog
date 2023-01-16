package generate

import (
	"strings"
)

const pngStart = "data:image/png;base64,"
const jpgStart = "data:image/jpeg;base64,"
const minLen = 200

var blackStringPng = strings.Repeat("A", 200)
var blackStringJpg = strings.Repeat("iiigAooooAKKKKAC", 30)

func IsNSFW(s string) bool {
	if s == "" {
		return false
	}
	return len(s) < minLen || (strings.HasPrefix(s, jpgStart) && strings.Contains(s, blackStringJpg)) ||
		(strings.HasPrefix(s, pngStart) && strings.Contains(s, blackStringPng))
}
