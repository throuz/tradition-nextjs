import { useQuery } from "@tanstack/react-query";

import { fetchTicker } from "../api/ticker";

import useTickerStream from "./use-ticker-stream";

const useLastPriceStream = (symbol: string | null): string | null => {
  const tickerStream = useTickerStream(symbol);
  const { data } = useQuery({
    queryKey: [symbol],
    queryFn: () => fetchTicker(symbol as string),
    enabled: !!symbol,
  });

  const lastPrice = (() => {
    if (tickerStream) {
      return tickerStream.c;
    }
    if (data) {
      return data.price;
    }
    return null;
  })();

  return lastPrice;
};

export default useLastPriceStream;
