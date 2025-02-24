import React, { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import {
  Clock,
  BarChart2,
  TrendingUp,
  FileText,
  LucideIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";

interface Hour {
  value: number;
  label: string;
}

interface DataPoint {
  timeLabel: string;
  savdo: number;
  mijozlar: number;
}

interface StaticData {
  today: DataPoint[];
  weekly: DataPoint[];
  monthly: DataPoint[];
  yearly: DataPoint[];
}

interface Metric {
  value: "savdo" | "mijozlar";
  label: string;
  color: string;
}

interface ChartType {
  id: "area" | "bar" | "line";
  icon: LucideIcon;
  label: string;
}

const hours: Hour[] = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: `${String(i).padStart(2, "0")}:00`,
}));

const staticData: StaticData = {
  today: Array.from({ length: 24 }, (_, i) => ({
    timeLabel: `${String(i).padStart(2, "0")}:00`,
    savdo: Math.floor(65000 + Math.random() * 550000),
    mijozlar: Math.floor(650 + Math.random() * 5500),
  })),
  weekly: [
    { timeLabel: "Dushanba", savdo: 3250000, mijozlar: 32500 },
    { timeLabel: "Seshanba", savdo: 3450000, mijozlar: 34500 },
    { timeLabel: "Chorshanba", savdo: 3620000, mijozlar: 36200 },
    { timeLabel: "Payshanba", savdo: 3820000, mijozlar: 38200 },
    { timeLabel: "Juma", savdo: 4250000, mijozlar: 42500 },
    { timeLabel: "Shanba", savdo: 4780000, mijozlar: 47800 },
    { timeLabel: "Yakshanba", savdo: 3980000, mijozlar: 39800 },
  ],
  monthly: Array.from({ length: 12 }, (_, i) => ({
    timeLabel: [
      "Yanvar",
      "Fevral",
      "Mart",
      "Aprel",
      "May",
      "Iyun",
      "Iyul",
      "Avgust",
      "Sentabr",
      "Oktabr",
      "Noyabr",
      "Dekabr",
    ][i],
    savdo: Math.floor(98000000 + Math.random() * 47000000),
    mijozlar: Math.floor(980000 + Math.random() * 470000),
  })),
  yearly: [
    { timeLabel: "2020", savdo: 1250000000, mijozlar: 12500000 },
    { timeLabel: "2021", savdo: 1380000000, mijozlar: 13800000 },
    { timeLabel: "2022", savdo: 1520000000, mijozlar: 15200000 },
    { timeLabel: "2023", savdo: 1670000000, mijozlar: 16700000 },
    { timeLabel: "2024", savdo: 1820000000, mijozlar: 18200000 },
  ],
};

const filterDataByHours = (
  data: DataPoint[],
  startHour: number,
  endHour: number
): DataPoint[] => {
  if (!Array.isArray(data)) return [];
  return data.filter((item) => {
    if (!item.timeLabel.includes(":")) return true;
    const hour = parseInt(item.timeLabel.split(":")[0]);
    return hour >= startHour && hour <= endHour;
  });
};

const chartTypes: ChartType[] = [
  { id: "area", icon: TrendingUp, label: "Chiziqli" },
  { id: "bar", icon: BarChart2, label: "Ustunli" },
  { id: "line", icon: FileText, label: "Grafik" },
];

const SalesDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [selectedRange, setSelectedRange] = useState<
    "today" | "weekly" | "monthly" | "yearly"
  >("today");
  const [selectedMetric, setSelectedMetric] = useState<"savdo" | "mijozlar">(
    "savdo"
  );
  const [startHour, setStartHour] = useState<number>(0);
  const [endHour, setEndHour] = useState<number>(23);
  const [data, setData] = useState<DataPoint[]>([]);
  const [chartType, setChartType] = useState<"area" | "bar" | "line">("area");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateData = () => {
      if (selectedRange === "today") {
        const filteredData = filterDataByHours(
          staticData.today,
          startHour,
          endHour
        );
        setData(filteredData);
      } else {
        setData(staticData[selectedRange] || []);
      }
    };

    updateData();
  }, [selectedRange, startHour, endHour]);

  const metrics: Metric[] = [
    { value: "savdo", label: "Savdo", color: "#10B981" },
    { value: "mijozlar", label: "Mijozlar", color: "#F59E0B" },
  ];

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatValue = (value: number): string => {
    if (selectedMetric === "mijozlar") return formatNumber(value);
    if (value >= 1000000000)
      return `${formatNumber(Math.floor(value / 1000000000))}.${Math.floor(
        (value % 1000000000) / 100000000
      )}B`;
    if (value >= 1000000)
      return `${formatNumber(Math.floor(value / 1000000))}.${Math.floor(
        (value % 1000000) / 100000
      )}M`;
    return formatNumber(value);
  };

  const renderChart = () => {
    const ChartComponent = {
      area: AreaChart,
      bar: BarChart,
      line: LineChart,
    }[chartType];

    const DataComponent = {
      area: Area,
      bar: Bar,
      line: Line,
    }[chartType];

    const currentMetric = metrics.find((m) => m.value === selectedMetric);
    const isDark = theme === "dark";

    return (
      <ChartComponent
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient
            id={`color${selectedMetric}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="5%"
              stopColor={currentMetric?.color}
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor={currentMetric?.color}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="timeLabel"
          stroke={isDark ? "#666" : "#888"}
          tick={{ fill: isDark ? "#666" : "#888" }}
          axisLine={{ stroke: isDark ? "#333" : "#ddd" }}
        />
        <YAxis
          stroke={isDark ? "#666" : "#888"}
          tick={{ fill: isDark ? "#666" : "#888" }}
          axisLine={{ stroke: isDark ? "#333" : "#ddd" }}
          tickFormatter={formatValue}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#2C2C2C" : "#fff",
            border: isDark ? "none" : "1px solid #eee",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          labelStyle={{ color: isDark ? "#999" : "#666" }}
          formatter={(value: number) => [
            `${formatValue(value)} ${
              selectedMetric === "mijozlar" ? "ta" : "so'm"
            }`,
            currentMetric?.label,
          ]}
        />
        <DataComponent
          type="monotone"
          dataKey={selectedMetric}
          stroke={currentMetric?.color}
          fill={
            chartType === "area"
              ? `url(#color${selectedMetric})`
              : currentMetric?.color
          }
          fillOpacity={chartType === "bar" ? 0.4 : 1}
        />
      </ChartComponent>
    );
  };

  const renderTimeRangeSelector = () => {
    const isDark = theme === "dark";

    if (selectedRange === "today") {
      return (
        <div
          className={`flex items-center gap-2 ${
            isDark ? "bg-[#1C1C1C]" : "bg-gray-100"
          } p-2 rounded-lg`}
        >
          <Clock
            className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          />
          <Select
            value={startHour.toString()}
            onValueChange={(v: string) => setStartHour(Number(v))}
          >
            <SelectTrigger className="w-24 border-none bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour.value} value={hour.value.toString()}>
                  {hour.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className={isDark ? "text-gray-400" : "text-gray-500"}>-</span>
          <Select
            value={endHour.toString()}
            onValueChange={(v: string) => setEndHour(Number(v))}
          >
            <SelectTrigger className="w-24 border-none bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour.value} value={hour.value.toString()}>
                  {hour.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    return null;
  };

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="w-full min-h-[600px] p-6 rounded-lg shadow-xl transition-colors duration-300 bg-background">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap flex-grow gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.value}
              className={`flex-1 min-w-[180px] p-4 rounded-lg border border-opacity-10 cursor-pointer transition-all
                ${
                  selectedMetric === metric.value
                    ? "border-opacity-50 shadow-lg scale-105"
                    : "hover:scale-102"
                }`}
              style={{ borderColor: metric.color }}
              onClick={() => setSelectedMetric(metric.value)}
            >
              <div
                className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-2`}
              >
                {metric.label}
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: metric.color }}
              >
                {formatValue(
                  data.reduce(
                    (sum, item) => sum + Number(item[metric.value]),
                    0
                  )
                )}
                {metric.value === "mijozlar" ? " ta" : " so'm"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <Tabs
          value={selectedRange}
          onValueChange={(value: string) =>
            setSelectedRange(value as "today" | "weekly" | "monthly" | "yearly")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Bugun</TabsTrigger>
            <TabsTrigger value="weekly">Haftalik</TabsTrigger>
            <TabsTrigger value="monthly">Oylik</TabsTrigger>
            <TabsTrigger value="yearly">Yillik</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-lg p-6 mb-6 transition-colors duration-300 bg-card">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            {chartTypes.map((type) => (
              <Button
                key={type.id}
                variant={chartType === type.id ? "secondary" : "ghost"}
                className="flex items-center gap-2"
                onClick={() => setChartType(type.id)}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {renderTimeRangeSelector()}
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
