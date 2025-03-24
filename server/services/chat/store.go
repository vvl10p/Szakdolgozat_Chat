package chat

import (
	"database/sql"
	"errors"
	"fmt"
	"main/types"
	"main/utils"
	"strconv"
	"time"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (store *Store) SaveMessage(message types.MessageFromWS) (*types.Message, error) {
	encryptedMessage, err := utils.EncryptMessage(message.Content)
	if err != nil {
		return nil, err
	}

	if len(encryptedMessage) == 0 {
		return nil, errors.New("encrypted message is empty")
	}

	res, err := store.db.Exec("INSERT INTO Message (SenderID, Content, Timestamp, ConversationID) VALUES (?,?,?,?)", message.Sender, encryptedMessage, time.Now().Format(time.RFC3339), message.ChatID)
	if err != nil {
		return nil, err
	}

	messageToSend := new(types.Message)
	msgID, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}

	messageToSend.ID = int(msgID)
	messageToSend.SenderID, err = strconv.Atoi(message.Sender)
	if err != nil {
		return nil, err
	}

	messageToSend.Content = message.Content
	messageToSend.Timestamp = time.Now()
	messageToSend.ConversationID, err = strconv.Atoi(message.ChatID)
	if err != nil {
		return nil, err
	}

	return messageToSend, nil
}

func (store *Store) GetConversations(userID string) ([]string, error) {
	parsedUserID, err := strconv.Atoi(userID)

	rows, err := store.db.Query("SELECT ConversationID FROM UserConversation WHERE UserID = ?", parsedUserID)
	if err != nil {
		fmt.Println("Error getting rows:", err)
	}
	defer rows.Close()

	var chatIDs []string
	for rows.Next() {
		var chatID int
		err = rows.Scan(&chatID)
		chatIDs = append(chatIDs, strconv.Itoa(chatID))
	}
	return chatIDs, nil
}
