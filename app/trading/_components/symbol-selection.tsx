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

interface SymbolSelectionProps {
  symbols: string[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export function SymbolSelection({
  symbols,
  selectedSymbol,
  onSelectSymbol,
}: SymbolSelectionProps) {
  return (
    <Select onValueChange={onSelectSymbol} value={selectedSymbol}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a symbol" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Symbols</SelectLabel>
          {symbols.map((symbol) => (
            <SelectItem key={symbol} value={symbol}>
              {symbol}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
