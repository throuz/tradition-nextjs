import { useMemo } from "react";

import { useTickerStream } from "../../../../lib/streams/useTickerStream";
import { useKlineStore } from "../../_providers/kline-store-providers";

import { SymbolCombobox } from "./symbol-combobox";

export function SymbolTicker() {
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
    <div className="flex items-center gap-4">
      <SymbolCombobox />
      <div className="text-2xl font-bold">${lastPrice}</div>
      <div className="text-muted-foreground">24h Change: {priceChange}%</div>
    </div>
  );
}
