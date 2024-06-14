package auth

import (
	"github.com/golang-jwt/jwt/v4"
	"strconv"
	"time"
)

func CreateJWT(secret []byte, UserID int) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":        strconv.Itoa(UserID),
		"ExpiresAt": time.Now().Add(3600 * 24 * 7).Unix(),
	})
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
