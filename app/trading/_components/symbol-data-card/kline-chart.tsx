import { useEffect, useRef } from "react";
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
import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

import useKlineStream from "../../../../lib/streams/useKlineStream";
import { useCandlestickDatas } from "../../_hooks/useCandlestickDatas";
import { useChartPriceFormat } from "../../_hooks/useChartPriceFormat";
import { useKlineStore } from "../../_providers/kline-store-providers";

export function KlineChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick", Time> | null>(
    null
  );
  const chartPriceFormat = useChartPriceFormat();

  const candlestickDatas = useCandlestickDatas();
  const { symbol, interval } = useKlineStore((state) => state);
  const klineStream = useKlineStream(symbol, interval);

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
      rightOffset: 5,
      timeVisible: true,
    });

    const areaDatas = candlestickDatas.map((datapoint) => ({
      time: datapoint.time,
      value: (datapoint.close + datapoint.open) / 2,
    }));

    const areaSeries = chart.addAreaSeries({
      lastValueVisible: false,
      crosshairMarkerVisible: false,
      lineColor: "transparent",
      topColor: "#38216e99",
      bottomColor: "#38216e1a",
      priceFormat: chartPriceFormat,
    });

    areaSeries.setData(areaDatas);

    const candlestickSeries = chart.addCandlestickSeries({
      wickUpColor: "#3674d9",
      upColor: "#3674d9",
      wickDownColor: "#e13255",
      downColor: "#e13255",
      borderVisible: false,
      priceFormat: chartPriceFormat,
    });

    candlestickSeries.setData(candlestickDatas);
    candlestickSeriesRef.current = candlestickSeries;

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
  }, [candlestickDatas, chartPriceFormat]);

  useEffect(() => {
    if (klineStream && candlestickSeriesRef.current) {
      const { T, o, h, l, c } = klineStream.k;
      const barData: BarData = {
        time: (T / 1000) as Time,
        open: Number(o),
        high: Number(h),
        low: Number(l),
        close: Number(c),
      };
      candlestickSeriesRef.current.update(barData);
    }
  }, [klineStream]);

  const handleResetZoom = () => {
    if (chartRef.current && candlestickDatas.length > 0) {
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
