import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchExchangeInfo } from "@/lib/api/exchange-info";
import { fetchKlines } from "@/lib/api/klines";
import { KlineInterval } from "@/lib/types";

import { SymbolDataCardProvider } from "../../_contexts/symbol-data-card-context";

import { KlineChart } from "./kline-chart";
import { KlineIntervalCombobox } from "./kline-interval-combobox";
import { SymbolTicker } from "./symbol-ticker";

export default async function SymbolDataCard({
  symbol,
  interval,
}: {
  symbol: string;
  interval: KlineInterval;
}) {
  const [klinesResponse, exchangeInfoResponse] = await Promise.all([
    fetchKlines({ symbol, interval }),
    fetchExchangeInfo(),
  ]);

  return (
    <SymbolDataCardProvider
      klinesResponse={klinesResponse}
      exchangeInfoResponse={exchangeInfoResponse}
    >
      <Card>
        <CardHeader>
          <SymbolTicker />
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <KlineIntervalCombobox />
          </div>
          <KlineChart />
        </CardContent>
      </Card>
    </SymbolDataCardProvider>
  );
}
