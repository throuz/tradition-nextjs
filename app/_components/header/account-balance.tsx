"use client";

import { useAvailableBalance } from "@/lib/hooks/use-available-balance";

export function AccountBalance() {
  const availableBalance = useAvailableBalance();

  return (
    <div className="text-lg font-medium text-primary">
      $ {availableBalance.toFixed(2)}
    </div>
  );
}
