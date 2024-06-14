package main

import (
	"database/sql"
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"

	_ "github.com/mattn/go-sqlite3"

	"fmt"
	"log"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

const (
	host = "localhost"
	port = 5432
)

type Handler struct {
}

func newHandler() *Handler {
	return &Handler{}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/login", h.handleLogin).Methods("POST")
	router.HandleFunc("/register", h.handleRegister).Methods("POST")
}

func (h *Handler) handleLogin(w http.ResponseWriter, r *http.Request) {

}

func (h *Handler) handleRegister(w http.ResponseWriter, r *http.Request) {
	var payload User
	err := json.NewEncoder(r.Body).Encode(payload)
}

type User struct {
	name     string `json:"username"`
	password string `json:"password"`
}

func createUser(db *sql.DB, w *http.Request, r *http.Response) {

	stmt, err := db.Prepare("INSERT INTO users(username, password) values(?,?)")
	if err != nil {
		panic(err)
	}
	stmt.Exec()
}

func main() {
	db, err := sql.Open("sqlite3", "file::memory:?cache=shared")
	if err != nil {
		fmt.Println(err, nil)
	}
	defer db.Close()

	sqlCreate := `CREATE TABLE users(
    		id INTEGER PRIMARY KEY AUTOINCREMENT,
    		username TEXT NOT NULL,
    		password TEXT NOT NULL
	);`

	_, err = db.Exec(sqlCreate)
	rows, err := db.Query("SELECT * FROM users")
	if err != nil {
		log.Fatal(err)
	} else {
		defer rows.Close()
	}

	for rows.Next() {
		var id int
		var username string
		var password string

		err = rows.Scan(&id, &username, &password)

		if err != nil {
			log.Fatal(err)
		} else {
			fmt.Printf("User ID: %d\nUsername: %s\nPassword: %s\n", id, username, password)
		}
	}
}
