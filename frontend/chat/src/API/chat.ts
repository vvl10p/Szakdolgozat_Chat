let ws: WebSocket

export function InitConnect() {
    ws = new WebSocket("ws://localhost:5174/ws")
    ws.onmessage = () => {

    }
}

type MessageType = {
    message: string,
    senderID: number,
    conversationID: number,
}

export function sendMessage(msg: MessageType) {
    ws.send(JSON.stringify(msg))
}