import { useQuery } from "@tanstack/react-query";

interface KlineData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;
}

interface UseKlineDataParams {
  symbol: string;
  interval: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

const useKlineData = ({
  symbol,
  interval,
  startTime,
  endTime,
  limit = 1500,
}: UseKlineDataParams) => {
  return useQuery<KlineData[]>({
    queryKey: ["klineData", symbol, interval, startTime, endTime, limit],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        symbol,
        interval,
        limit: limit.toString(),
      });

      if (startTime) queryParams.append("startTime", startTime.toString());
      if (endTime) queryParams.append("endTime", endTime.toString());

      const response = await fetch(`/api/klines?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      // Map the response to match the KlineData interface
      return data.map((kline: any) => ({
        openTime: kline[0],
        open: kline[1],
        high: kline[2],
        low: kline[3],
        close: kline[4],
        volume: kline[5],
        closeTime: kline[6],
        quoteAssetVolume: kline[7],
        numberOfTrades: kline[8],
        takerBuyBaseAssetVolume: kline[9],
        takerBuyQuoteAssetVolume: kline[10],
        ignore: kline[11],
      }));
    },
  });
};

export default useKlineData;
