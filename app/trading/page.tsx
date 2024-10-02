import React from "react";

import PlaceOrderCard from "./_components/place-order-card";
import PositionsCard from "./_components/positions-card";
import SymbolDataCard from "./_components/symbol-data-card";

export default function Trading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
      <div className="col-span-4 lg:col-span-3">
        <SymbolDataCard />
      </div>
      <div className="col-span-4 lg:col-span-1">
        <PlaceOrderCard />
      </div>
      <div className="col-span-4">
        <PositionsCard />
      </div>
    </div>
  );
}
