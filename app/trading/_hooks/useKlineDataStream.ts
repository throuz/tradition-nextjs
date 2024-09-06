import { useEffect, useState } from "react";

export interface KlineStreamData {
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

interface UseKlineStreamProps {
  symbol: string;
  interval: string;
}

const useKlineStream = ({ symbol, interval }: UseKlineStreamProps) => {
  const [data, setData] = useState<KlineStreamData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log({ symbol, interval });

    const socket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`
    );

    socket.onopen = () => {
      setLoading(false);
    };

    socket.onmessage = (event) => {
      try {
        const parsedData: KlineStreamData = JSON.parse(event.data);
        setData(parsedData);
      } catch (err) {
        setError("Failed to parse WebSocket message");
      }
    };

    socket.onerror = (err) => {
      setError(`WebSocket error: ${err}`);
    };

    socket.onclose = () => {
      setLoading(true);
    };

    return () => {
      socket.close();
    };
  }, [symbol, interval]);

  return { data, error, loading };
};

export default useKlineStream;
