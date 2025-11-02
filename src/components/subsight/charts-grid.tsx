"use client";

import { useMemo } from "react";
import { Subscription } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChartsGridProps {
  subscriptions: Subscription[];
}

interface CategoryData {
  name: string;
  value: number;
}

interface TimelineData {
  month: string;
  total: number;
}

interface TrendData {
  year: number;
  cost: number;
}

// Pure functions for data processing
const filterActiveSubscriptions = (
  subscriptions: Subscription[]
): Subscription[] => subscriptions.filter((s) => s.activeStatus);

const calculateAnnualCost = (subscription: Subscription): number => {
  if (subscription.billingCycle === "monthly") return subscription.amount * 12;
  if (subscription.billingCycle === "yearly") return subscription.amount;
  return 0;
};

const processCategoryData = (
  subscriptions: Subscription[]
): { data: CategoryData[]; total: number } => {
  const categoryTotals: Record<string, number> = {};
  let totalAnnualCost = 0;

  subscriptions.forEach((subscription) => {
    const category = subscription.category || "Uncategorized";
    const annualCost = calculateAnnualCost(subscription);

    categoryTotals[category] = (categoryTotals[category] || 0) + annualCost;
    totalAnnualCost += annualCost;
  });

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return { data, total: totalAnnualCost };
};

const generateMonthKeys = (): string[] =>
  Array.from({ length: 12 }, (_, i) => format(new Date(0, i), "MMM"));

const processTimelineData = (subscriptions: Subscription[]): TimelineData[] => {
  const monthlyTotals: Record<string, number> = {};

  subscriptions.forEach((subscription) => {
    if (subscription.billingCycle === "monthly") {
      for (let i = 0; i < 12; i++) {
        const monthKey = format(
          new Date(new Date().getFullYear(), i, 1),
          "MMM"
        );
        monthlyTotals[monthKey] =
          (monthlyTotals[monthKey] || 0) + subscription.amount;
      }
    } else if (subscription.billingCycle === "yearly") {
      const monthKey = format(new Date(subscription.startDate), "MMM");
      monthlyTotals[monthKey] =
        (monthlyTotals[monthKey] || 0) + subscription.amount;
    }
  });

  return generateMonthKeys().map((month) => ({
    month,
    total: monthlyTotals[month] || 0,
  }));
};

const processTrendData = (subscriptions: Subscription[]): TrendData[] => {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  const yearlyCosts = { [currentYear]: 0, [lastYear]: 0 };

  subscriptions.forEach((subscription) => {
    const subscriptionYear = new Date(subscription.startDate).getFullYear();
    const annualCost = calculateAnnualCost(subscription);

    if (subscriptionYear <= currentYear) {
      yearlyCosts[currentYear] += annualCost;
    }
    if (subscriptionYear <= lastYear) {
      yearlyCosts[lastYear] += annualCost;
    }
  });

  return [
    { year: lastYear, cost: yearlyCosts[lastYear] },
    { year: currentYear, cost: yearlyCosts[currentYear] },
  ];
};

const createCategoryChartConfig = (categoryData: CategoryData[]): ChartConfig =>
  categoryData.reduce((config, entry, index) => {
    config[entry.name] = {
      label: entry.name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    return config;
  }, {} as ChartConfig);

const formatCurrency = (value: number, currency: string): string =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency,
  });

const formatCurrencyCompact = (value: number, currency: string): string =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency,
    notation: "compact",
  });

const formatCurrencyNoDecimals = (value: number, currency: string): string =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

// Responsive styling configurations
const getPieChartDimensions = (isMobile: boolean) => ({
  containerClass: isMobile
    ? "mx-auto aspect-square h-[240px] w-full max-w-[240px]" // bigger on small
    : "mx-auto aspect-square h-[180px] w-full max-w-[180px] sm:h-[200px] sm:max-w-[200px]",
  innerRadius: isMobile ? 55 : 60,
});

const getBarChartConfig = (isMobile: boolean) => ({
  containerClass: isMobile
    ? "h-[240px] w-full" // taller for mobile
    : "h-[220px] w-full sm:h-[250px]",
  fontSize: isMobile ? "0.65rem" : "0.8rem", // Smaller font on mobile
  labelFontSize: isMobile ? 10 : 11,
  xAxisInterval: isMobile ? 1 : 0, // Show every other month on mobile, all on desktop
  tickMargin: isMobile ? 4 : 8, // Reduce margin on mobile
});

const getTrendChartConfig = (isMobile: boolean) => ({
  containerClass: isMobile
    ? "h-[240px] w-full" // taller for mobile
    : "h-[220px] w-full sm:h-[250px]",
  fontSize: isMobile ? "0.75rem" : "0.85rem",
  labelFontSize: isMobile ? 11 : 12,
  margin: isMobile ? { left: -10, right: 20 } : { left: 0, right: 40 },
});

