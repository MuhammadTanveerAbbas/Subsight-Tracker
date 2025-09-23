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

// Pure function to calculate category spending
const calculateCategorySpending = (subscriptions: Subscription[]): {
  categoryData: CategoryData[];
  totalAnnualCost: number;
} => {
  const categoryTotals: Record<string, number> = {};
  let totalAnnual = 0;

  subscriptions.forEach((subscription) => {
    const category = subscription.category || "Uncategorized";
    const annualCost = calculateAnnualCost(subscription);
    
    categoryTotals[category] = (categoryTotals[category] || 0) + annualCost;
    totalAnnual += annualCost;
  });

  const categoryData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return { categoryData, totalAnnualCost: totalAnnual };
};

// Pure function to calculate annual cost from subscription
const calculateAnnualCost = (subscription: Subscription): number => {
  switch (subscription.billingCycle) {
    case "monthly":
      return subscription.amount * 12;
    case "yearly":
      return subscription.amount;
    default:
      return 0;
  }
};

// Pure function to generate timeline data
const generateTimelineData = (subscriptions: Subscription[]): TimelineData[] => {
  const monthlyTotals: Record<string, number> = {};

  subscriptions.forEach((subscription) => {
    if (subscription.billingCycle === "monthly") {
      addMonthlySubscriptionToTimeline(subscription, monthlyTotals);
    } else if (subscription.billingCycle === "yearly") {
      addYearlySubscriptionToTimeline(subscription, monthlyTotals);
    }
  });

  return generateAllMonthsData(monthlyTotals);
};

const addMonthlySubscriptionToTimeline = (
  subscription: Subscription,
  monthlyTotals: Record<string, number>
): void => {
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const date = new Date(new Date().getFullYear(), monthIndex, 1);
    const monthKey = format(date, "MMM");
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + subscription.amount;
  }
};

const addYearlySubscriptionToTimeline = (
  subscription: Subscription,
  monthlyTotals: Record<string, number>
): void => {
  const monthKey = format(new Date(subscription.startDate), "MMM");
  monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + subscription.amount;
};

const generateAllMonthsData = (monthlyTotals: Record<string, number>): TimelineData[] => {
  const allMonths = Array.from({ length: 12 }, (_, i) =>
    format(new Date(0, i), "MMM")
  );
  
  return allMonths.map((month) => ({
    month,
    total: monthlyTotals[month] || 0,
  }));
};

// Pure function to generate trend data
const generateTrendData = (subscriptions: Subscription[]): TrendData[] => {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const yearlyCosts = {
    [currentYear]: 0,
    [lastYear]: 0,
  };

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

// Pure function to generate chart config
const generateCategoryChartConfig = (categoryData: CategoryData[]): ChartConfig => {
  return categoryData.reduce((config, entry, index) => {
    config[entry.name] = {
      label: entry.name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    return config;
  }, {} as ChartConfig);
};

// Pure function to format currency
const formatCurrency = (value: number, currency: string): string => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: currency,
  });
};

// Pure function to get responsive chart dimensions
const getChartDimensions = (isMobile: boolean) => ({
  pieChart: {
    height: isMobile ? "160px" : "200px",
    maxWidth: isMobile ? "160px" : "200px",
    innerRadius: isMobile ? 45 : 60,
  },
  barChart: {
    height: isMobile ? "200px" : "250px",
  },
  trendChart: {
    height: isMobile ? "180px" : "230px",
    margin: { left: isMobile ? -15 : 0, right: isMobile ? 15 : 40 },
  },
});

// Pure function to get responsive font sizes
const getResponsiveFontSizes = (isMobile: boolean) => ({
  axis: isMobile ? "0.65rem" : "0.8rem",
  label: isMobile ? 8 : 11,
  trendLabel: isMobile ? 9 : 12,
});

