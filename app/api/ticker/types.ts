export interface TickerPriceResponse {
  symbol: string; // Symbol (e.g., "BTCUSDT")
  price: string; // Latest price as a string
  time: number; // Timestamp of the response
}

export type TickerPriceAllSymbolsResponse = TickerPriceResponse[];
