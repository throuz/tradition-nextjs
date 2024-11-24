"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGlobalStore } from "@/lib/hooks/use-global-store";
import { OrderSide } from "@/lib/types";
import { cn } from "@/lib/utils";

import TPSLButton from "./tpsl-button";

export function PositionsTable() {
  const { positions } = useGlobalStore();

  return (
    <Table>
      <TableCaption>Your open trading positions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Symbol</TableHead>
          <TableHead className="text-center">Side</TableHead>
          <TableHead className="text-center">Size</TableHead>
          <TableHead className="text-center">Entry Price</TableHead>
          <TableHead className="text-center">Last Price</TableHead>
          <TableHead className="text-center">PNL (ROI %)</TableHead>
          <TableHead className="text-center">Liq. Price</TableHead>
          <TableHead className="text-center">Take Profit</TableHead>
          <TableHead className="text-center">Stop Loss</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position) => {
          const {
            id,
            side,
            symbol,
            positionSize,
            entryPrice,
            liquidationPrice,
            takeProfitPrice,
            stopLossPrice,
          } = position;

          const orderSideMap: Record<OrderSide, string> = {
            [OrderSide.Buy]: "Buy",
            [OrderSide.Sell]: "Sell",
          };

          // Placeholder for last price (replace with real data source)
          const lastPrice = entryPrice * (1 + (Math.random() * 0.02 - 0.01));
          const pnl =
            (lastPrice - entryPrice) *
            positionSize *
            (side === OrderSide.Buy ? 1 : -1);
          const roi = (pnl / positionSize) * 100;
          const formattedPnl = `${pnl >= 0 ? "+" : "-"}$${Math.abs(pnl).toFixed(
            2
          )}`;
          const formattedRoi = `${roi >= 0 ? "+" : "-"}${Math.abs(roi).toFixed(
            2
          )}%`;
          const pnlroi = `${formattedPnl} (${formattedRoi})`;

          return (
            <TableRow key={id}>
              <TableCell className="font-medium text-center">
                {symbol}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  side === OrderSide.Buy && "text-green-500",
                  side === OrderSide.Sell && "text-red-500"
                )}
              >
                {orderSideMap[side]}
              </TableCell>
              <TableCell className="text-center">
                {positionSize.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}{" "}
                {symbol.replace(/USDT$/, "")}
              </TableCell>
              <TableCell className="text-center">
                ${entryPrice.toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                ${lastPrice.toLocaleString()}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  pnl >= 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {pnlroi}
              </TableCell>
              <TableCell className="text-center">
                ${liquidationPrice.toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                {takeProfitPrice ? `$${takeProfitPrice.toLocaleString()}` : "-"}
              </TableCell>
              <TableCell className="text-center">
                {stopLossPrice ? `$${stopLossPrice.toLocaleString()}` : "-"}
              </TableCell>
              <TableCell className="flex gap-2 justify-center">
                <TPSLButton position={position} />
                <Button variant="destructive" className="bg-red-700">
                  Close
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
