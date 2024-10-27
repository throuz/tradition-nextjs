import React, { Suspense } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchExchangeInfo } from "@/lib/api/exchange-info";
import { fetchKlines } from "@/lib/api/klines";
import { fetchTicker24hr, Ticker24hrResponse } from "@/lib/api/ticker24hr";
import { KlineInterval } from "@/lib/types";

import { SymbolDataCardProvider } from "../../_contexts/symbol-data-card-context";

import { KlineChart } from "./kline-chart";
import { KlineIntervalCombobox } from "./kline-interval-combobox";
import { SymbolTicker } from "./symbol-ticker";

async function SymbolDataCardContent({
  symbol,
  interval,
}: {
  symbol: string;
  interval: KlineInterval;
}) {
  const [klinesResponse, exchangeInfoResponse, ticker24hrResponse] =
    await Promise.all([
      fetchKlines({ symbol, interval, limit: 1500 }),
      fetchExchangeInfo(),
      fetchTicker24hr(symbol),
    ]);

  return (
    <SymbolDataCardProvider
      klinesResponse={klinesResponse}
      exchangeInfoResponse={exchangeInfoResponse}
      ticker24hrResponse={ticker24hrResponse as Ticker24hrResponse}
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

function SymbolDataCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <Skeleton className="h-10 w-[150px] lg:w-[200px] rounded-md" />
          <Skeleton className="h-8 w-[100px] lg:w-[150px]" />
          <Skeleton className="h-6 w-[80px] lg:w-[100px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-10 w-[80px] rounded-md" />
        </div>
        <div className="relative w-full h-[500px]">
          <Skeleton className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function SymbolDataCard({
  symbol,
  interval,
}: {
  symbol: string;
  interval: KlineInterval;
}) {
  return (
    <Suspense key={symbol + interval} fallback={<SymbolDataCardSkeleton />}>
      <SymbolDataCardContent symbol={symbol} interval={interval} />
    </Suspense>
  );
}
