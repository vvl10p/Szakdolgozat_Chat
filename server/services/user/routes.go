package user

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
	store types.UserStore
}

func NewHandler(store types.UserStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/login", h.handleLogin).Methods("POST")
	router.HandleFunc("/register", h.handleRegister).Methods("POST")
	router.HandleFunc("/avatar_upload", h.handleAvatarUpload).Methods("POST")
	router.HandleFunc("/user/data", h.handleGetUserData).Methods("GET")
	router.HandleFunc("/user/get/", h.handleGetUsers).Methods("GET")
}

func (h *Handler) handleGetUsers(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	userID, err := auth.DecodeJWT(token)
	if err != nil {
		fmt.Println("Failed to decode token:", err)
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"))
		return
	}

	searchQuery := r.URL.Query().Get("searchQuery")

	users, err := h.store.GetUsers(userID, searchQuery)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, err)
		return
	}

	var res []types.UserBasicInfo
	for _, user := range users {
		basicInfo := types.UserBasicInfo{
			UserID:     user.UserID,
			Username:   user.Username,
			AvatarPath: user.AvatarPath,
		}
		res = append(res, basicInfo)
	}

	if len(res) == 0 {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("user not found"))
		return
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

func (h *Handler) handleGetUserData(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	userID, err := auth.DecodeJWT(token)
	if err != nil {
		fmt.Println("Failed to decode token:", err)
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"))
		return
	}

	u, err := h.store.GetUserById(userID)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, err)
		return
	}

	res := types.GetUserDataPayload{
		Username:   u.Username,
		AvatarPath: u.AvatarPath,
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

func (h *Handler) handleAvatarUpload(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	userID, err := auth.DecodeJWT(token)

	if _, err := auth.ValidateJWT(r.Header.Get("Authorization")); err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"))
	}

	if err != nil {
		fmt.Println("Failed to decode token:", err)
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"))
		return
	}

	var payload types.AvatarUploadPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	u, errors := h.store.GetUserById(userID)
	if errors != nil {
		utils.WriteError(w, http.StatusUnauthorized, errors)
		return
	}

	err = h.store.UploadAvatar(u.ID, payload.AvatarPath)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
	utils.WriteJSON(w, http.StatusOK, u.AvatarPath)
}

func (h *Handler) handleLogin(w http.ResponseWriter, r *http.Request) {
	var payload types.LoginUserPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	u, err := h.store.GetUserByUsername(payload.Username)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("not found, invalid username or password"))
		return
	}

	if !auth.ComparePasswords(u.Password, []byte(payload.Password)) {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid username or password"))
		return
	}

	token, err := auth.CreateJWT(u.ID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
	utils.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"token": token,
		"user": map[string]interface{}{
			"id":         u.ID,
			"username":   u.Username,
			"avatarPath": u.AvatarPath,
		},
	})
}

func (h *Handler) handleRegister(w http.ResponseWriter, r *http.Request) {
	var payload types.RegisterUserPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("validation error: %v", errors))
		return
	}

	_, err := h.store.GetUserByUsername(payload.Username)
	if err == nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("username already exists"))
		return
	}

	hashedPassword, err := auth.HashPassword(payload.Password)

	err = h.store.CreateUser(types.User{
		Username: payload.Username,
		Password: hashedPassword,
		Email:    payload.Email,
	})
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, nil)
}
