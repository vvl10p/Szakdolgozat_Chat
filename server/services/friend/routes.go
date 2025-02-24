package friend

import (
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"main/services/auth"
	"main/types"
	"main/utils"
	"net/http"
)

type Handler struct {
	store types.FriendStore
}

func NewHandler(store types.FriendStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/friend/list_friends", h.GetFriendsForSidebar).Methods("GET")
	router.HandleFunc("/friend/get/", h.GetFriendsStatus).Methods("GET")
	router.HandleFunc("/friend/update", h.UpdateFriendStatus).Methods("PUT")
}

func (h *Handler) GetFriendsForSidebar(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	_, err := auth.ValidateJWT(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, err)
		return
	}

	userID, err := auth.DecodeJWT(token)
	if err != nil {
		fmt.Println("Failed to decode token:", err)
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"))
		return
	}

	users, err := h.store.GetFriendsForSidebar(userID)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, err)
		return
	}

	var res []types.UserFriendStatus
	for _, user := range users {
		basicInfo := types.UserFriendStatus{
			UserID:     user.UserID,
			Username:   user.Username,
			AvatarPath: user.AvatarPath,
			Status:     user.Status,
			FriendID:   user.FriendID,
			ChatID:     user.ChatID,
		}
		res = append(res, basicInfo)
	}

	if len(res) == 0 {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("user not found"))
		return
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

func (h *Handler) GetFriendsStatus(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	_, err := auth.ValidateJWT(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, err)
		return
	}

	userID, err := auth.DecodeJWT(token)
	if err != nil {
		fmt.Println("Failed to decode token:", err)
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"))
		return
	}

	searchQuery := r.URL.Query().Get("searchQuery")
	users, err := h.store.GetUsersWithStatus(userID, searchQuery)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, err)
		return
	}

	var res []types.UserFriendStatus
	for _, user := range users {
		basicInfo := types.UserFriendStatus{
			UserID:     user.UserID,
			Username:   user.Username,
			AvatarPath: user.AvatarPath,
			Status:     user.Status,
			FriendID:   user.FriendID,
		}
		res = append(res, basicInfo)
	}

	if len(res) == 0 {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("user not found"))
		return
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

func (h *Handler) UpdateFriendStatus(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	_, err := auth.ValidateJWT(token)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, err)
		return
	}

	userID, err := auth.DecodeJWT(token)
	if err != nil {
		fmt.Println("Failed to decode token:", err)
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"))
		return
	}

	var payload types.FriendPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("validation error: %v", errors))
		return
	}

	err = h.store.UpdateFriendStatus(userID, payload.FriendID, payload.Status)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
	}
	utils.WriteJSON(w, http.StatusOK, "sikeres request")
}
