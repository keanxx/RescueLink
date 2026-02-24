// src/lib/socket.js
import { io } from "socket.io-client";

// Use Vite env var
const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

console.log("🔗 Connecting to socket server:", URL);

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});
