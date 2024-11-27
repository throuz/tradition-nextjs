import { create } from "zustand";

interface WebSocketState {
  sockets: Map<string, WebSocket>;
  connectionStatus: Map<string, boolean>; // Tracks connection readiness
  messages: Map<string, string[]>; // Stores messages by URL
  connect: (url: string) => void;
  disconnect: (url: string) => void;
  sendMessage: (url: string, message: string) => void;
}

const useWebSocketStore = create<WebSocketState>((set, get) => ({
  sockets: new Map(),
  connectionStatus: new Map(),
  messages: new Map(),

  connect: (url: string) => {
    const sockets = get().sockets;

    // Prevent duplicate connection
    if (sockets.has(url)) {
      console.warn(`WebSocket already connected to ${url}`);
      return;
    }

    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log(`WebSocket connected: ${url}`);
      set((state) => {
        const connectionStatus = new Map(state.connectionStatus);
        connectionStatus.set(url, true);
        return { connectionStatus };
      });
    };

    socket.onmessage = (event) => {
      const newMessage = event.data;

      set((state) => {
        const messages = new Map(state.messages);
        const currentMessages = messages.get(url) || [];
        messages.set(url, [...currentMessages, newMessage]);
        return { messages };
      });
    };

    socket.onclose = () => {
      console.log(`WebSocket disconnected: ${url}`);
      set((state) => {
        const sockets = new Map(state.sockets);
        const connectionStatus = new Map(state.connectionStatus);
        const messages = new Map(state.messages);
        sockets.delete(url);
        connectionStatus.delete(url);
        messages.delete(url);
        return { sockets, connectionStatus, messages };
      });
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error on ${url}:`, error);
    };

    // Add the WebSocket to the state
    set((state) => {
      const sockets = new Map(state.sockets);
      sockets.set(url, socket);
      return { sockets };
    });
  },

  disconnect: (url: string) => {
    const sockets = get().sockets;
    const connectionStatus = get().connectionStatus;
    const socket = sockets.get(url);

    // Disconnect only if the socket exists and is connected
    if (socket && connectionStatus.get(url)) {
      socket.close();
    } else {
      console.warn(
        `Cannot disconnect: WebSocket not connected or not ready for ${url}`
      );
    }
  },

  sendMessage: (url: string, message: string) => {
    const sockets = get().sockets;
    const socket = sockets.get(url);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
      console.log(`Message sent to ${url}:`, message);
    } else {
      console.warn(`Cannot send message: WebSocket not connected to ${url}`);
    }
  },
}));

export default useWebSocketStore;
