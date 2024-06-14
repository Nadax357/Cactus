package metric

import (
	"database/sql"
	"fmt"
	"time"
)

type Reading struct {
	ID           int64
	Value        int
	MetricTypeId int64
	Timestamp    time.Time
}

func Create(db *sql.DB, reading Reading) (Reading, error) {
	// TODO: check input parameters not pass the size that can be saved
	query := "INSERT INTO `reading` (`value`, `metricTypeId`, `timestamp`) VALUES (?, ?, ?)"
	insertResult, err := db.Exec(query)
	if err != nil {
		return reading, fmt.Errorf("error while inserting to database: %w", err)
	}
	id, err := insertResult.LastInsertId()
	if err != nil {
		return reading, fmt.Errorf("error while getting last id inserted: %w", err)
	}
	reading.ID = id
	return reading, nil
}
