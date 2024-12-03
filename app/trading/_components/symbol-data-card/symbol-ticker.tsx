"use client";

import { useSearchParams } from "next/navigation";

import useTickerStream from "../../../../lib/streams/use-ticker-stream";

import { useSymbolDataCardContext } from "./context";
import { SymbolCombobox } from "./symbol-combobox";

export function SymbolTicker() {
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");

  const tickerStream = useTickerStream(symbol);
  const { ticker24hrResponse } = useSymbolDataCardContext();

  const lastPrice = tickerStream?.c || ticker24hrResponse.lastPrice;

  const priceChange = (() => {
    const priceChangeValue = tickerStream?.P || ticker24hrResponse.priceChange;
    const changeValue = parseFloat(priceChangeValue);
    return `${changeValue >= 0 ? "+" : ""}${changeValue.toFixed(2)}`;
  })();

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      <SymbolCombobox />
      <div className="text-2xl font-bold">${lastPrice}</div>
      <div className="text-muted-foreground">24h Change: {priceChange}%</div>
    </div>
  );
}
