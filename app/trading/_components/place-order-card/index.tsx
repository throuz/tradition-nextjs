import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchExchangeInfo } from "@/lib/api/exchange-info";

import { PlaceOrderCardProvider } from "./context";
import { PlaceOrderForm } from "./place-order-form";

export default async function PlaceOrderCard() {
  const exchangeInfoResponse = await fetchExchangeInfo();

  return (
    <PlaceOrderCardProvider exchangeInfoResponse={exchangeInfoResponse}>
      <Card>
        <CardHeader>
          <CardTitle>Place Order</CardTitle>
        </CardHeader>
        <CardContent>
          <PlaceOrderForm />
        </CardContent>
      </Card>
    </PlaceOrderCardProvider>
  );
}
