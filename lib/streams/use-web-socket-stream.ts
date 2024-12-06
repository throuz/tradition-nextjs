import { useEffect, useState } from "react";
import { create } from "zustand";

import useWebSocketStore from "../hooks/use-websocket-store";

interface StreamConsumersStore {
  consumersMap: Map<string, number>;
  updateConsumersMap: (url: string, count: number) => void;
}

const useStreamConsumersStore = create<StreamConsumersStore>((set, get) => ({
  consumersMap: new Map(),
  updateConsumersMap: (url, count) =>
    set((state) => {
      const consumers = state.consumersMap.get(url);
      if (consumers) {
        state.consumersMap.set(url, consumers + count);
        return { consumersMap: state.consumersMap };
      }
      return state;
    }),
}));

const useWebSocketStream = <T>(url: string | null) => {
  const [data, setData] = useState<T | null>(null);

  const connect = useWebSocketStore((state) => state.connect);
  const disconnect = useWebSocketStore((state) => state.disconnect);
  const messages = useWebSocketStore((state) => state.messages);

  const consumersMap = useStreamConsumersStore((state) => state.consumersMap);

  useEffect(() => {
    if (url) {
      const currentConsumers = consumersMap.get(url);
      const consumers = currentConsumers ? currentConsumers + 1 : 1;
      consumersMap.set(url, consumers);
      connect(url);
    }

    return () => {
      if (url) {
        const currentConsumers = consumersMap.get(url);
        const consumers = currentConsumers ? currentConsumers - 1 : 0;
        consumersMap.set(url, consumers);
        if (consumers === 0) {
          disconnect(url);
        }
      }
    };
  }, [connect, consumersMap, disconnect, url]);

  useEffect(() => {
    if (url && messages.has(url)) {
      const allMessages = messages.get(url) || [];
      const latestMessage = allMessages[allMessages.length - 1];

      if (latestMessage) {
        try {
          const parsedData = JSON.parse(latestMessage) as T;
          setData(parsedData);
        } catch (e) {
          console.error("Failed to parse WebSocket message", e);
        }
      }
    }
  }, [messages, url]);

  return data;
};

export default useWebSocketStream;
