package chat

import (
	"fmt"
	"golang.org/x/net/websocket"
	"io"
)

type Server struct {
	conns map[*websocket.Conn]bool
}

func NewServer() *Server {
	return &Server{
		conns: make(map[*websocket.Conn]bool),
	}
}

func (s *Server) handleConn(conn *websocket.Conn) {
	fmt.Println("New connection", conn.RemoteAddr())

	s.conns[conn] = true
}

func (s *Server) readLoop(conn *websocket.Conn) {
	buffer := make([]byte, 1024)
	for {
		b, err := conn.Read(buffer)
		if err != nil {
			if err != io.EOF {
				break
			}
			fmt.Println("Error reading from websocket", err)
			continue
		}
		msg := buffer[:b]
		fmt.Println("Message received", string(msg))

		conn.Write([]byte("message received by server"))
	}
}
