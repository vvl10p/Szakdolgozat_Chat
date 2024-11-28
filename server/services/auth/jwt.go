package auth

import (
	"fmt"
	"github.com/golang-jwt/jwt/v4"
	"strconv"
	"strings"
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

func ValidateJWT(jwtString string) (jwt.Claims, error) {
	const bearerPrefix = "Bearer "
	if strings.HasPrefix(jwtString, bearerPrefix) {
		jwtString = strings.TrimPrefix(jwtString, bearerPrefix)
	} else {
		return nil, fmt.Errorf("authorization header format must be 'Bearer <token>'")
	}

	token, err := jwt.Parse(jwtString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	return token.Claims, nil
}

func DecodeJWT(jwtString string) (int, error) {
	const bearerPrefix = "Bearer "
	if strings.HasPrefix(jwtString, bearerPrefix) {
		jwtString = strings.TrimPrefix(jwtString, bearerPrefix)
	} else {
		return 0, fmt.Errorf("authorization header format must be 'Bearer <token>'")
	}

	token, err := jwt.ParseWithClaims(jwtString, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		return 0, err
	}

	claims, ok := token.Claims.(*jwt.MapClaims)
	if !ok || !token.Valid {
		return 0, err
	}

	result, err := strconv.Atoi((*claims)["id"].(string))
	if err != nil {
		return 0, err
	}

	return result, nil
}
