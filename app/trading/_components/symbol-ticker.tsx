"use client";

import React from "react";

import { useTickerStream } from "../../../lib/streams/useTickerStream";
import { useKlineStore } from "../_providers/kline-store-providers";

export default function SymbolTicker() {
  const { symbol } = useKlineStore((state) => state);
  const tickerStream = useTickerStream(symbol);

  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{symbol}</h2>
      <div className="text-4xl font-bold mb-2">${tickerStream?.c ?? "-"}</div>
      <p className="text-muted-foreground">
        24h Change: {tickerStream?.P ?? "-"}%
      </p>
    </div>
  );
}
