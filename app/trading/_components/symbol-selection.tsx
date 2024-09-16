import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSymbols } from "../_hooks/useSymbols";
import { useKlineStore } from "../_providers/kline-store-providers";

interface SymbolSelectionProps {
  symbols: string[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export function SymbolSelection() {
  const symbols = useSymbols();
  const { symbol, setSymbol } = useKlineStore((state) => state);

  return (
    <Select onValueChange={setSymbol} value={symbol}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a symbol" />
      </SelectTrigger>
      <SelectContent>
        {symbols.map((symbol) => (
          <SelectItem key={symbol} value={symbol}>
            {symbol}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
