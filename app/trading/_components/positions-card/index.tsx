import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchExchangeInfo } from "@/lib/api/exchange-info";

import ClosedPositionsTable from "./closed-positions-table";
import { PositionsCardProvider } from "./context";
import OpenPositionsTable from "./open-positions-table";

enum PositionTabKey {
  OpenPositions = "OPEN_POSITIONS",
  ClosedPositions = "CLOSED_POSITIONS",
}

export default async function PositionsCard() {
  const exchangeInfoResponse = await fetchExchangeInfo();

  return (
    <PositionsCardProvider exchangeInfoResponse={exchangeInfoResponse}>
      <Tabs defaultValue={PositionTabKey.OpenPositions}>
        <Card>
          <CardHeader className="flex-row items-center gap-4">
            <CardTitle>Positions</CardTitle>
            <TabsList style={{ margin: 0 }}>
              <TabsTrigger
                value={PositionTabKey.OpenPositions}
                className="text-lg font-semibold leading-none tracking-tight"
              >
                Open Positions
              </TabsTrigger>
              <TabsTrigger
                value={PositionTabKey.ClosedPositions}
                className="text-lg font-semibold leading-none tracking-tight"
              >
                Closed Positions
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value={PositionTabKey.OpenPositions}>
              <OpenPositionsTable />
            </TabsContent>
            <TabsContent value={PositionTabKey.ClosedPositions}>
              <ClosedPositionsTable />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </PositionsCardProvider>
  );
}
