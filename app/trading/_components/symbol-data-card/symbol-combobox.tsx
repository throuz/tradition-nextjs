import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

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

import { useSymbols } from "../../_hooks/useSymbols";
import { useKlineStore } from "../../_providers/kline-store-providers";

export function SymbolCombobox() {
  const symbols = useSymbols();
  const { symbol, setSymbol } = useKlineStore((state) => state);
  const [open, setOpen] = React.useState(false);

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
                  onSelect={() => {
                    setSymbol(symbolItem);
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
