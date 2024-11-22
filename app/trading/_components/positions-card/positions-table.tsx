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
import { OrderSide, Position } from "@/lib/types";

// Sample positions data
const positions: Position[] = [
  {
    id: "1",
    orderSide: OrderSide.Buy,
    fundingAmount: 1000,
    symbol: "BTCUSDT",
    size: 0.5,
    entryPrice: 30000,
    liqPrice: 25000,
  },
  {
    id: "2",
    orderSide: OrderSide.Sell,
    fundingAmount: 5000,
    symbol: "ETHUSDT",
    size: 10,
    entryPrice: 1500,
    liqPrice: 1200,
  },
  {
    id: "3",
    orderSide: OrderSide.Buy,
    fundingAmount: 250,
    symbol: "XRPUSDT",
    size: 500,
    entryPrice: 0.5,
    liqPrice: 0.3,
  },
];

export function PositionsTable() {
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
          // Placeholder for last price (replace with real data source)
          const lastPrice =
            position.entryPrice * (position.orderSide === "BUY" ? 1.05 : 0.95);
          const pnl =
            (lastPrice - position.entryPrice) *
            position.size *
            (position.orderSide === "BUY" ? 1 : -1);
          const roi =
            (lastPrice / position.entryPrice - 1) *
            100 *
            (position.orderSide === "BUY" ? 1 : -1);

          return (
            <TableRow key={position.id}>
              <TableCell className="font-medium text-center">
                {position.symbol}
              </TableCell>
              <TableCell className="text-center">
                {position.orderSide === "BUY" ? "Buy" : "Sell"}
              </TableCell>
              <TableCell className="text-center">
                {position.size.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}{" "}
                {position.symbol.replace(/USDT$/, "")}
              </TableCell>
              <TableCell className="text-center">
                ${position.entryPrice.toLocaleString()}
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
                ${position.liqPrice.toLocaleString()}
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
