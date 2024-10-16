"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

export function KlineIntervalCombobox() {
  const intervals = Object.values(KlineInterval);
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

  const interval = searchParams.get("interval");

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
                    onSelect={(value) => {
                      router.push(
                        pathname + "?" + createQueryString("interval", value)
                      );
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
