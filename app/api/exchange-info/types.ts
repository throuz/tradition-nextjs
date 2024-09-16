import {
  ContractType,
  ContractStatus,
  OrderType,
  TimeInForce,
  RateLimitType,
  RateLimitInterval,
  SymbolFilter,
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
