package types

import (
	"time"
)

type UserStore interface {
	GetUserByUsername(username string) (*User, error)
	GetUserById(userId int) (*User, error)
	CreateUser(User) error
	UploadAvatar(userId int, avatarString string) error
	GetUserData(userId int) (username string, avatarPath string, err error)
	GetUsers(userId int, searchQuery string) ([]UserBasicInfo, error)
}

type MessageStore interface {
	GetMessages() ([]Message, error)
	StoreMessage(Message) error
}

type FriendStore interface {
	GetUsersWithStatus(userId int, searchQuery string) ([]UserFriendStatus, error)
	UpdateFriendStatus(userId int, friendId int, status string) error
	GetFriendsForSidebar(userId int) ([]UserFriendStatus, error)
}

type Message struct {
	ID             int       `json:"id"`
	SenderId       int       `json:"sender_id"`
	RecipientId    int       `json:"recipient_id"`
	Content        string    `json:"content"`
	CreatedAt      time.Time `json:"created_at"`
	ConversationId int       `json:"conversation_id"`
}

type MessagePayload struct {
	SenderId       int    `json:"sender_id"`
	RecipientId    int    `json:"recipient_id"`
	Content        string `json:"content"`
	ConversationId int    `json:"conversation_id"`
}

type User struct {
	ID         int       `json:"id"`
	Username   string    `json:"username"`
	Password   string    `json:"password"`
	Email      string    `json:"email"`
	AvatarPath string    `json:"avatarPath"`
	CreatedAt  time.Time `json:"createdAt"`
}

type RegisterUserPayload struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required,min=8,max=80"`
	Email    string `json:"email" validate:"required,email"`
}

type LoginUserPayload struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type AvatarUploadPayload struct {
	AvatarPath string `json:"avatarPath"`
}

type GetUserDataPayload struct {
	Username   string `json:"username"`
	AvatarPath string `json:"avatarPath"`
}

type UserBasicInfo struct {
	UserID     int    `json:"id"`
	Username   string `json:"username"`
	AvatarPath string `json:"avatarPath"`
}

type UserFriendStatus struct {
	UserID     int    `json:"id"`
	Username   string `json:"username"`
	AvatarPath string `json:"avatarPath"`
	Status     string `json:"status"`
	FriendId   string `json:"friendId"`
}

type FriendPayload struct {
	FriendId int    `json:"friendId"`
	Status   string `json:"status"`
}

type Friend struct {
	UserId   int    `json:"id"`
	FriendId int    `json:"friendId"`
	Status   string `json:"status"`
}
