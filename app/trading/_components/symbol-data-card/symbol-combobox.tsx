"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { useSymbolDataCardContext } from "../../_contexts/symbol-data-card-context";

function useSymbols() {
  const { exchangeInfoResponse } = useSymbolDataCardContext();

  const symbols = React.useMemo(() => {
    return exchangeInfoResponse.symbols
      .filter(
        (symbolInfo) =>
          symbolInfo.contractType === "PERPETUAL" &&
          symbolInfo.status === "TRADING" &&
          symbolInfo.quoteAsset === "USDT"
      )
      .map((symbolInfo) => symbolInfo.symbol);
  }, [exchangeInfoResponse]);

  return symbols;
}

export function SymbolCombobox() {
  const symbols = useSymbols();
  const [open, setOpen] = React.useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const symbol = searchParams.get("symbol");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between text-2xl font-semibold"
        >
          {symbol || "Select a symbol"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search symbol..." />
          <CommandList>
            <CommandEmpty>No symbol found.</CommandEmpty>
            <CommandGroup>
              {symbols.map((symbolItem) => (
                <CommandItem
                  key={symbolItem}
                  value={symbolItem}
                  onSelect={(value) => {
                    router.push(
                      pathname + "?" + createQueryString("symbol", value)
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      symbol === symbolItem ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {symbolItem}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
