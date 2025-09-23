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

// Pure calculation functions
const calculateAnnualCost = (subscription: Subscription): number => {
  if (subscription.billingCycle === "monthly") {
    return subscription.amount * 12;
  }
  if (subscription.billingCycle === "yearly") {
    return subscription.amount;
  }
  return 0;
};

const buildCategoryData = (activeSubscriptions: Subscription[]) => {
  const categoryTotals: Record<string, number> = {};
  let totalAnnualCost = 0;

  activeSubscriptions.forEach((subscription) => {
    const category = subscription.category || "Uncategorized";
    const annualCost = calculateAnnualCost(subscription);
    
    categoryTotals[category] = (categoryTotals[category] || 0) + annualCost;
    totalAnnualCost += annualCost;
  });

  const categoryData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return { categoryData, totalAnnualCost };
};

const buildTimelineData = (activeSubscriptions: Subscription[]) => {
  const monthlyTotals: Record<string, number> = {};

  activeSubscriptions.forEach((subscription) => {
    if (subscription.billingCycle === "monthly") {
      for (let month = 0; month < 12; month++) {
        const date = new Date(new Date().getFullYear(), month, 1);
        const monthKey = format(date, "MMM");
        monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + subscription.amount;
      }
    } else if (subscription.billingCycle === "yearly") {
      const monthKey = format(new Date(subscription.startDate), "MMM");
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + subscription.amount;
    }
  });

  const allMonths = Array.from({ length: 12 }, (_, index) =>
    format(new Date(0, index), "MMM")
  );

  return allMonths.map((month) => ({
    month,
    total: monthlyTotals[month] || 0,
  }));
};

const buildTrendData = (activeSubscriptions: Subscription[]) => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const yearlyCosts = {
    [currentYear]: 0,
    [previousYear]: 0,
  };

  activeSubscriptions.forEach((subscription) => {
    const subscriptionStartYear = new Date(subscription.startDate).getFullYear();
    const annualCost = calculateAnnualCost(subscription);

    if (subscriptionStartYear <= currentYear) {
      yearlyCosts[currentYear] += annualCost;
    }
    if (subscriptionStartYear <= previousYear) {
      yearlyCosts[previousYear] += annualCost;
    }
  });

  return [
    { year: previousYear, cost: yearlyCosts[previousYear] },
    { year: currentYear, cost: yearlyCosts[currentYear] },
  ];
};

const createCategoryChartConfig = (categoryData: { name: string; value: number }[]): ChartConfig => {
  return categoryData.reduce((config, entry, index) => {
    config[entry.name] = {
      label: entry.name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    return config;
  }, {} as ChartConfig);
};

const createCurrencyFormatter = (currency: string) => (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency,
  });

const createCompactCurrencyFormatter = (currency: string) => (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency,
    notation: "compact",
  });

const createPercentageFormatter = (total: number) => (value: number) =>
  `${((value / total) * 100).toFixed(1)}%`;

