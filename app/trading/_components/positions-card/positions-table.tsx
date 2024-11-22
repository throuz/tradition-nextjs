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
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position) => {
          const {
            id,
            orderSide,
            fundingAmount,
            symbol,
            size,
            entryPrice,
            liqPrice,
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
            size *
            (orderSide === OrderSide.Buy ? 1 : -1);
          const roi = (pnl / fundingAmount) * 100;

          return (
            <TableRow key={id}>
              <TableCell className="font-medium text-center">
                {symbol}
              </TableCell>
              <TableCell className="text-center">
                {orderSideMap[orderSide]}
              </TableCell>
              <TableCell className="text-center">
                {size.toLocaleString(undefined, {
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
                className={`text-center ${
                  pnl >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)} ({roi.toFixed(2)}%)
              </TableCell>
              <TableCell className="text-center">
                ${liqPrice.toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
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
