package message

import (
	"errors"
	"github.com/gorilla/mux"
	"main/services/auth"
	"main/types"
	"main/utils"
	"net/http"
)

type Handler struct {
	store types.MessageStore
}

func NewHandler(store types.MessageStore) *Handler {
	return &Handler{store: store}
}

func (handler *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/getMessage/{id}", handler.handleGetMessage).Methods(http.MethodGet)
	router.HandleFunc("/deleteMessage/{id}", handler.handleDeleteMessage).Methods(http.MethodDelete)
}

func (handler *Handler) handleGetMessage(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	_, err := auth.ValidateJWT(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, err)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		utils.WriteError(w, http.StatusBadRequest, errors.New("missing id parameter"))
		return
	}

	ms, err := handler.store.GetMessages(id)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
	err = utils.WriteJSON(w, http.StatusOK, ms)
	if err != nil {
		return
	}
}

func (handler *Handler) handleDeleteMessage(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	_, err := auth.ValidateJWT(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, err)
		return
	}

	msgid := r.URL.Query().Get("msgid")
	err = handler.store.DeleteMessages(msgid)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
	}
	err = utils.WriteJSON(w, http.StatusOK, nil)
	if err != nil {
		return
	}
}
