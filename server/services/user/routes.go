package user

import (
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"main/services/auth"
	"main/types"
	"main/utils"
	"net/http"
	"strings"
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
	router.HandleFunc("/user/update_password", h.handleUpdatePassword).Methods("PUT")
}

func (h *Handler) handleGetUsers(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	userID, err := auth.DecodeJWT(token)
	if err != nil {
		fmt.Println("Failed to decode token:", err)
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"), "Failed to decode token")
		return
	}

	searchQuery := r.URL.Query().Get("searchQuery")

	users, err := h.store.GetUsers(userID, searchQuery)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, err, "User not found")
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
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("user not found"), "User not found")
		return
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

func (h *Handler) handleGetUserData(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	userID, err := auth.DecodeJWT(token)
	if err != nil {
		fmt.Println("Failed to decode token:", err)
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"), "Failed to decode token")
		return
	}

	u, err := h.store.GetUserById(userID)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, err, "User not found")
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
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"), "Failed to decode token")
	}

	if err != nil {
		fmt.Println("Failed to decode token:", err)
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"), "Failed to decode token")
		return
	}

	var payload types.AvatarUploadPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err, "Failed to parse body")
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors), "Failed to validate payload")
		return
	}

	u, errors := h.store.GetUserById(userID)
	if errors != nil {
		utils.WriteError(w, http.StatusUnauthorized, errors, "User not found")
		return
	}

	_, err = h.store.UploadAvatar(u.ID, payload.AvatarPath)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err, "Failed to upload avatar")
		return
	}
	utils.WriteJSON(w, http.StatusOK, u.AvatarPath)
}

func (h *Handler) handleLogin(w http.ResponseWriter, r *http.Request) {
	var payload types.LoginUserPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err, "Failed to parse body")
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors), "Failed to validate payload")
		return
	}

	u, err := h.store.GetUserByUsername(strings.ToLower(payload.Username))
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("not found, invalid username or password"), "Invalid username or password")
		return
	}

	if !auth.ComparePasswords(u.Password, []byte(payload.Password)) {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid username or password"), "Invalid username or password")
		return
	}

	token, err := auth.CreateJWT(u.ID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err, "Failed to create token")
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
		utils.WriteError(w, http.StatusBadRequest, err, "Failed to parse body")
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("validation error: %v", errors), "Failed to validate payload")
		return
	}

	email := utils.ValidateEmail(payload.Email)
	if email != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("email not valid"), "Provide a valid email")
		return
	}

	_, err := h.store.GetUserByEmail(strings.ToLower(payload.Email))
	if err == nil {
		utils.WriteError(w, http.StatusConflict, fmt.Errorf("email already taken"), "Email already taken")
		return
	}

	_, err2 := h.store.GetUserByUsername(strings.ToLower(payload.Username))
	if err2 == nil {
		utils.WriteError(w, http.StatusConflict, fmt.Errorf("username already exists"), "Username already exists")
		return
	}

	hashedPassword, err := auth.HashPassword(payload.Password)

	err = h.store.CreateUser(types.User{
		Username: strings.ToLower(payload.Username),
		Password: hashedPassword,
		Email:    payload.Email,
	})
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err, "Failed to create user")
		return
	}
	utils.WriteJSON(w, http.StatusCreated, nil)
}

func (h *Handler) handleUpdatePassword(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	userID, err := auth.DecodeJWT(token)

	if _, err := auth.ValidateJWT(r.Header.Get("Authorization")); err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"), "Failed to validate token")
	}

	if err != nil {
		fmt.Println("Failed to decode token:", err)
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid token"), "Failed to decode token")
		return
	}

	var payload types.UpdatePasswordPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err, "Failed to parse body")
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors), "Failed to validate payload")
		return
	}

	u, err := h.store.GetUserById(userID)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("user not found"), "User not found")
		return
	}

	if !auth.ComparePasswords(u.Password, []byte(payload.OldPassword)) {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("current password does not match"), "Current password does not match")
		return
	}

	if auth.ComparePasswords(u.Password, []byte(payload.NewPassword)) {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("new password is the same as old password"), "New password is the same as old password")
		return
	}

	hashedPassword, err := auth.HashPassword(payload.NewPassword)

	err = h.store.UpdatePassword(userID, hashedPassword)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err, "Failed to update password")
	}
}
