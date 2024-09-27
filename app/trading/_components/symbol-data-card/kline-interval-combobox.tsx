import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { KlineInterval } from "@/lib/types";
import { cn } from "@/lib/utils";

import { useKlineStore } from "../../_providers/kline-store-providers";

export function KlineIntervalCombobox() {
  const intervals = Object.values(KlineInterval);
  const { interval, setInterval } = useKlineStore((state) => state);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex gap-2 items-center">
      <div>Kline Interval</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100px] justify-between"
          >
            {interval || "Select interval"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[100px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No interval found.</CommandEmpty>
              <CommandGroup>
                {intervals.map((klineInterval) => (
                  <CommandItem
                    key={klineInterval}
                    value={klineInterval}
                    onSelect={() => {
                      setInterval(klineInterval);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        interval === klineInterval ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {klineInterval}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
