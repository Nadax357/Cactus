// main.go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	go generateMetrics()

	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/metrics", metricsHandler)
	http.ListenAndServe(":8080", nil)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, World! This is the index")
}

func metricsHandler(w http.ResponseWriter, r *http.Request) {
	metrics := getMetrics()
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(metrics); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
