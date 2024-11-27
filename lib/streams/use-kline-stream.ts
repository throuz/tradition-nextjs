import { useEffect, useState } from "react";

import { KlineInterval } from "@/lib/types";

import useWebSocketStore from "../hooks/use-websocket-store";

export interface KlineStream {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  k: {
    t: number; // Kline start time
    T: number; // Kline close time
    s: string; // Symbol
    i: string; // Interval
    f: number; // First trade ID
    L: number; // Last trade ID
    o: string; // Open price
    c: string; // Close price
    h: string; // High price
    l: string; // Low price
    v: string; // Base asset volume
    n: number; // Number of trades
    x: boolean; // Is this kline closed?
    q: string; // Quote asset volume
    V: string; // Taker buy base asset volume
    Q: string; // Taker buy quote asset volume
    B: string; // Ignore
  };
}

const useKlineStream = (
  symbol: string | null,
  interval: KlineInterval | null
) => {
  const [data, setData] = useState<KlineStream | null>(null);

  const connect = useWebSocketStore((state) => state.connect);
  const disconnect = useWebSocketStore((state) => state.disconnect);
  const messages = useWebSocketStore((state) => state.messages);

  const url =
    symbol && interval
      ? `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@kline_${interval}`
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
          const parsedData: KlineStream = JSON.parse(latestMessage);
          setData(parsedData);
        } catch (e) {
          console.error("Failed to parse WebSocket message", e);
        }
      }
    }
  }, [messages, url]);

  return data;
};

export default useKlineStream;