export function ChartsGrid({ subscriptions }: ChartsGridProps) {
  const activeSubs = filterActiveSubscriptions(subscriptions);
  const currency = subscriptions[0]?.currency || "USD";
  const isMobile = useIsMobile();

  const { categoryData, totalAnnualCost } = useMemo(() => {
    const { data, total } = processCategoryData(activeSubs);
    return { categoryData: data, totalAnnualCost: total };
  }, [activeSubs]);

  const timelineData = useMemo(
    () => processTimelineData(activeSubs),
    [activeSubs]
  );

  const categoryChartConfig = useMemo(
    () => createCategoryChartConfig(categoryData),
    [categoryData]
  );

  const trendData = useMemo(() => processTrendData(activeSubs), [activeSubs]);

  const pieChartDimensions = getPieChartDimensions(isMobile);
  const barChartConfig = getBarChartConfig(isMobile);
  const trendChartConfig = getTrendChartConfig(isMobile);

  return (
    <Tabs defaultValue="overview">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div
          className={`grid gap-4 ${
            isMobile ? "grid-cols-1" : "md:grid-cols-2"
          }`}
        >
          <Card>
            <CardHeader className={isMobile ? "pb-2" : ""}>
              <CardTitle className={isMobile ? "text-base" : ""}>
                Spending by Category
              </CardTitle>
              <CardDescription className={isMobile ? "text-xs" : ""}>
                Annual breakdown
              </CardDescription>
            </CardHeader>
            <CardContent
              className={`flex items-center justify-center ${
                isMobile ? "pt-1" : ""
              }`}
            >
              {categoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">No data yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Add subscriptions to see breakdown</p>
                </div>
              ) : (
                <ChartContainer
                  config={categoryChartConfig}
                  className={pieChartDimensions.containerClass}
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          formatter={(value, name) => [
                            `${formatCurrency(value as number, currency)} (${(
                              ((value as number) / totalAnnualCost) *
                              100
                            ).toFixed(1)}%)`,
                            name,
                          ]}
                        />
                      }
                    />
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={pieChartDimensions.innerRadius}
                      strokeWidth={5}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            categoryChartConfig[entry.name]?.color ||
                            "hsl(var(--muted))"
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className={isMobile ? "pb-2" : ""}>
              <CardTitle className={isMobile ? "text-base" : ""}>
                Monthly Spending
              </CardTitle>
              <CardDescription className={isMobile ? "text-xs" : ""}>
                Projected spending for the current year
              </CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "pt-1" : ""}>
              {timelineData.every(d => d.total === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">No data yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Add subscriptions to see timeline</p>
                </div>
              ) : (
                <ChartContainer
                  config={{ total: { label: "Total" } }}
                  className={barChartConfig.containerClass}
                >
                  <BarChart data={timelineData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={barChartConfig.tickMargin}
                    axisLine={false}
                    interval={barChartConfig.xAxisInterval}
                    style={{ fontSize: barChartConfig.fontSize }}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? "end" : "middle"}
                    height={isMobile ? 60 : 30}
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      `$${Number(value).toLocaleString()}`
                    }
                    style={{ fontSize: barChartConfig.fontSize }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) =>
                          formatCurrency(value as number, currency)
                        }
                      />
                    }
                  />
                  <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={4}>
                    <LabelList
                      dataKey="total"
                      position="top"
                      offset={4}
                      className="fill-foreground"
                      fontSize={barChartConfig.labelFontSize}
                      formatter={(value: number) =>
                        value > 0 && !isMobile
                          ? formatCurrencyNoDecimals(value, currency)
                          : ""
                      }
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="trends">
        <Card>
          <CardHeader className={isMobile ? "pb-2" : ""}>
            <CardTitle className={isMobile ? "text-base" : ""}>
              Year over Year Spending
            </CardTitle>
            <CardDescription className={isMobile ? "text-xs" : ""}>
              Annual subscription costs comparison
            </CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? "pt-1" : ""}>
            <ChartContainer
              config={{
                cost: { label: "Cost", color: "hsl(var(--chart-1))" },
              }}
              className={trendChartConfig.containerClass}
            >
              <BarChart
                data={trendData}
                layout="vertical"
                accessibilityLayer
                margin={trendChartConfig.margin}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="year"
                  type="category"
                  tickLine={false}
                  tickMargin={8}
                  axisLine={false}
                  style={{ fontSize: trendChartConfig.fontSize }}
                />
                <XAxis
                  type="number"
                  tickFormatter={(value) =>
                    formatCurrencyCompact(value, currency)
                  }
                  style={{ fontSize: trendChartConfig.fontSize }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) =>
                        formatCurrency(value as number, currency)
                      }
                    />
                  }
                />
                <Bar dataKey="cost" radius={5}>
                  <LabelList
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={trendChartConfig.labelFontSize}
                    formatter={(value: number) =>
                      formatCurrency(value, currency)
                    }
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
