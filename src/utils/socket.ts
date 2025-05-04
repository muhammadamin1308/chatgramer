const socket = new WebSocket("ws://localhost:4000");
export default socket;

const messageQueue: object[] = [];

socket.addEventListener("open", () => {
  console.log("WebSocket connection established");

  // Send all queued messages
  while (messageQueue.length > 0) {
    const message = messageQueue.shift();
    if (message) {
      socket.send(JSON.stringify(message));
    }
  }
});

socket.addEventListener("close", () => {
  console.log("WebSocket connection closed");
});

socket.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});


// send message to server
export const sendMessage = (socket: WebSocket, message: object) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn("WebSocket not ready. Queuing message:", message);
    messageQueue.push(message);
  }
}


// generate unique ID for each user
export const generateID = () => crypto.randomUUID()


// login user
export function loginUser(login: string, password: string) {
  const message = {
    id: generateID(),
    type: "USER_LOGIN",
    payload: {
      user: {
        login,
        password
      }
    }
  }

  sendMessage(socket, message)
}


// handle user login response
socket.addEventListener("message", (event) => {
  event.preventDefault();
  const data = JSON.parse(event.data);
  if (data.type === "USER_LOGIN") {
    sessionStorage.setItem("user", JSON.stringify(data.payload.user));
    console.log("User ID stored in localStorage:", data.id);
    window.location.href = "/";
    console.log("Login successful", data.payload.user);
  } else if (data.type === "ERROR") {
    console.error("Error:", data.payload.error);
  } else if (data.type === "USER_EXTERNAL_LOGIN") {
    console.log("Other user logged in:", data.payload.user.login);
  }
});



const storedUserID = sessionStorage.getItem("user");

// send chat message
export const sendChatMessage = (to: string, text: string) => {
  const message = {
    id: storedUserID,
    type: "MSG_SEND",
    payload: {
      message: {
        to,
        text,
      },
    },
  };

  sendMessage(socket, message);
};

// get all users
export const getAllUsers = () => {
  
  const message = {
    id: storedUserID,
    type: "USER_ACTIVE",
    payload: null,
  };

  sendMessage(socket, message);
};



// Helper function to wait for WebSocket to be ready
export const waitForWebSocketReady = (socket: WebSocket): Promise<void> => {
  return new Promise((resolve) => {
    if (socket.readyState === WebSocket.OPEN) {
      resolve();
    } else {
      socket.addEventListener("open", () => resolve(), { once: true });
    }
  });
};


socket.onclose = (event) => {
  if (event.wasClean) {
    console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
  } else {
    console.error('Connection died');
  }
}




