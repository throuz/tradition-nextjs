import { useEffect, useState } from "react";

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

export const useTickerStream = (symbol: string) => {
  const [data, setData] = useState<TickerStream | null>(null);

  useEffect(() => {
    const socket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`
    );

    socket.onmessage = (event) => {
      const parsedData: TickerStream = JSON.parse(event.data);
      setData(parsedData);
    };

    return () => {
      socket.close();
    };
  }, [symbol]);

  return data;
};
