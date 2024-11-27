import { useEffect, useState } from "react";

import useWebSocketStore from "../hooks/use-websocket-store";

export interface TickerStream {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  c: string; // Last price
  Q: string; // Last quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade ID
  n: number; // Total number of trades
}

const useTickerStream = (symbol: string | null) => {
  const [data, setData] = useState<TickerStream | null>(null);

  const connect = useWebSocketStore((state) => state.connect);
  const disconnect = useWebSocketStore((state) => state.disconnect);
  const messages = useWebSocketStore((state) => state.messages);

  const url = symbol
    ? `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@ticker`
    : null;

  useEffect(() => {
    if (url) {
      connect(url);
    }

    return () => {
      if (url) {
        disconnect(url);
      }
    };
  }, [url, connect, disconnect]);

  useEffect(() => {
    if (url && messages.has(url)) {
      const allMessages = messages.get(url) || [];
      const latestMessage = allMessages[allMessages.length - 1];

      if (latestMessage) {
        try {
          const parsedData: TickerStream = JSON.parse(latestMessage);
          setData(parsedData);
        } catch (e) {
          console.error("Failed to parse WebSocket message", e);
        }
      }
    }
  }, [messages, url]);

  return data;
};

export default useTickerStream;
