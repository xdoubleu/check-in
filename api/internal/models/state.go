package models

type State struct {
	IsMaintenance       bool `json:"isMaintenance"`
	IsDatabaseActive    bool `json:"isDatabaseActive"`
	IsMemoryProfEnabled bool `json:"isMemoryProfEnabled"`
} //	@name	State

type StateKey string

const (
	IsMaintenanceKey       StateKey = "IsMaintenance"
	IsMemoryProfEnabledKey StateKey = "IsMemoryProfEnabled"
)
