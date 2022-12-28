package shared

import (
	"math/rand"
	"time"
)

func RandomWaitMs(maxMs int) int {
	rand.Seed(time.Now().UnixNano())
	ms := rand.Intn(maxMs)
	ns := ms * 1000000
	dur := time.Duration(ns)
	time.Sleep(dur)
	return ms
}
