package utils

import (
	"path"
	"path/filepath"
	"runtime"
)

var RuntimeCaller = runtime.Caller

// Returns the root directory of the project
func RootDir() string {
	_, b, _, _ := RuntimeCaller(0)
	d := path.Join(path.Dir(b))
	return filepath.Dir(d)
}
