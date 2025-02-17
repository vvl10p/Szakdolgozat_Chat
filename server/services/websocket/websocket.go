package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/go-playground/validator/v10"
	"log"
	db2 "main/db"
	"main/services/auth"
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
	Event   string `json:"event"`
	ChatID  string `json:"chatId"`
	Sender  string `json:"sender"`
	Content string `json:"content"`
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

	listenForMessages(conn, chatIDs, userID)
}

func initStorage(db *sql.DB) {
	err := db.Ping()
	if err != nil {
		panic(err)
	}
}

func broadcastMessage(room *ChatRoom, message Message, userID string) {
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

func listenForMessages(conn *websocket.Conn, chatIDs []string, userID string) {
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
			broadcastMessage(room, message, userID)
		} else {
			fmt.Printf("User %s tried to send a message to a non-existent Chat Room %s\n", userID, message.ChatID)
		}
	}
}

func saveMessage(store *Store, message Message) error {
	_, err := store.db.Exec("INSERT INTO Message (SenderID, Content, Timestamp, ConversationID, SeenBy) VALUES (?,?,?,?,?)", message.Sender, message.Content, time.Now().Format(time.RFC3339), message.ChatID, "")
	if err != nil {
		return err
	}
	return nil
}

func handleSaveMessage(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	_, err := auth.ValidateJWT(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	var payload types.MessagePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("validation error: %v", errors))
		return
	}
	
	utils.WriteJSON(w, http.StatusCreated, nil)
}

func main() {
	http.HandleFunc("/ws", handleWebSocket)
	http.HandleFunc("/message/save", handleSaveMessage)
	log.Println("WebSocket server started on :5175")
	log.Fatal(http.ListenAndServe(":5175", nil))
}
