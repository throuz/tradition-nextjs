"use client";

import { useMemo } from "react";

import { useTickerStream } from "../../../lib/streams/useTickerStream";
import { useKlineStore } from "../_providers/kline-store-providers";

export default function SymbolTicker() {
  const { symbol } = useKlineStore((state) => state);
  const tickerStream = useTickerStream(symbol);

  const lastPrice = tickerStream?.c ?? "-";

  const priceChange = useMemo(() => {
    const priceChange = tickerStream?.P;
    if (!priceChange) return "-";
    const changeValue = parseFloat(priceChange);
    return `${changeValue >= 0 ? "+" : ""}${changeValue.toFixed(2)}`;
  }, [tickerStream?.P]);

  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{symbol}</h2>
      <div className="text-4xl font-bold mb-2">${lastPrice}</div>
      <p className="text-muted-foreground">24h Change: {priceChange}%</p>
    </div>
  );
}
