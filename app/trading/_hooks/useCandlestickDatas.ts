import { useMemo } from "react";
import { CandlestickData, Time } from "lightweight-charts";
import { useKlinesQuery } from "@/app/api/klines/hooks";
import { useKlineStore } from "../_providers/kline-store-providers";

export const useCandlestickDatas = () => {
  const { symbol, interval } = useKlineStore((state) => state);
  const { data, isSuccess } = useKlinesQuery({
    symbol,
    interval,
  });

  const candlestickDatas = useMemo<CandlestickData[]>(() => {
    if (isSuccess) {
      return data.map((kline) => ({
        time: (kline[6] / 1000) as Time,
        open: Number(kline[1]),
        high: Number(kline[2]),
        low: Number(kline[3]),
        close: Number(kline[4]),
      }));
    }
    return [];
  }, [data, isSuccess]);

  return candlestickDatas;
};
