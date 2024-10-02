"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PositionsTable } from "./positions-table";

export default function PositionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <PositionsTable />
      </CardContent>
    </Card>
  );
}
