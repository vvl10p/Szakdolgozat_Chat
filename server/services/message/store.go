package message

import (
	"database/sql"
	"main/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (store *Store) GetMessages() ([]types.Message, error) {
	rows, err := store.db.Query("SELECT * FROM Message")
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
		&message.SenderId,
		&message.RecipientId,
		&message.Content,
		&message.CreatedAt,
		&message.ConversationId,
	)
	if err != nil {
		return nil, err
	}
	return message, nil
}

func (store *Store) StoreMessage(message types.Message) error {
	_, err := store.db.Exec("INSERT INTO Message (SenderID,RecipientID,Content,Timestamp,ConversationID)", message.SenderId, message.RecipientId, message.Content, message.CreatedAt, message.ConversationId)
	if err != nil {
		return err
	}
	return nil
}
