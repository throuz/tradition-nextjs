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
import useDemoAccountStore from "@/lib/stores/use-demo-account-store";
import useGlobalStore from "@/lib/stores/use-global-store";
import { TradingMode } from "@/lib/types";

export function DepositButton() {
  const demoAccountUpdateBalance = useDemoAccountStore(
    (state) => state.updateBalance
  );
  const tradingMode = useGlobalStore((state) => state.tradingMode);
  const [open, setOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const handleDeposit = () => {
    const amount = Number(depositAmount);

    // Validation
    if (amount <= 0 || isNaN(amount)) {
      toast.error("Please enter a valid deposit amount.");
      return;
    }

    // Demo and Real Mode Handling
    if (tradingMode === TradingMode.Demo) {
      demoAccountUpdateBalance(amount);
      console.log(`Demo mode deposit: ${amount}`);
    } else if (tradingMode === TradingMode.Real) {
      console.log(`Real mode deposit: ${amount}`);
      // Insert real mode deposit handling logic here (e.g., API call)
    }

    // User Feedback
    toast.success(`Deposited: ${depositAmount}`);
    // State Reset
    setDepositAmount("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Deposit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Enter the amount you want to deposit and click confirm.
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
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDeposit}>Confirm Deposit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
