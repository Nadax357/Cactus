package mysql

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type MysqlConnection struct {
	db *sql.DB
}

type MysqlConfig struct {
	Username string
	Password string
	DbName   string
	Port     uint
	Host     string
}

func NewMysqlConnection(conf MysqlConfig) (*sql.DB, error) {
	dataSourceName := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s", conf.Username, conf.Password, conf.Host, conf.Port, conf.DbName)
	db, err := sql.Open("mysql", dataSourceName)
	if err != nil {
		return nil, fmt.Errorf("error opening SQL connection: %w", err)
	}
	return db, nil
}
