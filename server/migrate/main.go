package main

import (
	"github.com/golang-migrate/migrate/v4"

	_ "github.com/mattn/go-sqlite3"

	_ "github.com/golang-migrate/migrate/v4/source/file"

	"os"

	db2 "main/db"
)

func main() {
	db, err := db2.NewSqliteDB("server.db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	driver, err := db2.WithInstance(db, &db2.Config{})
	if err != nil {
		panic(err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://migrate/migrations",
		"sqlite3",
		driver,
	)
	if err != nil {
		panic(err)
	}

	cmd := os.Args[(len(os.Args) - 1)]
	if cmd == "up" {
		if err := m.Up(); err != nil && err != migrate.ErrNoChange {
			panic(err)
		}
	}
	if cmd == "down" {
		if err := m.Down(); err != nil && err != migrate.ErrNoChange {
			panic(err)
		}
	}
}
