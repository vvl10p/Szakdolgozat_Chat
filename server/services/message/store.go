package message

import (
	"database/sql"
	"main/types"
	"main/utils"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (store *Store) GetMessages(ChatID string) ([]types.Message, error) {
	rows, err := store.db.Query("SELECT * FROM (SELECT * FROM Message WHERE ConversationID = ? ORDER BY Timestamp DESC LIMIT 20) sub ORDER BY Timestamp ASC", ChatID, ChatID)
	if err != nil {
		return nil, err
	}

	messages := make([]types.Message, 0)
	for rows.Next() {
		m, err := scanRowsIntoMessages(rows)
		if err != nil {
			return nil, err
		}

		messages = append(messages, *m)
	}
	return messages, nil
}

func scanRowsIntoMessages(rows *sql.Rows) (*types.Message, error) {
	message := new(types.Message)

	err := rows.Scan(
		&message.ID,
		&message.SenderID,
		&message.Content,
		&message.Timestamp,
		&message.ConversationID,
		&message.SeenBy,
	)
	if err != nil {
		return nil, err
	}

	decryptedMessage, err := utils.DecryptMessage(message.Content)
	if err != nil {
		return nil, err
	}

	message.Content = decryptedMessage

	return message, nil
}

func (store *Store) DeleteMessages(messageID string) error {
	_, err := store.db.Exec("DELETE FROM Message WHERE MessageID = ?", messageID)
	if err != nil {
		return err
	}
	return nil
}
