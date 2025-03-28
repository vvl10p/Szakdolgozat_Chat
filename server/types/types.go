package types

import (
	"time"
)

type ChatStore interface {
	SaveMessage(message MessageFromWS) (*Message, error)
	GetConversations(userID string) ([]string, error)
}

type UserStore interface {
	GetUserByUsername(username string) (*User, error)
	GetUserById(userID int) (*User, error)
	CreateUser(User) error
	UploadAvatar(userID int, avatarString string) (avatarPath string, err error)
	GetUserData(userID int) (username string, avatarPath string, err error)
	GetUsers(userID int, searchQuery string) ([]UserBasicInfo, error)
	UpdatePassword(userID int, password string) error
	GetUserByEmail(email string) (*User, error)
}

type MessageStore interface {
	GetMessages(ChatID string) ([]Message, error)
	DeleteMessages(ChatID string) error
	UpdateSeen(ChatID string, userID int) error
}

type FriendStore interface {
	GetUsersWithStatus(userID int, searchQuery string) ([]UserFriendStatus, error)
	UpdateFriendStatus(userID int, friendId int, status string) error
	GetFriendsForSidebar(userID int) ([]UserFriendStatus, error)
}

type MessageFromWS struct {
	Event   string `json:"Event"`
	ChatID  string `json:"ChatID"`
	Sender  string `json:"Sender"`
	Content string `json:"Content"`
	File    []byte `json:"File"`
}

type Message struct {
	ID             int       `json:"MsgID"`
	SenderID       int       `json:"Sender"`
	Content        string    `json:"Content"`
	Timestamp      time.Time `json:"Timestamp"`
	ConversationID int       `json:"ConversationID"`
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
	FriendID   string `json:"friendId"`
	ChatID     string `json:"chatId"`
}

type FriendPayload struct {
	FriendID int    `json:"friendId"`
	Status   string `json:"status"`
}

type Friend struct {
	UserID   int    `json:"id"`
	FriendID int    `json:"friendId"`
	Status   string `json:"status"`
}

type UpdatePasswordPayload struct {
	OldPassword string `json:"oldPassword" validate:"required,min=8,max=80"`
	NewPassword string `json:"newPassword" validate:"required,min=8,max=80"`
}
