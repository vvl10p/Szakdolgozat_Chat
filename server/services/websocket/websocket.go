package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	db2 "main/db"
	"main/types"
	"main/utils"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type ChatRoom struct {
	ID          string
	Connections []*websocket.Conn
	mu          sync.Mutex
}

var chatRooms = make(map[string]*ChatRoom)
var chatRoomsMu sync.Mutex

type Message struct {
	Event   string `json:"Event"`
	ChatID  string `json:"ChatID"`
	Sender  string `json:"Sender"`
	Content string `json:"Content"`
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	db, err := db2.NewSqliteDB("../../server.db")
	store := NewStore(db)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	initStorage(db)

	userID := r.URL.Query().Get("userID")
	if userID == "" {
		http.Error(w, "userID is required", http.StatusBadRequest)
		return
	}

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

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}

	fmt.Printf("User %s connected to WebSocket\n", userID)

	conn.SetCloseHandler(func(code int, text string) error {
		fmt.Printf("User %s disconnected from WebSocket: %d - %s\n", userID, code, text)
		return nil
	})

	for _, chatID := range chatIDs {
		chatRoomsMu.Lock()
		room, exists := chatRooms[chatID]
		if !exists {
			room = &ChatRoom{
				ID:          chatID,
				Connections: []*websocket.Conn{},
			}
			chatRooms[chatID] = room
		}
		room.mu.Lock()
		room.Connections = append(room.Connections, conn)
		room.mu.Unlock()
		chatRoomsMu.Unlock()

		fmt.Printf("User %s joined Chat Room %s\n", userID, chatID)
	}

	store.listenForMessages(conn, chatIDs, userID)
}

func initStorage(db *sql.DB) {
	err := db.Ping()
	if err != nil {
		panic(err)
	}
}

func broadcastMessage(room *ChatRoom, message *types.Message, userID string) {
	room.mu.Lock()
	defer room.mu.Unlock()

	msgData, _ := json.Marshal(message)
	for _, conn := range room.Connections {
		err := conn.WriteMessage(websocket.TextMessage, msgData)
		if err != nil {
			log.Println("Write error:", err)
		}
	}

	fmt.Printf("User %s sent a message to Chat Room %s: %s\n", userID, room.ID, message.Content)
}

func removeConnectionFromRoom(room *ChatRoom, conn *websocket.Conn) {
	room.mu.Lock()
	defer room.mu.Unlock()

	var activeConnections []*websocket.Conn
	for _, c := range room.Connections {
		if c != conn {
			activeConnections = append(activeConnections, c)
		}
	}
	room.Connections = activeConnections

	if len(room.Connections) == 0 {
		go func(chatID string) {
			time.Sleep(10 * time.Second)
			chatRoomsMu.Lock()
			if len(chatRooms[chatID].Connections) == 0 {
				delete(chatRooms, chatID)
				fmt.Printf("Chat Room %s removed (no active users left)\n", chatID)
			}
			chatRoomsMu.Unlock()
		}(room.ID)
	} else {
		fmt.Printf("User left Chat Room %s. Active connections: %d\n", room.ID, len(room.Connections))
	}
}

func (store *Store) listenForMessages(conn *websocket.Conn, chatIDs []string, userID string) {
	defer func() {
		for _, chatID := range chatIDs {
			chatRoomsMu.Lock()
			if room, exists := chatRooms[chatID]; exists {
				removeConnectionFromRoom(room, conn)
			}
			chatRoomsMu.Unlock()
		}
		conn.Close()
	}()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Printf("User %s disconnected due to error: %v\n", userID, err)
			break
		}

		fmt.Printf("User %s sent message: %s\n", userID, string(msg))

		var message Message
		if err := json.Unmarshal(msg, &message); err != nil {
			log.Println("Invalid message format:", err)
			continue
		}

		if room, exists := chatRooms[message.ChatID]; exists {
			msgtosend, err := saveMessage(store, message)
			broadcastMessage(room, msgtosend, userID)
			if err != nil {
				log.Println("Error saving message:", err)
				return
			}
		} else {
			fmt.Printf("User %s tried to send a message to a non-existent Chat Room %s\n", userID, message.ChatID)
		}
	}
}

func saveMessage(store *Store, message Message) (*types.Message, error) {
	encryptedMessage, err := utils.EncryptMessage(message.Content)
	if err != nil {
		return nil, err
	}

	if len(encryptedMessage) == 0 {
		return nil, errors.New("encrypted message is empty")
	}

	res, err := store.db.Exec("INSERT INTO Message (SenderID, Content, Timestamp, ConversationID, SeenBy) VALUES (?,?,?,?,?)", message.Sender, encryptedMessage, time.Now().Format(time.RFC3339), message.ChatID, "")
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

	messageToSend.SeenBy = ""

	return messageToSend, nil
}

func main() {
	http.HandleFunc("/ws", handleWebSocket)
	log.Println("WebSocket server started on :5175")
	log.Fatal(http.ListenAndServe(":5175", nil))
}
