import { useMemo } from "react";
import { CandlestickData, Time } from "lightweight-charts";

import { useSymbolDataCardContext } from "./context";

export function useCandlestickDatas(): CandlestickData[] {
  const { klinesResponse } = useSymbolDataCardContext();

  const candlestickDatas = useMemo<CandlestickData[]>(() => {
    return klinesResponse.map((kline) => ({
      time: (kline[0] / 1000) as Time,
      open: Number(kline[1]),
      high: Number(kline[2]),
      low: Number(kline[3]),
      close: Number(kline[4]),
    }));
  }, [klinesResponse]);

  return candlestickDatas;
}
