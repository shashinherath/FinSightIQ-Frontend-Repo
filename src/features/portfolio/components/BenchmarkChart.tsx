import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BenchmarkPoint } from "../types/portfolio.types";

interface BenchmarkChartProps {
  data: BenchmarkPoint[];
  portfolioName: string;
  height?: number;
}

export function BenchmarkChart({
  data,
  portfolioName,
  height = 280,
}: BenchmarkChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0.28}
            />
            <stop
              offset="100%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="4 6"
          stroke="hsl(var(--border))"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          axisLine={{ stroke: "hsl(var(--border))" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          width={40}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            fontSize: 12,
            color: "hsl(var(--popover-foreground))",
          }}
          formatter={(value, key) => [
            typeof value === "number" ? value.toFixed(1) : String(value),
            key === "portfolio" ? portfolioName : "Benchmark",
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
          formatter={(value) =>
            value === "portfolio" ? portfolioName : "S&P 500 total return"
          }
        />
        <Area
          type="monotone"
          dataKey="portfolio"
          stroke="hsl(var(--primary))"
          strokeWidth={2.5}
          fill="url(#portfolioFill)"
        />
        <Area
          type="monotone"
          dataKey="benchmark"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          strokeDasharray="5 4"
          fill="none"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
