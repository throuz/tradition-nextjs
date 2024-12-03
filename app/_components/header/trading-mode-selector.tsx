"use client";

import React from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGlobalStore from "@/lib/hooks/use-global-store";
import { TradingMode } from "@/lib/types";

export function TradingModeSelector() {
  const { tradingMode, updateTradingMode } = useGlobalStore();

  const modes = [
    { label: "Real Mode", value: TradingMode.Real },
    { label: "Demo Mode", value: TradingMode.Demo },
  ];

  return (
    <Tabs
      defaultValue={tradingMode}
      onValueChange={(value) => {
        updateTradingMode(value as TradingMode);
      }}
    >
      <TabsList className="grid w-full grid-cols-2">
        {modes.map(({ label, value }) => (
          <TabsTrigger key={value} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
