"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z, ZodIssueCode } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fetchTicker } from "@/lib/api/ticker";
import { useGlobalStore } from "@/lib/hooks/use-global-store";
import { OrderSide, Position } from "@/lib/types";

import usePriceDecimalDigits from "./use-price-decimal-digits";

interface TPSLButtonProps {
  position: Position;
}

const TPSLButton = ({ position }: TPSLButtonProps) => {
  const [open, setOpen] = useState(false);
  const { updatePosition } = useGlobalStore();
  const priceDecimalDigits = usePriceDecimalDigits(position.symbol);

  const formSchema = z
    .object({
      takeProfitPrice: z.preprocess(
        (val) => (val ? Number(val) : undefined),
        z
          .number()
          .positive({ message: "Take Profit Price must be positive" })
          .refine(
            (value) => Number(value.toFixed(priceDecimalDigits)) === value,
            {
              message: `Take Profit Price can have at most ${priceDecimalDigits} decimal places`,
            }
          )
          .optional()
      ),
      stopLossPrice: z.preprocess(
        (val) => (val ? Number(val) : undefined),
        z
          .number()
          .positive({ message: "Stop Loss Price must be positive" })
          .refine(
            (value) => Number(value.toFixed(priceDecimalDigits)) === value,
            {
              message: `Stop Loss Price can have at most ${priceDecimalDigits} decimal places`,
            }
          )
          .optional()
      ),
    })
    .superRefine(async (values, ctx) => {
      const { symbol, orderSide } = position;
      const { takeProfitPrice, stopLossPrice } = values;
      try {
        if (takeProfitPrice || stopLossPrice) {
          const tickerResponse = await fetchTicker(symbol);
          const latestPrice = Number(tickerResponse.price);
          if (orderSide === OrderSide.Buy) {
            if (takeProfitPrice && takeProfitPrice <= latestPrice) {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                path: ["takeProfitPrice"],
                message: `Take Profit Price must be greater than ${latestPrice}`,
              });
            }
            if (stopLossPrice && stopLossPrice >= latestPrice) {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                path: ["stopLossPrice"],
                message: `Stop Loss Price must be less than ${latestPrice}`,
              });
            }
          }
          if (orderSide === OrderSide.Sell) {
            if (takeProfitPrice && takeProfitPrice >= latestPrice) {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                path: ["takeProfitPrice"],
                message: `Take Profit Price must be less than ${latestPrice}`,
              });
            }
            if (stopLossPrice && stopLossPrice <= latestPrice) {
              ctx.addIssue({
                code: ZodIssueCode.custom,
                path: ["stopLossPrice"],
                message: `Stop Loss Price must be greater than ${latestPrice}`,
              });
            }
          }
        }
      } catch (error) {
        if (takeProfitPrice) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["takeProfitPrice"],
            message: (error as Error).message,
          });
        }
        if (stopLossPrice) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["stopLossPrice"],
            message: (error as Error).message,
          });
        }
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      takeProfitPrice: position.takeProfitPrice,
      stopLossPrice: position.stopLossPrice,
    },
  });

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof formSchema>) => {
      try {
        updatePosition(position.id, values);
        toast.success(`TP/SL updated: ${JSON.stringify(values)}`);
        form.reset();
        setOpen(false);
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Set TP/SL</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Set Take Profit / Stop Loss</DialogTitle>
              <DialogDescription>
                Adjust the Take Profit and Stop Loss levels for this position.
              </DialogDescription>
            </DialogHeader>
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
                      className={fieldState.invalid ? "border-error" : ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={fieldState.invalid ? "text-error" : ""}
                  />
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
                      className={fieldState.invalid ? "border-error" : ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage
                    className={fieldState.invalid ? "text-error" : ""}
                  />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <div className="text-red-500 mb-4">
                {form.formState.errors.root.message}
              </div>
            )}
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TPSLButton;
