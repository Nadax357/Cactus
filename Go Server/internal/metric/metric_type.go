package metric

import (
	"database/sql"
	"fmt"
)

type MetricType struct {
	ID   int64
	Name string
	Unit string
}

var metricTypes = []MetricType{
	{
		Name: "CPU Usage",
		Unit: "%",
	},
	{
		Name: "Memory Usage",
		Unit: "%",
	},
	{
		Name: "CPU Temperature",
		Unit: "C°",
	},
}

func InitMetricTypes(conn *sql.DB) error {
	for i := 0; i < len(metricTypes); i++ {
		err := create(conn, &metricTypes[i])
		if err != nil {
			return fmt.Errorf("error while inserting a metric type: %w", err)
		}
	}
	fmt.Printf("%v", metricTypes)
	return nil
}

func create(db *sql.DB, metricType *MetricType) error {
	// TODO: check input parameters not pass the size that can be saved
	query := "INSERT INTO `metricType` (`name`, `unit`) VALUES (?, ?)"
	insertResult, err := db.Exec(query, metricType.Name, metricType.Unit)
	if err != nil {
		return fmt.Errorf("error while inserting to database: %w", err)
	}
	id, err := insertResult.LastInsertId()
	if err != nil {
		return fmt.Errorf("error while getting last id inserted: %w", err)
	}
	metricType.ID = id
	return nil
}
