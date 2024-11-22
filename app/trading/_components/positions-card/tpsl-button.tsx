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
import { useGlobalStore } from "@/lib/hooks/use-global-store";
import { OrderSide, Position } from "@/lib/types";

interface TPSLButtonProps {
  position: Position;
}

const TPSLButton = ({ position }: TPSLButtonProps) => {
  const { updatePosition } = useGlobalStore();
  const [open, setOpen] = useState(false);
  const [takeProfitPrice, setTakeProfitPrice] = useState<string>(
    position.takeProfitPrice ? position.takeProfitPrice.toString() : ""
  );
  const [stopLossPrice, setStopLossPrice] = useState<string>(
    position.stopLossPrice ? position.stopLossPrice.toString() : ""
  );

  const { id, orderSide, entryPrice } = position;

  const handleSave = () => {
    const tp = Number(takeProfitPrice);
    const sl = Number(stopLossPrice);

    // Validation based on Order Side
    if (orderSide === OrderSide.Buy) {
      if (tp <= entryPrice || sl >= entryPrice) {
        toast.error(
          "For Buy positions: Take Profit must be > Entry Price, Stop Loss must be < Entry Price."
        );
        return;
      }
    } else if (orderSide === OrderSide.Sell) {
      if (tp >= entryPrice || sl <= entryPrice) {
        toast.error(
          "For Sell positions: Take Profit must be < Entry Price, Stop Loss must be > Entry Price."
        );
        return;
      }
    }

    // Validate TP/SL values
    if (tp <= 0 || sl <= 0 || isNaN(tp) || isNaN(sl)) {
      toast.error("Please enter valid values for TP and SL.");
      return;
    }

    // Update Position
    updatePosition(id, { takeProfitPrice: tp, stopLossPrice: sl });
    toast.success("Take Profit and Stop Loss updated!");

    // Close Dialog and Reset State
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Set TP/SL</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Take Profit / Stop Loss</DialogTitle>
          <DialogDescription>
            Adjust the Take Profit and Stop Loss levels for this position.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="takeProfit" className="text-right">
              Take Profit
            </Label>
            <Input
              id="takeProfit"
              type="number"
              value={takeProfitPrice}
              onChange={(e) => setTakeProfitPrice(e.target.value)}
              placeholder="Enter TP price"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stopLoss" className="text-right">
              Stop Loss
            </Label>
            <Input
              id="stopLoss"
              type="number"
              value={stopLossPrice}
              onChange={(e) => setStopLossPrice(e.target.value)}
              placeholder="Enter SL price"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TPSLButton;
