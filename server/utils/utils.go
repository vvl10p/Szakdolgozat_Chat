package utils

import (
	"encoding/json"
	"fmt"
	"github.com/go-playground/validator/v10"
	"net/http"
)

var Validate = validator.New()

func ParseJSON(r *http.Request, payload any) error {
	if r.Body == nil {
		return fmt.Errorf("no body")
	}
	err := json.NewDecoder(r.Body).Decode(payload)
	if err != nil {
		return err
	}
	return nil
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

func WriteError(w http.ResponseWriter, status int, err error) {
	err = WriteJSON(w, status, map[string]string{"error": err.Error()})
	if err != nil {
		return
	}
}
