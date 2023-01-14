package shared

import (
	"sync"
)

// For storing active channels created within APIs that need to be accesed in other goroutines
var RequestSyncMap *SyncMap

// SyncMap builds an thread-safe map
type SyncMap struct {
	mu   sync.Mutex
	sMap map[string]chan WebhookRequest
}

func InitSyncMap() {
	RequestSyncMap = &SyncMap{
		sMap: make(map[string]chan WebhookRequest),
	}
}

// See if element exists
func (r *SyncMap) Exists(requestID string) bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	_, ok := r.sMap[requestID]
	return ok
}

// Put value into map - synchronized
func (r *SyncMap) Put(requestID string, value chan WebhookRequest) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.sMap[requestID] = value
}

// Gets a value from the map - synchronized
func (r *SyncMap) Get(requestID string) chan WebhookRequest {
	r.mu.Lock()
	defer r.mu.Unlock()
	s, ok := r.sMap[requestID]
	if ok {
		return s
	}
	return nil
}

// Removes specified hash - synchronized
func (r *SyncMap) Delete(requestID string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.sMap, requestID)
}
