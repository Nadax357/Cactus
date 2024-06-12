package main

import (
	"math/rand"
	"sync"
	"time"
)

type Metrics struct {
	CpuUsage       int `json:"cpu_usage"`
	MemoryUsage    int `json:"memory_usage"`
	CpuTemperature int `json:"cpu_temperature"`
}

var (
	metrics      Metrics
	metricsMutex sync.Mutex
)

func generateMetrics() {
	for {
		metricsMutex.Lock()
		metrics.CpuUsage = rand.Intn(100)
		metrics.MemoryUsage = rand.Intn(100)
		metrics.CpuTemperature = rand.Intn(100)
		metricsMutex.Unlock()
		time.Sleep(time.Second)
	}
}

func getMetrics() Metrics {
	metricsMutex.Lock()
	defer metricsMutex.Unlock()
	return metrics
}
