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

const positions = [
  {
    symbol: "BTCUSDT",
    size: "0.5 BTC",
    entryPrice: "$30,000",
    lastPrice: "$32,000",
    pnl: "+$1,000 (5%)",
    liqPrice: "$25,000",
  },
  {
    symbol: "ETHUSDT",
    size: "10 ETH",
    entryPrice: "$1,500",
    lastPrice: "$1,700",
    pnl: "+$2,000 (13%)",
    liqPrice: "$1,200",
  },
  {
    symbol: "XRPUSDT",
    size: "500 XRP",
    entryPrice: "$0.50",
    lastPrice: "$0.48",
    pnl: "-$10 (-4%)",
    liqPrice: "$0.30",
  },
];

export function PositionsTable() {
  return (
    <Table>
      <TableCaption>Your open trading positions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Symbol</TableHead>
          <TableHead className="text-center">Size</TableHead>
          <TableHead className="text-center">Entry Price</TableHead>
          <TableHead className="text-center">Last Price</TableHead>
          <TableHead className="text-center">PNL (ROI %)</TableHead>
          <TableHead className="text-center">Liq. Price</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position) => (
          <TableRow key={position.symbol}>
            <TableCell className="font-medium text-center">
              {position.symbol}
            </TableCell>
            <TableCell className="text-center">{position.size}</TableCell>
            <TableCell className="text-center">{position.entryPrice}</TableCell>
            <TableCell className="text-center">{position.lastPrice}</TableCell>
            <TableCell className="text-center">{position.pnl}</TableCell>
            <TableCell className="text-center">{position.liqPrice}</TableCell>
            <TableCell className="text-center">
              <Button variant="destructive" className="bg-red-700">
                Close
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
