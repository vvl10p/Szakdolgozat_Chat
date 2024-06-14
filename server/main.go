package main

import (
	"database/sql"
	"log"
	"main/api"
	db2 "main/db"
	"main/services/chat"
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

	log.Println("Successfully connected to database")
}

func initWebsocket() {
	chat.NewServer()
}
