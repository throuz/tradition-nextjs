"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { DataTable } from "@/components/ui/data-table";
import useDemoAccountStore from "@/lib/stores/use-demo-account-store";
import useLastPriceStream from "@/lib/streams/use-last-price-stream";
import { OrderSide, Position, PositionStatus } from "@/lib/types";
import { calculatePnl, cn } from "@/lib/utils";

import ClosePositionButton from "./close-position-button";
import RiskManagementTrigger from "./risk-management-trigger";
import SetTPSLDialogButton from "./set-tpsl-dialog-button";

const LastPriceCell = ({ symbol }: { symbol: string }) => {
  const lastPriceStream = useLastPriceStream(symbol);
  if (lastPriceStream) {
    return `$${Number(lastPriceStream)}`;
  }
  return "-";
};

const PnlRoiCell = ({ position }: { position: Position }) => {
  const { symbol, entryPrice, size, side, initialMargin } = position;
  const lastPriceStream = useLastPriceStream(symbol);

  if (!lastPriceStream) {
    return "-";
  }

  const pnl = calculatePnl({
    lastPrice: Number(lastPriceStream),
    entryPrice: entryPrice,
    size: size,
    side: side,
  });
  const roi = Number(((pnl / initialMargin) * 100).toFixed(2));
  const formattedPnl = `${pnl >= 0 ? "+" : "-"}$${Math.abs(pnl)}`;
  const formattedRoi = `${roi >= 0 ? "+" : "-"}${Math.abs(roi)}%`;

  return (
    <div
      className={cn(pnl >= 0 ? "text-green-500" : "text-red-500")}
    >{`${formattedPnl} (${formattedRoi})`}</div>
  );
};

const columns: ColumnDef<Position>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: (props) => props.getValue<string>(),
  },
  {
    accessorKey: "side",
    header: "Side",
    cell: (props) => {
      const side = props.getValue<OrderSide>();
      const orderSideMap: Record<OrderSide, string> = {
        [OrderSide.Buy]: "Buy",
        [OrderSide.Sell]: "Sell",
      };
      return (
        <div
          className={cn(
            side === OrderSide.Buy && "text-green-500",
            side === OrderSide.Sell && "text-red-500"
          )}
        >
          {orderSideMap[side]}
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: (props) => {
      const size = props.getValue<number>();
      const symbol = props.row.getValue<string>("symbol");
      const formatedSymbol = symbol.replace(/USDT$/, "");
      return `${size} ${formatedSymbol}`;
    },
  },
  {
    accessorKey: "entryPrice",
    header: "Entry Price",
    cell: (props) => `$${props.getValue<number>()}`,
  },
  {
    id: "lastPrice",
    header: "Last Price",
    cell: (props) => (
      <LastPriceCell symbol={props.row.getValue<string>("symbol")} />
    ),
  },
  {
    id: "pnl",
    header: "PNL (ROI %)",
    cell: (props) => <PnlRoiCell position={props.row.original} />,
  },
  {
    accessorKey: "leverage",
    header: "Leverage",
    cell: (props) => props.getValue<number>(),
  },
  {
    accessorKey: "initialMargin",
    header: "Initial Margin",
    cell: (props) => `$${props.getValue<number>()}`,
  },
  {
    accessorKey: "liquidationPrice",
    header: "Liq. Price",
    cell: (props) => `$${props.getValue<number>()}`,
  },
  {
    accessorKey: "takeProfitPrice",
    header: "Take Profit",
    cell: (props) =>
      props.getValue<number>() ? `$${props.getValue<number>()}` : "-",
  },
  {
    accessorKey: "stopLossPrice",
    header: "Stop Loss",
    cell: (props) =>
      props.getValue<number>() ? `$${props.getValue<number>()}` : "-",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (props) =>
      format(new Date(props.getValue<number>()), "yyyy-MM-dd HH:mm:ss"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: (props) => (
      <div className="flex gap-2 justify-center">
        <SetTPSLDialogButton position={props.row.original} />
        <ClosePositionButton position={props.row.original} />
      </div>
    ),
  },
];

const OpenPositionsTable = () => {
  const demoAccountPositions = useDemoAccountStore((state) => state.positions);

  const data = demoAccountPositions
    .filter((position) => position.status === PositionStatus.Open)
    .sort((a, b) => b.createdAt - a.createdAt);

  const riskManagementTriggers = data.map((position) => (
    <RiskManagementTrigger key={position.id} position={position} />
  ));

  return (
    <>
      {riskManagementTriggers}
      <DataTable data={data} columns={columns} />
    </>
  );
};

export default OpenPositionsTable;