export function ChartsGrid({ subscriptions }: ChartsGridProps) {
  const activeSubscriptions = useMemo(
    () => subscriptions.filter((subscription) => subscription.activeStatus),
    [subscriptions]
  );
  
  const currency = subscriptions[0]?.currency || "USD";
  const isMobile = useIsMobile();

  const { categoryData, totalAnnualCost } = useMemo(
    () => buildCategoryData(activeSubscriptions),
    [activeSubscriptions]
  );

  const timelineData = useMemo(
    () => buildTimelineData(activeSubscriptions),
    [activeSubscriptions]
  );

  const trendData = useMemo(
    () => buildTrendData(activeSubscriptions),
    [activeSubscriptions]
  );

  const categoryChartConfig = useMemo(
    () => createCategoryChartConfig(categoryData),
    [categoryData]
  );

  const formatCurrency = createCurrencyFormatter(currency);
  const formatCompactCurrency = createCompactCurrencyFormatter(currency);
  const formatPercentage = createPercentageFormatter(totalAnnualCost);

  // Responsive configuration
  const pieChartSize = isMobile ? 160 : 200;
  const pieInnerRadius = isMobile ? 45 : 60;
  const barChartHeight = isMobile ? 200 : 250;
  const fontSize = {
    small: isMobile ? "0.65rem" : "0.75rem",
    medium: isMobile ? "0.7rem" : "0.8rem",
    large: isMobile ? "0.75rem" : "0.85rem",
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xs sm:text-sm">
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {/* Category Spending Chart */}
            <Card className="w-full">
              <CardHeader className="pb-2 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">
                  Spending by Category
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Annual breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-2 sm:p-6">
                <ChartContainer
                  config={categoryChartConfig}
                  className={`mx-auto aspect-square h-[${pieChartSize}px] w-full max-w-[${pieChartSize}px]`}
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          className="text-xs"
                          formatter={(value, name) => [
                            `${formatCurrency(Number(value))} (${formatPercentage(Number(value))})`,
                            name,
                          ]}
                        />
                      }
                    />
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={pieInnerRadius}
                      strokeWidth={isMobile ? 3 : 5}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`category-${index}`}
                          fill={categoryChartConfig[entry.name]?.color || "hsl(var(--muted))"}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Monthly Spending Chart */}
            <Card className="w-full">
              <CardHeader className="pb-2 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">
                  Monthly Spending
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Projected spending for the current year
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <ChartContainer
                  config={{ total: { label: "Total" } }}
                  className={`h-[${barChartHeight}px] w-full`}
                >
                  <BarChart 
                    data={timelineData} 
                    accessibilityLayer
                    margin={{ 
                      top: isMobile ? 10 : 20, 
                      right: isMobile ? 10 : 30, 
                      left: isMobile ? 10 : 20, 
                      bottom: isMobile ? 5 : 10 
                    }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={isMobile ? 5 : 10}
                      axisLine={false}
                      interval={isMobile ? 2 : 0}
                      style={{ fontSize: fontSize.medium }}
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 50 : 30}
                    />
                    <YAxis
                      tickFormatter={formatCompactCurrency}
                      style={{ fontSize: fontSize.small }}
                      width={isMobile ? 40 : 60}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          className="text-xs"
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                      }
                    />
                    <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={4}>
                      {!isMobile && (
                        <LabelList
                          dataKey="total"
                          position="top"
                          offset={4}
                          className="fill-foreground"
                          fontSize={9}
                          formatter={(value: number) =>
                            value > 0
                              ? value.toLocaleString("en-US", {
                                  style: "currency",
                                  currency,
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                })
                              : ""
                          }
                        />
                      )}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card className="w-full">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">
                Year-over-Year Spending
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Annual subscription costs comparison
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <ChartContainer
                config={{
                  cost: { label: "Cost", color: "hsl(var(--chart-1))" },
                }}
                className={`h-[${barChartHeight}px] w-full`}
              >
                <BarChart
                  data={trendData}
                  layout="vertical"
                  accessibilityLayer
                  margin={{ 
                    left: isMobile ? 10 : 20, 
                    right: isMobile ? 30 : 50,
                    top: 10,
                    bottom: 10
                  }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <YAxis
                    dataKey="year"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    style={{ fontSize: fontSize.large }}
                    width={isMobile ? 50 : 70}
                  />
                  <XAxis
                    type="number"
                    tickFormatter={formatCompactCurrency}
                    style={{ fontSize: fontSize.small }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        className="text-xs"
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    }
                  />
                  <Bar dataKey="cost" radius={5}>
                    <LabelList
                      position="right"
                      offset={8}
                      className="fill-foreground"
                      fontSize={isMobile ? 9 : 11}
                      formatter={(value: number) =>
                        isMobile 
                          ? formatCompactCurrency(value)
                          : formatCurrency(value)
                      }
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
