export enum SymbolType {
  Future = "FUTURE",
}

export enum ContractType {
  Perpetual = "PERPETUAL",
  CurrentMonth = "CURRENT_MONTH",
  NextMonth = "NEXT_MONTH",
  CurrentQuarter = "CURRENT_QUARTER",
  NextQuarter = "NEXT_QUARTER",
  PerpetualDelivering = "PERPETUAL_DELIVERING",
}

export enum ContractStatus {
  PendingTrading = "PENDING_TRADING",
  Trading = "TRADING",
  PreDelivering = "PRE_DELIVERING",
  Delivering = "DELIVERING",
  Delivered = "DELIVERED",
  PreSettle = "PRE_SETTLE",
  Settling = "SETTLING",
  Close = "CLOSE",
}

export enum OrderStatus {
  New = "NEW",
  PartiallyFilled = "PARTIALLY_FILLED",
  Filled = "FILLED",
  Canceled = "CANCELED",
  Rejected = "REJECTED",
  Expired = "EXPIRED",
}

export enum OrderType {
  Limit = "LIMIT",
  Market = "MARKET",
  Stop = "STOP",
  StopMarket = "STOP_MARKET",
  TakeProfit = "TAKE_PROFIT",
  TakeProfitMarket = "TAKE_PROFIT_MARKET",
  TrailingStopMarket = "TRAILING_STOP_MARKET",
}

export enum OrderSide {
  Buy = "BUY",
  Sell = "SELL",
}

export enum PositionSide {
  Both = "BOTH",
  Long = "LONG",
  Short = "SHORT",
}

export enum TimeInForce {
  GTC = "GTC",
  IOC = "IOC",
  FOK = "FOK",
  GTX = "GTX",
  GTD = "GTD",
}

export enum WorkingType {
  MarkPrice = "MARK_PRICE",
  ContractPrice = "CONTRACT_PRICE",
}

export enum NewOrderResponseType {
  Ack = "ACK",
  Result = "RESULT",
}

export enum KlineInterval {
  OneMinute = "1m",
  ThreeMinutes = "3m",
  FiveMinutes = "5m",
  FifteenMinutes = "15m",
  ThirtyMinutes = "30m",
  OneHour = "1h",
  TwoHours = "2h",
  FourHours = "4h",
  SixHours = "6h",
  EightHours = "8h",
  TwelveHours = "12h",
  OneDay = "1d",
  ThreeDays = "3d",
  OneWeek = "1w",
  OneMonth = "1M",
}

export enum STPMode {
  None = "NONE",
  ExpireTaker = "EXPIRE_TAKER",
  ExpireBoth = "EXPIRE_BOTH",
  ExpireMaker = "EXPIRE_MAKER",
}

export enum PriceMatch {
  None = "NONE",
  Opponent = "OPPONENT",
  Opponent5 = "OPPONENT_5",
  Opponent10 = "OPPONENT_10",
  Opponent20 = "OPPONENT_20",
  Queue = "QUEUE",
  Queue5 = "QUEUE_5",
  Queue10 = "QUEUE_10",
  Queue20 = "QUEUE_20",
}

export enum RateLimitType {
  RequestWeight = "REQUEST_WEIGHT",
  Orders = "ORDERS",
}

export enum RateLimitInterval {
  Minute = "MINUTE",
}

export enum FilterType {
  PriceFilter = "PRICE_FILTER",
  LotSize = "LOT_SIZE",
  MarketLotSize = "MARKET_LOT_SIZE",
  MaxNumOrders = "MAX_NUM_ORDERS",
  MaxNumAlgoOrders = "MAX_NUM_ALGO_ORDERS",
  PercentPrice = "PERCENT_PRICE",
  MinNotional = "MIN_NOTIONAL",
}

export interface PriceFilter {
  filterType: FilterType.PriceFilter;
  minPrice: string;
  maxPrice: string;
  tickSize: string;
}

export interface LotSizeFilter {
  filterType: FilterType.LotSize;
  minQty: string;
  maxQty: string;
  stepSize: string;
}

export interface MarketLotSizeFilter {
  filterType: FilterType.MarketLotSize;
  minQty: string;
  maxQty: string;
  stepSize: string;
}

export interface MaxNumOrdersFilter {
  filterType: FilterType.MaxNumOrders;
  limit: number;
}

export interface MaxNumAlgoOrdersFilter {
  filterType: FilterType.MaxNumAlgoOrders;
  limit: number;
}

export interface PercentPriceFilter {
  filterType: FilterType.PercentPrice;
  multiplierUp: string;
  multiplierDown: string;
  multiplierDecimal: number;
}

export interface MinNotionalFilter {
  filterType: FilterType.MinNotional;
  notional: string;
}

export type SymbolFilter =
  | PriceFilter
  | LotSizeFilter
  | MarketLotSizeFilter
  | MaxNumOrdersFilter
  | MaxNumAlgoOrdersFilter
  | PercentPriceFilter
  | MinNotionalFilter;

export enum TradingMode {
  Real = "REAL",
  Demo = "DEMO",
}

export interface Position {
  id: string;
  fundingAmount: number;
  symbol: string;
  size: number;
  entryPrice: number;
  liqPrice: number;
}
