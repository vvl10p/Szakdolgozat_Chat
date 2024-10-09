package auth

import (
	"github.com/golang-jwt/jwt/v4"
	"strconv"
	"time"
)

const secret = "supersecret"

func CreateJWT(UserID int) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":        strconv.Itoa(UserID),
		"ExpiresAt": time.Now().Add(3600 * 24 * 7).Unix(),
	})
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ValidateJWT(jwtString string) (*jwt.Claims, error) {
	token, err := jwt.Parse(jwtString, func(token *jwt.Token) (interface {},error)) {
		if _,ok := token.Method.(*jwt.SigningMethodHS256); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"]")
		}
		return []byte(secret), nil
	}

	if err !=nil || !token.Valid {
		return nil, err
	}

	return token.Claims, nil
}
