import { useQuery } from "@tanstack/react-query";

import { TickerPriceAllSymbolsResponse, TickerPriceResponse } from "./types";

export const fetchTickerPrice = async (
  symbol?: string
): Promise<TickerPriceResponse | TickerPriceAllSymbolsResponse> => {
  const url = symbol ? `/api/ticker?symbol=${symbol}` : `/api/ticker`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch ticker price information");

  return response.json();
};

export const useTickerPriceQuery = (symbol?: string) => {
  return useQuery({
    queryKey: ["tickerPrice", symbol],
    queryFn: () => fetchTickerPrice(symbol),
    enabled: !!symbol || symbol === undefined,
  });
};
