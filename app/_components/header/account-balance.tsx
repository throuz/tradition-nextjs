"use client";

import useBalance from "@/lib/hooks/use-balance";

export function AccountBalance() {
  const balance = useBalance();

  return (
    <div className="text-lg font-medium text-primary">
      $ {balance.toFixed(2)}
    </div>
  );
}
