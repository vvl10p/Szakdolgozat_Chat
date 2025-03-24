package api

import (
	"database/sql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"main/services/chat"
	"main/services/friend"
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
	corsOptions := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	router := mux.NewRouter()

	userStore := user.NewStore(s.db)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(router)

	friendStore := friend.NewStore(s.db)
	friendHandler := friend.NewHandler(friendStore)
	friendHandler.RegisterRoutes(router)

	messageStore := message.NewStore(s.db)
	messageHandler := message.NewHandler(messageStore)
	messageHandler.RegisterRoutes(router)

	chatStore := chat.NewStore(s.db)
	chatHandler := chat.NewHandler(chatStore)
	chatHandler.RegisterRoutes(router)

	handler := corsOptions.Handler(router)

	return http.ListenAndServeTLS(s.address, "cert.pem", "key.pem", handler)
}
