"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import useGlobalStore from "@/lib/stores/use-global-store";
import { TradingMode } from "@/lib/types";

export function TradingModeButtons() {
  const tradingMode = useGlobalStore((state) => state.tradingMode);
  const updateTradingMode = useGlobalStore((state) => state.updateTradingMode);

  const modes = [
    { label: "Real", value: TradingMode.Real },
    { label: "Demo", value: TradingMode.Demo },
  ];

  return (
    <div className="flex space-x-2">
      {modes.map(({ label, value }) => (
        <Button
          key={value}
          type="button"
          variant={tradingMode === value ? "default" : "secondary"}
          onClick={() => updateTradingMode(value)}
          aria-pressed={tradingMode === value}
          className="w-full"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
