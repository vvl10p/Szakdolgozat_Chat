package friend

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

func CreateChat(store *Store, Ids []int, subject string) error {
	if len(Ids) > 2 && subject == "" || len(Ids) < 2 {
		return nil
	}
	if len(Ids) == 2 {
		result, err := store.db.Exec("INSERT INTO Conversation (subject) VALUES (?)", "")
		if err != nil {
			return err
		}
		chatId, err := result.LastInsertId()
		if err != nil {
			return err
		}

		for _, id := range Ids {
			store.db.Exec("INSERT INTO UserConversation (UserID, ConversationID) VALUES (?,?)", id, chatId)
		}
	} else if len(Ids) > 2 {
		result, err := store.db.Exec("INSERT INTO Conversation (Subject) VALUES (?)", subject)
		if err != nil {
			return err
		}
		chatId, err := result.LastInsertId()
		if err != nil {
			return err
		}

		for _, id := range Ids {
			store.db.Exec("INSERT INTO UserConversation (UserID, ConversationID) VALUES (?,?)", id, chatId)
		}
	} else {
		return nil
	}
	return nil
}

func (store *Store) GetFriendsForSidebar(userId int) ([]types.UserFriendStatus, error) {
	var rows *sql.Rows
	var err error

	rows, err = store.db.Query("SELECT u.UserID, u.Username, u.AvatarPath, f.Status, f.FriendUserID, c.ConversationID FROM User u LEFT JOIN Friend f ON (u.UserID = f.FriendUserID AND f.UserID = ?) OR (u.UserID = f.UserID AND f.FriendUserID = ?) LEFT JOIN UserConversation cm1 ON cm1.UserID = u.UserID INNER JOIN UserConversation cm2 ON cm1.ConversationID = cm2.ConversationID AND cm2.UserID = ? LEFT JOIN Conversation c ON c.ConversationID = cm1.ConversationID AND c.ConversationID = cm2.ConversationID WHERE u.UserID != ?", userId, userId, userId, userId)
	defer rows.Close()

	var users []types.UserFriendStatus

	for rows.Next() {
		var u types.UserFriendStatus
		var avatarPath sql.NullString
		var status sql.NullString
		var friendId sql.NullString
		var chatId sql.NullString

		err := rows.Scan(
			&u.UserID,
			&u.Username,
			&avatarPath,
			&status,
			&friendId,
			&chatId,
		)
		if err != nil {
			return nil, err
		}
		if avatarPath.Valid {
			u.AvatarPath = avatarPath.String
		} else {
			u.AvatarPath = ""
		}
		if status.Valid {
			u.Status = status.String
		} else {
			u.Status = ""
		}
		if friendId.Valid {
			u.FriendID = friendId.String
		} else {
			u.FriendID = ""
		}
		if chatId.Valid {
			u.ChatID = chatId.String
		} else {
			u.ChatID = ""
		}

		if u.Status == "accepted" {
			users = append(users, u)
		}
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (store *Store) GetUsersWithStatus(userId int, searchQuery string) ([]types.UserFriendStatus, error) {
	var rows *sql.Rows
	var err error

	if searchQuery != "" {
		rows, err = store.db.Query("SELECT u.UserID, u.Username, u.AvatarPath, f.Status, f.FriendUserID FROM User u LEFT JOIN Friend f ON (u.UserID = f.FriendUserID AND f.UserID = ?) OR (u.UserID = f.UserID AND f.FriendUserID = ?) WHERE u.UserID != ? AND u.Username LIKE ?", userId, userId, userId, "%"+searchQuery+"%")
	} else {
		rows, err = store.db.Query("SELECT u.UserID, u.Username, u.AvatarPath, f.Status, f.FriendUserID FROM User u LEFT JOIN Friend f ON (u.UserID = f.FriendUserID AND f.UserID = ?) OR (u.UserID = f.UserID AND f.FriendUserID = ?) WHERE u.UserID != ?", userId, userId, userId)
	}
	defer rows.Close()

	var users []types.UserFriendStatus

	for rows.Next() {
		var u types.UserFriendStatus
		var avatarPath sql.NullString
		var status sql.NullString
		var friendId sql.NullString

		err := rows.Scan(
			&u.UserID,
			&u.Username,
			&avatarPath,
			&status,
			&friendId,
		)
		if err != nil {
			return nil, err
		}
		if avatarPath.Valid {
			u.AvatarPath = avatarPath.String
		} else {
			u.AvatarPath = ""
		}
		if status.Valid {
			u.Status = status.String
		} else {
			u.Status = ""
		}
		if friendId.Valid {
			u.FriendID = friendId.String
		} else {
			u.FriendID = ""
		}

		if u.Status != "blocked" {
			users = append(users, u)
		}
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (store *Store) UpdateFriendStatus(userId int, friendId int, status string) error {
	rows, err := store.db.Query("SELECT UserID, FriendUserID, Status FROM Friend WHERE (UserID = ? AND FriendUserID = ?) OR (FriendUserID = ? AND UserID = ?)", userId, friendId, userId, friendId)
	if err != nil {
		return err
	}
	defer rows.Close()

	friends := new([]types.Friend)

	for rows.Next() {
		var u types.Friend

		err := rows.Scan(
			&u.UserID,
			&u.FriendID,
			&u.Status,
		)
		if err != nil {
			return err
		}
		*friends = append(*friends, u)
	}

	if err = rows.Err(); err != nil {
		return err
	}

	if len(*friends) == 0 && (status == "pending" || status == "blocked") {
		_, err := store.db.Exec("INSERT INTO Friend (UserID, FriendUserID, Status) VALUES (?, ?, ?) ", userId, friendId, status)
		if err != nil {
			return err
		}
		return nil
	}

	if len(*friends) != 0 {
		for _, element := range *friends {
			if element.Status == "pending" && status == "accepted" {
				_, err := store.db.Exec("UPDATE Friend SET Status = ? WHERE (UserID = ? AND FriendUserID = ?) OR (UserID = ? AND FriendUserID = ?)", status, userId, friendId, friendId, userId)
				if err != nil {
					return err
				}
				CreateChat(store, []int{userId, friendId}, "")
				return nil
			} else if (element.Status == "pending" || element.Status == "accepted") && status == "" {
				_, err := store.db.Exec("DELETE FROM Friend WHERE (UserID = ? AND FriendUserID = ?) OR (UserID = ? AND FriendUserID = ?)", userId, friendId, friendId, userId)
				if err != nil {
					return err
				}
				return nil
			} else if status == "blocked" && element.Status != "blocked" {
				_, err := store.db.Exec("UPDATE Friend SET Status = ? WHERE (UserID = ? AND FriendUserID = ?) OR (UserID = ? AND FriendUserID = ?)", status, userId, friendId, friendId, userId)
				if err != nil {
					return err
				}
				return nil
			} else {
				return nil
			}
		}
	}

	return nil
}
