import { KlineInterval } from "@/lib/types";

export interface KlinesRequestParams {
  symbol: string; // Mandatory
  interval: KlineInterval; // Enum, mandatory
  startTime?: number; // Optional, Unix timestamp in milliseconds
  endTime?: number; // Optional, Unix timestamp in milliseconds
  limit?: number; // Optional, default 500, max 1500
}

export type KlinesResponse = [
  number, // Open time (Unix timestamp in milliseconds)
  string, // Open price
  string, // High price
  string, // Low price
  string, // Close price
  string, // Volume
  number, // Close time (Unix timestamp in milliseconds)
  string, // Quote asset volume
  number, // Number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string // Ignore (unused field)
][];

export const fetchKlines = async (
  params: KlinesRequestParams
): Promise<KlinesResponse> => {
  const url = new URL("https://fapi.binance.com/fapi/v1/klines");
  Object.keys(params).forEach((key) => {
    if (params[key as keyof KlinesRequestParams] !== undefined) {
      url.searchParams.append(
        key,
        String(params[key as keyof KlinesRequestParams])
      );
    }
  });
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch klines data");
  return response.json();
};
