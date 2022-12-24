package shared

import (
	"encoding/base64"
	"strings"
)

func BufferFromB64(b64 string) ([]byte, error) {
	arr := strings.Split(b64, ";base64,")
	b64str := arr[len(arr)-1]
	buff, bErr := base64.StdEncoding.DecodeString(b64str)
	if bErr != nil {
		return nil, bErr
	}
	return buff, nil
}
