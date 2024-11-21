"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderSide } from "@/lib/types";

import usePlaceOrderForm from "./use-place-order-form";

const PlaceOrderForm = () => {
  const { form, onSubmit } = usePlaceOrderForm();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="orderSide"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className={fieldState.invalid ? "text-error" : ""}>
                Order Side
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={fieldState.invalid ? "border-error" : ""}
                  >
                    {field.value ? (
                      <SelectValue />
                    ) : (
                      <span className="text-muted-foreground">Select side</span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderSide.Buy}>Buy</SelectItem>
                    <SelectItem value={OrderSide.Sell}>Sell</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className={fieldState.invalid ? "text-error" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leverage"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className={fieldState.invalid ? "text-error" : ""}>
                Leverage
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter leverage"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(
                      value === "" ? undefined : Number(event.target.value)
                    );
                  }}
                  className={fieldState.invalid ? "border-error" : ""}
                />
              </FormControl>
              <FormMessage className={fieldState.invalid ? "text-error" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className={fieldState.invalid ? "text-error" : ""}>
                Amount
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(
                      value === "" ? undefined : Number(event.target.value)
                    );
                  }}
                  className={fieldState.invalid ? "border-error" : ""}
                />
              </FormControl>
              <FormMessage className={fieldState.invalid ? "text-error" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="takeProfitPrice"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className={fieldState.invalid ? "text-error" : ""}>
                Take Profit Price (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Set take profit price"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(
                      value === "" ? undefined : Number(event.target.value)
                    );
                  }}
                  className={fieldState.invalid ? "border-error" : ""}
                />
              </FormControl>
              <FormMessage className={fieldState.invalid ? "text-error" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stopLossPrice"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className={fieldState.invalid ? "text-error" : ""}>
                Stop Loss Price (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Set stop loss price"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(
                      value === "" ? undefined : Number(event.target.value)
                    );
                  }}
                  className={fieldState.invalid ? "border-error" : ""}
                />
              </FormControl>
              <FormMessage className={fieldState.invalid ? "text-error" : ""} />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="text-red-500 mb-4">
            {form.formState.errors.root.message}
          </div>
        )}

        <Button type="submit">Place Order</Button>
      </form>
    </Form>
  );
};

export default PlaceOrderForm;
