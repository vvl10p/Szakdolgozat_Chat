package api

import (
	"database/sql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"main/services/message"
	"main/services/user"
	"net/http"
)

type APIServer struct {
	address string
	db      *sql.DB
}

func NewAPIServer(address string, db *sql.DB) *APIServer {
	return &APIServer{
		address: address,
		db:      db,
	}
}
func (s *APIServer) Run() error {
	cors.Default()
	router := mux.NewRouter()

	userStore := user.NewStore(s.db)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(router)

	messageStore := message.NewStore(s.db)
	messageHandler := message.NewHandler(messageStore)
	messageHandler.RegisterRoutes(router)

	handler := cors.Default().Handler(router)

	return http.ListenAndServe(s.address, handler)
}
