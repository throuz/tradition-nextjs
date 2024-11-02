"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

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
import { fetchTicker, TickerResponse } from "@/lib/api/ticker";
import { OrderSide } from "@/lib/types";

import { TradingModeButtons } from "./trading-mode-buttons";
import { useAvailableBalance } from "./use-available-balance";
import { usePriceDecimalDigits } from "./use-price-decimal-digits";

const validateTPSL = (
  orderSide: OrderSide,
  latestPrice: number,
  takeProfitPrice?: number,
  stopLossPrice?: number
): { takeProfitPrice?: string; stopLossPrice?: string } => {
  const errors: { takeProfitPrice?: string; stopLossPrice?: string } = {};

  if (orderSide === OrderSide.Buy) {
    if (takeProfitPrice !== undefined && takeProfitPrice <= latestPrice) {
      errors.takeProfitPrice = `Take Profit Price must be greater than ${latestPrice}.`;
    }
    if (stopLossPrice !== undefined && stopLossPrice >= latestPrice) {
      errors.stopLossPrice = `Stop Loss Price must be less than ${latestPrice}.`;
    }
  }

  if (orderSide === OrderSide.Sell) {
    if (takeProfitPrice !== undefined && takeProfitPrice >= latestPrice) {
      errors.takeProfitPrice = `Take Profit Price must be less than ${latestPrice}.`;
    }
    if (stopLossPrice !== undefined && stopLossPrice <= latestPrice) {
      errors.stopLossPrice = `Stop Loss Price must be greater than ${latestPrice}.`;
    }
  }

  return errors;
};

export function PlaceOrderForm() {
  const availableBalance = useAvailableBalance();
  const priceDecimalDigits = usePriceDecimalDigits();
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");

  const formSchema = z.object({
    orderSide: z.nativeEnum(OrderSide, {
      errorMap: () => ({ message: "Invalid order side" }),
    }),
    leverage: z
      .number()
      .int({ message: "Leverage must be an integer" })
      .min(1, { message: "Leverage must be at least 1" })
      .max(200, { message: "Leverage cannot exceed 200" }),
    amount: z
      .number()
      .min(0.01, { message: "Amount must be at least 0.01" })
      .max(availableBalance, {
        message: `Amount cannot exceed ${availableBalance}`,
      })
      .refine((value) => Number(value.toFixed(2)) === value, {
        message: "Amount can have at most 2 decimal places",
      }),
    takeProfitPrice: z
      .number()
      .positive()
      .refine((value) => Number(value.toFixed(priceDecimalDigits)) === value, {
        message: `Take Profit Price can have at most ${priceDecimalDigits} decimal places`,
      })
      .optional(),
    stopLossPrice: z
      .number()
      .positive()
      .refine((value) => Number(value.toFixed(priceDecimalDigits)) === value, {
        message: `Stop Loss Price can have at most ${priceDecimalDigits} decimal places`,
      })
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const validateValues = async (
    values: z.infer<typeof formSchema>
  ): Promise<boolean> => {
    try {
      const { price: latestPrice } = (await fetchTicker(
        symbol ?? undefined
      )) as TickerResponse;

      const { orderSide, takeProfitPrice, stopLossPrice } = values;

      const { takeProfitPrice: takeProfitError, stopLossPrice: stopLossError } =
        validateTPSL(
          orderSide,
          Number(latestPrice),
          takeProfitPrice,
          stopLossPrice
        );

      if (takeProfitError) {
        form.setError("takeProfitPrice", { message: takeProfitError });
      }
      if (stopLossError) {
        form.setError("stopLossPrice", { message: stopLossError });
      }

      return !takeProfitError && !stopLossError;
    } catch (error) {
      form.setError("root", { message: "Unknown error" });
      return false;
    }
  };

  const handleOrderPlacement = async (values: z.infer<typeof formSchema>) => {
    const isValid = await validateValues(values);

    if (isValid) {
      toast.success(`Order placed: ${JSON.stringify(values)}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleOrderPlacement)}
        className="space-y-4"
      >
        <FormItem>
          <FormLabel>Trading Mode</FormLabel>
          <TradingModeButtons />
        </FormItem>

        <div>Available Balance: ${availableBalance.toFixed(2)}</div>

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
}
