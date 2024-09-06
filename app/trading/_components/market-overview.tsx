"use client";

import React, { useState } from "react";
import ChartComponent from "./market-overview-chart";
import TimeIntervalDropdown from "./time-interval-dropdown";
import { TimeInterval } from "../_types";
import { TimeIntervalSelection } from "./time-interval-selection";
import { SymbolSelection } from "./symbol-selection";
import useKlineData from "../_hooks/useKlineData";
import useKlineDataStream, {
  KlineStreamData,
} from "../_hooks/useKlineDataStream";
import { BarData, Time, UTCTimestamp } from "lightweight-charts";

const symbols = ["btcusdt", "ETHUSDT", "BNBUSDT"]; // Updated format

export default function MarketOverview() {
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>(
    TimeInterval.OneDay
  );
  const { data, isLoading, isError, isSuccess } = useKlineData({
    symbol: selectedSymbol,
    interval: selectedInterval,
  });

  const {
    data: streamData,
    error: streamError,
    loading: streamLoading,
  } = useKlineDataStream({
    symbol: selectedSymbol,
    interval: selectedInterval,
  });

  function convertKlineStreamDataToBarData(
    klineStreamData: KlineStreamData
  ): BarData {
    const { T, o, h, l, c } = klineStreamData.k;

    const barData: BarData = {
      time: (T / 1000) as Time,
      open: parseFloat(o),
      high: parseFloat(h),
      low: parseFloat(l),
      close: parseFloat(c),
    };

    return barData;
  }

  return (
    <div className="bg-card rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">BTC/USD</h2>
      <div className="text-4xl font-bold mb-2">$42,000</div>
      <p className="text-muted-foreground">24h Change: +3.25%</p>
      <SymbolSelection
        symbols={symbols}
        selectedSymbol={selectedSymbol}
        onSelectSymbol={setSelectedSymbol}
      />
      <TimeIntervalSelection
        selectedInterval={selectedInterval}
        onSelectInterval={setSelectedInterval}
      />
      <TimeIntervalDropdown />
      {isLoading && <div className="text-center text-gray-500">Loading...</div>}
      {isError && (
        <div className="text-center text-red-500">Error loading data</div>
      )}
      {isSuccess && (
        <ChartComponent
          data={data.map((klineData) => ({
            time: (klineData.closeTime / 1000) as UTCTimestamp,
            open: Number(klineData.open),
            high: Number(klineData.high),
            low: Number(klineData.low),
            close: Number(klineData.close),
          }))}
          updateData={
            streamData
              ? convertKlineStreamDataToBarData(streamData)
              : streamData
          }
        />
      )}
    </div>
  );
}
