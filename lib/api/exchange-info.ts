import {
  ContractStatus,
  ContractType,
  OrderType,
  RateLimitInterval,
  RateLimitType,
  SymbolFilter,
  TimeInForce,
} from "@/lib/types";

export interface RateLimit {
  rateLimitType: RateLimitType;
  interval: RateLimitInterval;
  intervalNum: number;
  limit: number;
}

export interface Asset {
  asset: string;
  marginAvailable: boolean;
  autoAssetExchange: number | null;
}

export interface SymbolInfo {
  symbol: string;
  pair: string;
  contractType: ContractType;
  deliveryDate: number;
  onboardDate: number;
  status: ContractStatus;
  maintMarginPercent: string;
  requiredMarginPercent: string;
  baseAsset: string;
  quoteAsset: string;
  marginAsset: string;
  pricePrecision: number;
  quantityPrecision: number;
  baseAssetPrecision: number;
  quotePrecision: number;
  underlyingType: string;
  underlyingSubType: string[];
  settlePlan: number;
  triggerProtect: string;
  filters: SymbolFilter[];
  orderTypes: OrderType[];
  timeInForce: TimeInForce[];
  liquidationFee: string;
  marketTakeBound: string;
}

export interface ExchangeInfoResponse {
  exchangeFilters: any[];
  rateLimits: RateLimit[];
  serverTime: number;
  assets: Asset[];
  symbols: SymbolInfo[];
  timezone: string;
}

export const fetchExchangeInfo = async (): Promise<ExchangeInfoResponse> => {
  const response = await fetch("https://fapi.binance.com/fapi/v1/exchangeInfo");
  if (!response.ok) throw new Error("Failed to fetch exchange information");
  return response.json();
};
