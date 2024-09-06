"use client";

import {
  createChart,
  CrosshairMode,
  DeepPartial,
  ISeriesApi,
  LineStyle,
  Time,
  TimeChartOptions,
} from "lightweight-charts";
import React, { useEffect, useRef } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BarData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ChartComponentProps {
  data: BarData[];
  updateData: BarData | null;
}

export default function ChartComponent({
  data,
  updateData,
}: ChartComponentProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<"Candlestick", Time> | null>(null);

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

    const lineData = data.map((datapoint) => ({
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

    mainSeries.setData(data);
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
  }, [data]);

  useEffect(() => {
    if (updateData && mainSeriesRef.current) {
      mainSeriesRef.current.update(updateData);
    }
  }, [updateData]);

  const handleResetZoom = () => {
    if (chartRef.current && data.length > 0) {
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
