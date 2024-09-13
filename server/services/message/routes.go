package message

import (
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
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
	router.HandleFunc("/message", handler.handleGetMessage).Methods(http.MethodGet)
	router.HandleFunc("/message", handler.handleSendMessage).Methods(http.MethodPost)
}

func (handler *Handler) handleGetMessage(w http.ResponseWriter, r *http.Request) {
	ms, err := handler.store.GetMessages()
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
	utils.WriteJSON(w, http.StatusOK, ms)
}

func (h *Handler) handleSendMessage(w http.ResponseWriter, r *http.Request) {
	var payload types.MessagePayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("validation error: %v", errors))
		return
	}

	err := h.store.StoreMessage(types.Message{
		SenderId:       payload.SenderId,
		RecipientId:    payload.RecipientId,
		Content:        payload.Content,
		ConversationId: payload.ConversationId,
	})
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, nil)
}
