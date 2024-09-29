import { useQuery } from "@tanstack/react-query";

import { MarkPriceAllSymbolsResponse, MarkPriceResponse } from "./types";

export const fetchMarkPrice = async (
  symbol?: string
): Promise<MarkPriceResponse | MarkPriceAllSymbolsResponse> => {
  const url = symbol ? `/api/mark-price?symbol=${symbol}` : `/api/mark-price`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch mark price information");

  return response.json();
};

export const useMarkPriceQuery = (symbol?: string) => {
  return useQuery({
    queryKey: ["markPrice", symbol],
    queryFn: () => fetchMarkPrice(symbol),
    enabled: !!symbol || symbol === undefined,
  });
};
