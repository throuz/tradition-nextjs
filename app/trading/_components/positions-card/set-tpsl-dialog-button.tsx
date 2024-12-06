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
import useDemoAccountStore from "@/lib/stores/use-demo-account-store";
import { OrderSide, Position } from "@/lib/types";
import { calculateLiqPrice } from "@/lib/utils";

import usePriceDecimalDigits from "./use-price-decimal-digits";

interface SetTPSLDialogButtonProps {
  position: Position;
}

const SetTPSLDialogButton = ({ position }: SetTPSLDialogButtonProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const demoAccountUpdatePosition = useDemoAccountStore(
    (state) => state.updatePosition
  );
  const priceDecimalDigits = usePriceDecimalDigits(position.symbol);

  const formSchema = z
    .object({
      takeProfitPrice: z.preprocess(
        (val) => (val ? Number(val) : undefined),
        z
          .number()
          .min(0.00000001, {
            message: "Take Profit Price must be at least 0.00000001",
          })
          .max(10000000, {
            message: "Take Profit Price cannot exceed 10000000",
          })
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
          .min(0.00000001, {
            message: "Stop Loss Price must be at least 0.00000001",
          })
          .max(10000000, {
            message: "Stop Loss Price cannot exceed 10000000",
          })
          .refine(
            (value) => Number(value.toFixed(priceDecimalDigits)) === value,
            {
              message: `Stop Loss Price can have at most ${priceDecimalDigits} decimal places`,
            }
          )
          .optional()
      ),
    })
    .superRefine((values, ctx) => {
      const { side, leverage, entryPrice } = position;
      const { takeProfitPrice, stopLossPrice } = values;
      const liquidationPrice = calculateLiqPrice({
        orderSide: side,
        leverage,
        entryPrice,
      });
      if (takeProfitPrice || stopLossPrice) {
        if (side === OrderSide.Buy) {
          if (takeProfitPrice && takeProfitPrice <= entryPrice) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              path: ["takeProfitPrice"],
              message: `Take Profit Price must be greater than ${entryPrice}`,
            });
          }
          if (stopLossPrice && stopLossPrice >= entryPrice) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              path: ["stopLossPrice"],
              message: `Stop Loss Price must be less than ${entryPrice}`,
            });
          }
          if (stopLossPrice && stopLossPrice <= liquidationPrice) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              path: ["stopLossPrice"],
              message: `Stop Loss Price must be greater than ${liquidationPrice.toFixed(
                priceDecimalDigits
              )}`,
            });
          }
        }
        if (side === OrderSide.Sell) {
          if (takeProfitPrice && takeProfitPrice >= entryPrice) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              path: ["takeProfitPrice"],
              message: `Take Profit Price must be less than ${entryPrice}`,
            });
          }
          if (stopLossPrice && stopLossPrice <= entryPrice) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              path: ["stopLossPrice"],
              message: `Stop Loss Price must be greater than ${entryPrice}`,
            });
          }
          if (stopLossPrice && stopLossPrice >= liquidationPrice) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              path: ["stopLossPrice"],
              message: `Stop Loss Price must be less than ${liquidationPrice.toFixed(
                priceDecimalDigits
              )}`,
            });
          }
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
        demoAccountUpdatePosition(position.id, values);
        toast.success(`TP/SL updated: ${JSON.stringify(values)}`);
        setDialogOpen(false);
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
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

export default SetTPSLDialogButton;
