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

func (store *Store) GetFriendsForSidebar(userId int) ([]types.UserFriendStatus, error) {
	var rows *sql.Rows
	var err error

	rows, err = store.db.Query("SELECT u.UserID, u.Username, u.AvatarPath, f.Status, f.FriendUserID FROM User u LEFT JOIN Friend f ON (u.UserID = f.FriendUserID AND f.UserID = ?) OR (u.UserID = f.UserID AND f.FriendUserID = ?) WHERE u.UserID != ?", userId, userId, userId)
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
			u.FriendId = friendId.String
		} else {
			u.FriendId = ""
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
			u.FriendId = friendId.String
		} else {
			u.FriendId = ""
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
			&u.UserId,
			&u.FriendId,
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
