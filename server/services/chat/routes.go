package chat

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"log"
	"main/types"
	"main/utils"
	"net/http"
	"sync"
	"time"
)

type Handler struct {
	store types.ChatStore
}

func NewHandler(store types.ChatStore) *Handler {
	return &Handler{store: store}
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

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/ws", h.handleWebSocket)
}

func (h *Handler) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("userID")
	if userID == "" {
		http.Error(w, "userID is required", http.StatusBadRequest)
		return
	}

	chatIDs, err := h.store.GetConversations(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}

	conn.SetCloseHandler(func(code int, text string) error {
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
	}

	h.listenForMessages(conn, chatIDs, userID)
}

func broadcastMessage(room *ChatRoom, message types.Message) {
	room.mu.Lock()
	defer room.mu.Unlock()

	msgData, _ := json.Marshal(message)
	for _, conn := range room.Connections {
		err := conn.WriteMessage(websocket.TextMessage, msgData)
		if err != nil {
			log.Println("Write error:", err)
		}
	}
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
			}
			chatRoomsMu.Unlock()
		}(room.ID)
	}
}

func (h *Handler) listenForMessages(conn *websocket.Conn, chatIDs []string, userID string) {
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
			break
		}

		var message types.MessageFromWS
		if err := json.Unmarshal(msg, &message); err != nil {
			log.Println("Invalid message format:", err)
			continue
		}

		if room, exists := chatRooms[message.ChatID]; exists {
			if message.Event == "FileUpload" {

				tempContent, err := utils.UploadFile(message.File, message.Content)
				if err != nil {
					log.Println("Upload error:", err)
				}

				message.Content = tempContent

				msgtosend, err := h.store.SaveMessage(message)
				if err != nil {
					log.Println("Save error:", err)
				}
				broadcastMessage(room, *msgtosend)
			} else {
				msgtosend, err := h.store.SaveMessage(message)
				if err != nil {
					log.Println("Save error:", err)
				}
				broadcastMessage(room, *msgtosend)
				if err != nil {
					log.Println("Error saving message:", err)
					return
				}
			}
		} else {
			log.Printf("User %s tried to send a message to a non-existent Chat Room %s\n", userID, message.ChatID)
		}
	}
}
