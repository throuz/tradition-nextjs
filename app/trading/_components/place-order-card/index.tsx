"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PlaceOrderForm } from "./place-order-form";

export default function PlaceOrderCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <PlaceOrderForm />
      </CardContent>
    </Card>
  );
}