export function ChartsGrid({ subscriptions }: ChartsGridProps) {
  const activeSubscriptions = useMemo(
    () => subscriptions.filter((subscription) => subscription.activeStatus),
    [subscriptions]
  );
  
  const currency = subscriptions[0]?.currency || "USD";
  const isMobile = useIsMobile();
  
  const { categoryData, totalAnnualCost } = useMemo(
    () => calculateCategorySpending(activeSubscriptions),
    [activeSubscriptions]
  );

  const timelineData = useMemo(
    () => generateTimelineData(activeSubscriptions),
    [activeSubscriptions]
  );

  const categoryChartConfig = useMemo(
    () => generateCategoryChartConfig(categoryData),
    [categoryData]
  );

  const trendData = useMemo(
    () => generateTrendData(activeSubscriptions),
    [activeSubscriptions]
  );

  const chartDimensions = getChartDimensions(isMobile);
  const fontSizes = getResponsiveFontSizes(isMobile);

  return (
    <div className="w-full space-y-4 px-2 sm:px-4 md:px-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10 sm:h-11">
          <TabsTrigger value="overview" className="text-sm sm:text-base">
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-sm sm:text-base">
            Trends
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Category Spending Card */}
            <Card className="w-full">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">
                  Spending by Category
                </CardTitle>
                <CardDescription className="text-sm">
                  Annual breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center px-3 sm:px-6 pb-4 sm:pb-6">
                <ChartContainer
                  config={categoryChartConfig}
                  className={`mx-auto aspect-square h-[${chartDimensions.pieChart.height}] w-full max-w-[${chartDimensions.pieChart.maxWidth}]`}
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          className="min-w-[200px] text-sm"
                          formatter={(value, name) => [
                            `${formatCurrency(Number(value), currency)} (${(
                              (Number(value) / totalAnnualCost) * 100
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
                      innerRadius={chartDimensions.pieChart.innerRadius}
                      strokeWidth={3}
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
              </CardContent>
            </Card>

            {/* Monthly Spending Card */}
            <Card className="w-full">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">
                  Monthly Spending
                </CardTitle>
                <CardDescription className="text-sm">
                  Projected spending for the current year
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6 pb-4 sm:pb-6">
                <ChartContainer
                  config={{ total: { label: "Total" } }}
                  className={`h-[${chartDimensions.barChart.height}] w-full`}
                >
                  <BarChart data={timelineData} accessibilityLayer>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={8}
                      axisLine={false}
                      interval={0}
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 60 : 40}
                      style={{ fontSize: fontSizes.axis }}
                    />
                    <YAxis
                      tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                      style={{ fontSize: fontSizes.axis }}
                      width={isMobile ? 40 : 60}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          className="min-w-[150px]"
                          formatter={(value) => formatCurrency(Number(value), currency)}
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
                          fontSize={fontSizes.label}
                          formatter={(value: number) =>
                            value > 0
                              ? value.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: currency,
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

        <TabsContent value="trends" className="mt-4">
          <Card className="w-full">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">
                Year-over-Year Spending
              </CardTitle>
              <CardDescription className="text-sm">
                Annual subscription costs comparison
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6 pb-4 sm:pb-6">
              <ChartContainer
                config={{
                  cost: { label: "Cost", color: "hsl(var(--chart-1))" },
                }}
                className={`h-[${chartDimensions.trendChart.height}] w-full`}
              >
                <BarChart
                  data={trendData}
                  layout="vertical"
                  accessibilityLayer
                  margin={chartDimensions.trendChart.margin}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <YAxis
                    dataKey="year"
                    type="category"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    width={isMobile ? 45 : 60}
                    style={{ fontSize: fontSizes.axis }}
                  />
                  <XAxis
                    type="number"
                    tickFormatter={(value) =>
                      value.toLocaleString("en-US", {
                        style: "currency",
                        currency: currency,
                        notation: isMobile ? "compact" : "standard",
                        maximumFractionDigits: 0,
                      })
                    }
                    style={{ fontSize: fontSizes.axis }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        className="min-w-[150px]"
                        formatter={(value) => formatCurrency(Number(value), currency)}
                      />
                    }
                  />
                  <Bar dataKey="cost" radius={5}>
                    <LabelList
                      position="right"
                      offset={6}
                      className="fill-foreground"
                      fontSize={fontSizes.trendLabel}
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
    </div>
  );
}
