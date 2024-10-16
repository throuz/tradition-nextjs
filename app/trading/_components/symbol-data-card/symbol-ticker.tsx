"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { useTickerStream } from "../../../../lib/streams/useTickerStream";

import { SymbolCombobox } from "./symbol-combobox";

export function SymbolTicker() {
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");

  const tickerStream = useTickerStream(symbol);

  const lastPrice = tickerStream?.c ?? "-";

  const priceChange = useMemo(() => {
    const priceChange = tickerStream?.P;
    if (!priceChange) return "-";
    const changeValue = parseFloat(priceChange);
    return `${changeValue >= 0 ? "+" : ""}${changeValue.toFixed(2)}`;
  }, [tickerStream?.P]);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      <SymbolCombobox />
      <div className="text-2xl font-bold">${lastPrice}</div>
      <div className="text-muted-foreground">24h Change: {priceChange}%</div>
    </div>
  );
}
