// main.go
package main

import (
	"cactus/internal/metric"
	"cactus/internal/mysql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func main() {
	db, err := mysql.NewMysqlConnection(mysql.MysqlConfig{
		Username: "user",
		Password: "password",
		DbName:   "db",
		Port:     3306,
		Host:     "localhost",
	})
	if err != nil {
		log.Fatalf("error on creating connection with database: #{err}")
	}

	metric.InitMetricTypes(db)

	go metric.GenerateMetrics()

	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/metrics", metricsHandler)
	http.ListenAndServe(":8080", nil)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, World! This is the index")
}

func metricsHandler(w http.ResponseWriter, r *http.Request) {
	metrics := metric.GetMetrics()
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(metrics); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
