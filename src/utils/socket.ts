let socket: WebSocket | null = null;
const messageQueue: string[] = [];
const messageHandlers: ((data: any) => void)[] = [];
const reconnectInterval = 5000; 
const url = "ws://localhost:4000";

function initializeWebSocket(): void {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    console.warn("WebSocket is already open or connecting. Initialization skipped.");
    return;
  }

  socket = new WebSocket(url);

  socket.addEventListener("open", () => {
    console.log("WS Connection established");
    clearMessageQueue();
    
    const connectionIdMessage = {
      type: "CONNECTION_ID_UPDATED",
      payload: { connectionId: socket?.url },
    };
    messageHandlers.forEach((handler) => handler(connectionIdMessage));
  });

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    messageHandlers.forEach((handler) => handler(data));
  });

  socket.addEventListener("close", () => {
    console.warn("WS Connection closed.");
    socket = null;
    setTimeout(() => initializeWebSocket(), reconnectInterval);
  });

  socket.addEventListener("error", (error) => {
    console.error("WS Error:", error);
  });
}

function clearMessageQueue(): void {
  if (socket?.readyState === WebSocket.OPEN) {
    while (messageQueue.length > 0) {
      const message = messageQueue.shift();
      if (message) {
        socket.send(message);
        console.log("WS Queued message sent:", message);
      }
    }
  }
}

export function sendMessage(message: object): void {
  const messageString = JSON.stringify(message);
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(messageString);

  } else {
    messageQueue.push(messageString);
    console.warn("WS Connection not open. Message queued:", messageString);
  }
}

export function onMessage(handler: (data: any) => void): void {
  messageHandlers.push(handler);
}


// Initialize the WebSocket connection
initializeWebSocket();
export { socket, initializeWebSocket };