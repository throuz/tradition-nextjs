import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchExchangeInfo } from "@/lib/api/exchange-info";

import { PositionsCardProvider } from "./context";
import { PositionsTable } from "./positions-table";

export default async function PositionsCard() {
  const exchangeInfoResponse = await fetchExchangeInfo();

  return (
    <PositionsCardProvider exchangeInfoResponse={exchangeInfoResponse}>
      <Card>
        <CardHeader>
          <CardTitle>Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <PositionsTable />
        </CardContent>
      </Card>
    </PositionsCardProvider>
  );
}
