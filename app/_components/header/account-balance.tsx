"use client";

import { useAvailableBalance } from "@/lib/hooks/use-available-balance";

export function AccountBalance() {
  const balance = useAvailableBalance();

  return (
    <div className="text-lg font-medium text-primary">
      $ {balance.toFixed(2)}
    </div>
  );
}
