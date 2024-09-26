import React from "react";

import OrderEntry from "./_components/order-entry";
import SymbolDataDisplay from "./_components/symbol-data-display";
import UserPortfolio from "./_components/user-portfolio";

export default function Trading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">
      <div className="col-span-4 lg:col-span-2">
        <SymbolDataDisplay />
      </div>
      <div className="col-span-4 lg:col-span-1">
        <OrderEntry />
      </div>
      <div className="col-span-4">
        <UserPortfolio />
      </div>
    </div>
  );
}
