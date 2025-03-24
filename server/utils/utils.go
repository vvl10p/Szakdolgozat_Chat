package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
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

func WriteError(w http.ResponseWriter, status int, err error, errormsg string) {
	err = WriteJSON(w, status, map[string]string{"error": err.Error(), "message": errormsg})
	if err != nil {
		return
	}
}

func EncryptMessage(plainMessage string) (string, error) {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	messageKey := os.Getenv("MESSAGE_KEY")

	key := []byte(messageKey)
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, 12)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	ciphertext := aesgcm.Seal(nil, nonce, []byte(plainMessage), nil)
	ciphertext = append(nonce, ciphertext...)

	return hex.EncodeToString(ciphertext), nil
}

func DecryptMessage(encryptedMessage string) (string, error) {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	messageKey := os.Getenv("MESSAGE_KEY")
	
	key := []byte(messageKey)

	if len(encryptedMessage) < 24 {
		return "", fmt.Errorf("encrypted message is too short")
	}

	cipherText, err := hex.DecodeString(encryptedMessage[24:])
	if err != nil {
		return "", fmt.Errorf("failed to decode ciphertext: %v", err)
	}

	nonce, err := hex.DecodeString(encryptedMessage[0:24])
	if len(nonce) != 12 {
		return "", fmt.Errorf("incorrect nonce length, expected 12 bytes, got %d", len(nonce))
	}
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("failed to create GCM: %v", err)
	}

	plaintext, err := aesgcm.Open(nil, nonce, cipherText, nil)
	if err != nil {
		return "", fmt.Errorf("decryption failed: %v", err)
	}

	return string(plaintext), nil
}

func ValidateEmail(email string) error {
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return errors.New("invalid email")
	}
	_, err := net.LookupMX(parts[1])
	if err != nil {
		return err
	}
	return nil
}
