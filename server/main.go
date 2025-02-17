package main

import (
	"database/sql"
	"fmt"
	"main/api"
	db2 "main/db"
)

func main() {
	db, err := db2.NewSqliteDB("server.db")
	if err != nil {
		panic(err)
	}

	defer db.Close()
	initStorage(db)

	server := api.NewAPIServer(":5174", db)
	if err := server.Run(); err != nil {
		panic(err)
	}
}

func initStorage(db *sql.DB) {
	err := db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected to database")
}
