const fetchExchangeInfo = async () => {
  const response = await fetch(
    "https://fapi.binance.com/fapi/v1/exchangeInfo",
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error("Failed to fetch exchange information");
  return response.json();
};

const fetchTicker24hr = async (symbol) => {
  const url = symbol
    ? `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`
    : `https://fapi.binance.com/fapi/v1/ticker/24hr`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch 24hr ticker");
  return response.json();
};

const test = async () => {
  const [exchangeInfoResponse, ticker24hrResponse] = await Promise.all([
    fetchExchangeInfo(),
    fetchTicker24hr(),
  ]);

  console.log(
    exchangeInfoResponse.symbols
      .filter(
        (symbolInfo) =>
          symbolInfo.contractType === "PERPETUAL" &&
          symbolInfo.status === "TRADING" &&
          symbolInfo.quoteAsset === "USDT"
      )
      .map((symbolInfo) => symbolInfo.symbol).length
  );

  console.log(
    "exchangeInfoResponse",
    exchangeInfoResponse.symbols.length,
    exchangeInfoResponse.symbols.map((symbolInfo) => symbolInfo.symbol)
  );
  console.log(
    "ticker24hrResponse",
    ticker24hrResponse.length,
    ticker24hrResponse.map((ticker24hr) => ticker24hr.symbol)
  );
};

test();
