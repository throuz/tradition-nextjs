export interface MarkPriceResponse {
  symbol: string; // Symbol (e.g., "BTCUSDT")
  markPrice: string; // Mark price as a string
  indexPrice: string; // Index price as a string
  estimatedSettlePrice: string; // Estimated settle price
  lastFundingRate: string; // Latest funding rate
  nextFundingTime: number; // Timestamp of next funding time
  interestRate: string; // Interest rate
  time: number; // Timestamp of the response
}

export type MarkPriceAllSymbolsResponse = MarkPriceResponse[];
