package user

import (
	"database/sql"
	"fmt"
	"main/types"
)

type Store struct {
	db *sql.DB
}

func (store *Store) GetUserData(userId int) (username string, avatarPath string, err error) {
	rows, err := store.db.Query("SELECT Username, AvatarPath FROM User WHERE userID = ?", userId)
	if err != nil {
		return "", "", err
	}
	defer rows.Close()

	if rows.Next() {
		return "", "", rows.Err()
	}
	u, err := scanRowIntoUser(rows)
	if err != nil {
		return "", "", err
	}
	return u.Username, u.AvatarPath, nil
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (store *Store) UploadAvatar(id int, pathString string) error {
	_, err := store.db.Exec("UPDATE User SET AvatarPath = ? WHERE UserID = ?", pathString, id)
	if err != nil {
		return err
	}
	return nil
}

func (store *Store) GetUserById(id int) (*types.User, error) {
	rows, err := store.db.Query("SELECT * FROM User WHERE UserID = ?", id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, fmt.Errorf("user does not exist")
	}

	u, err := scanRowIntoUser(rows)
	if err != nil {
		return nil, err
	}

	if u.ID == 0 {
		return nil, fmt.Errorf("user does not exist")
	}
	return u, nil
}

func (store *Store) CreateUser(user types.User) error {
	_, err := store.db.Exec("INSERT INTO User (Username, Email, Password) VALUES (?, ?, ?)", user.Username, user.Email, user.Password)
	if err != nil {
		return err
	}
	return nil
}

func (store *Store) GetUserByUsername(username string) (*types.User, error) {
	rows, err := store.db.Query("SELECT * FROM User WHERE Username = ?", username)
	if err != nil {
		return nil, err
	}
	u := new(types.User)
	for rows.Next() {
		u, err = scanRowIntoUser(rows)
		if err != nil {
			return nil, err
		}
	}
	if u.ID == 0 {
		return nil, fmt.Errorf("user not found")
	}

	return u, nil
}

func scanRowIntoUser(rows *sql.Rows) (*types.User, error) {
	user := &types.User{}

	var avatarPath sql.NullString

	err := rows.Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&avatarPath,
	)
	if err != nil {
		return nil, err
	}

	if avatarPath.Valid {
		user.AvatarPath = avatarPath.String
	} else {
		user.AvatarPath = ""
	}

	return user, nil
}
