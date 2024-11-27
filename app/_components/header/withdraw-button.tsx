"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAvailableBalance } from "@/lib/hooks/use-available-balance";
import useGlobalStore from "@/lib/hooks/use-global-store";
import { TradingMode } from "@/lib/types";

export function WithdrawButton() {
  const { tradingMode, updateBalance } = useGlobalStore();
  const [open, setOpen] = useState(false);
  const availableBalance = useAvailableBalance();

  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);

    if (amount <= 0 || isNaN(amount)) {
      toast.error("Please enter a valid withdrawal amount.");
      return;
    }

    if (amount > availableBalance) {
      toast.error("Insufficient balance for this withdrawal.");
      return;
    }

    if (tradingMode === TradingMode.Demo) {
      updateBalance(-amount);
      console.log(tradingMode);
    } else if (tradingMode === TradingMode.Real) {
      console.log(tradingMode);
      // Add real mode withdrawal handling logic here (e.g., API call)
    }

    toast.success(`Withdrew: ${withdrawAmount}`);
    setWithdrawAmount("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Withdraw</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Enter the amount you want to withdraw and click confirm.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleWithdraw}>Confirm Withdrawal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
