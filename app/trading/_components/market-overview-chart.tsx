"use client";

import {
  BarData,
  createChart,
  CrosshairMode,
  DeepPartial,
  ISeriesApi,
  LineStyle,
  Time,
  TimeChartOptions,
} from "lightweight-charts";
import React, { useEffect, useMemo, useRef } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKlineStore } from "../_providers/kline-store-providers";
import { useKlinesQuery } from "../_hooks/useKlinesQuery";
import useKlineStream from "../_hooks/useKlineStream";

export default function ChartComponent() {
  const { symbol, interval } = useKlineStore((state) => state);
  const { data, isSuccess } = useKlinesQuery({ symbol, interval });
  const klineStream = useKlineStream(symbol, interval);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<"Candlestick", Time> | null>(null);

  const barDataList = useMemo<BarData[]>(() => {
    if (isSuccess) {
      return data.map((kline) => ({
        time: (kline[6] / 1000) as Time,
        open: Number(kline[1]),
        high: Number(kline[2]),
        low: Number(kline[3]),
        close: Number(kline[4]),
      }));
    }
    return [];
  }, [data, isSuccess]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions: DeepPartial<TimeChartOptions> = {
      layout: {
        background: { color: "#222" },
        textColor: "#C3BCDB",
        fontFamily: "'Roboto', sans-serif",
      },
      grid: {
        vertLines: { color: "#444" },
        horzLines: { color: "#444" },
      },
      height: 500,
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 4,
          color: "#C3BCDB44",
          style: LineStyle.Solid,
          labelBackgroundColor: "#9B7DFF",
        },
        horzLine: {
          color: "#9B7DFF",
          labelBackgroundColor: "#9B7DFF",
        },
      },
    };

    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    chart.priceScale("right").applyOptions({
      borderColor: "#71649C",
    });

    chart.timeScale().applyOptions({
      borderColor: "#71649C",
      barSpacing: 10,
      rightOffset: 20,
      timeVisible: true,
    });

    const lineData = barDataList.map((datapoint) => ({
      time: datapoint.time,
      value: (datapoint.close + datapoint.open) / 2,
    }));

    const areaSeries = chart.addAreaSeries({
      lastValueVisible: false,
      crosshairMarkerVisible: false,
      lineColor: "transparent",
      topColor: "#38216e99",
      bottomColor: "#38216e1a",
    });

    areaSeries.setData(lineData);

    const mainSeries = chart.addCandlestickSeries({
      wickUpColor: "#3674d9",
      upColor: "#3674d9",
      wickDownColor: "#e13255",
      downColor: "#e13255",
      borderVisible: false,
    });

    mainSeries.setData(barDataList);
    mainSeriesRef.current = mainSeries;

    const handleResize = () => {
      chart.resize(
        chartContainerRef.current!.clientWidth,
        chartContainerRef.current!.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [barDataList]);

  useEffect(() => {
    if (klineStream && mainSeriesRef.current) {
      const { T, o, h, l, c } = klineStream.k;
      const barData: BarData = {
        time: (T / 1000) as Time,
        open: Number(o),
        high: Number(h),
        low: Number(l),
        close: Number(c),
      };
      mainSeriesRef.current.update(barData);
    }
  }, [klineStream]);

  const handleResetZoom = () => {
    if (chartRef.current && barDataList.length > 0) {
      chartRef.current.timeScale().resetTimeScale();
    }
  };

  return (
    <div className="relative w-full h-[500px]">
      <div ref={chartContainerRef} className="w-full h-full" />
      <Button
        onClick={handleResetZoom}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-transparent text-gray-300 p-2 rounded-full border border-gray-500 hover:bg-gray-700 hover:text-white z-10"
      >
        <RefreshCcw size={24} />
      </Button>
    </div>
  );
}
