
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

export function ChartsGrid({ subscriptions }: ChartsGridProps) {
  const activeSubs = subscriptions.filter((s) => s.activeStatus);
  const currency = subscriptions[0]?.currency || "USD";
  const isMobile = useIsMobile();

  const { categoryData, totalAnnualCost } = useMemo(() => {
    const data: Record<string, number> = {};
    let total = 0;
    activeSubs.forEach((sub) => {
      const category = sub.category || "Uncategorized";
      const annualCost =
        sub.billingCycle === "monthly"
          ? sub.amount * 12
          : sub.billingCycle === "yearly"
          ? sub.amount
          : 0;
      if (!data[category]) {
        data[category] = 0;
      }
      data[category] += annualCost;
      total += annualCost;
    });

    const chartData = Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { categoryData: chartData, totalAnnualCost: total };
  }, [activeSubs]);

  const timelineData = useMemo(() => {
    const months: Record<string, number> = {};
    activeSubs.forEach((sub) => {
      if (sub.billingCycle === "monthly") {
        for (let i = 0; i < 12; i++) {
          const date = new Date(new Date().getFullYear(), i, 1);
          const monthKey = format(date, "MMM");
          if (!months[monthKey]) months[monthKey] = 0;
          months[monthKey] += sub.amount;
        }
      } else if (sub.billingCycle === "yearly") {
        const monthKey = format(new Date(sub.startDate), "MMM");
        if (!months[monthKey]) months[monthKey] = 0;
        months[monthKey] += sub.amount;
      }
    });

    const allMonths = Array.from({ length: 12 }, (_, i) =>
      format(new Date(0, i), "MMM")
    );
    return allMonths.map((month) => ({
      month,
      total: months[month] || 0,
    }));
  }, [activeSubs]);

  const categoryChartConfig = useMemo(() => {
    return categoryData.reduce((acc, entry, index) => {
      acc[entry.name] = {
        label: entry.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return acc;
    }, {} as ChartConfig);
  }, [categoryData]);

  const trendData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const yearlyCosts: Record<number, number> = {
      [currentYear]: 0,
      [lastYear]: 0,
    };

    activeSubs.forEach((sub) => {
      const subYear = new Date(sub.startDate).getFullYear();
      const annualCost =
        sub.billingCycle === "monthly"
          ? sub.amount * 12
          : sub.billingCycle === "yearly"
          ? sub.amount
          : 0;

      if (subYear <= currentYear) {
        yearlyCosts[currentYear] += annualCost;
      }
      if (subYear <= lastYear) {
        yearlyCosts[lastYear] += annualCost;
      }
    });

    return [
      { year: lastYear, cost: yearlyCosts[lastYear] },
      { year: currentYear, cost: yearlyCosts[currentYear] },
    ];
  }, [activeSubs]);

  return (
    <Tabs defaultValue="overview">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Annual breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer
                config={categoryChartConfig}
                className="mx-auto aspect-square h-[180px] w-full max-w-[180px] sm:h-[200px] sm:max-w-[200px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name) => [
                          `${value.toLocaleString("en-US", {
                            style: "currency",
                            currency: currency,
                          })} (${((value / totalAnnualCost) * 100).toFixed(
                            1
                          )}%)`,
                          name,
                        ]}
                      />
                    }
                  />
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={isMobile ? 50 : 60}
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending</CardTitle>
              <CardDescription>
                Projected spending for the current year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ total: { label: "Total" } }}
                className="h-[220px] w-full sm:h-[250px]"
              >
                <BarChart data={timelineData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                    interval={isMobile ? 1 : 0}
                    style={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      `$${Number(value).toLocaleString()}`
                    }
                    style={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) =>
                          value.toLocaleString("en-US", {
                            style: "currency",
                            currency: currency,
                          })
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
                      fontSize={isMobile ? 9 : 11}
                      formatter={(value: number) =>
                        value > 0 && !isMobile
                          ? value.toLocaleString("en-US", {
                              style: "currency",
                              currency: currency,
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })
                          : ""
                      }
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="trends">
        <Card>
          <CardHeader>
            <CardTitle>Year-over-Year Spending</CardTitle>
            <CardDescription>
              Annual subscription costs comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cost: { label: "Cost", color: "hsl(var(--chart-1))" },
              }}
              className="h-[220px] w-full sm:h-[250px]"
            >
              <BarChart
                data={trendData}
                layout="vertical"
                accessibilityLayer
                margin={{ left: isMobile ? -10 : 0, right: isMobile ? 20 : 40 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="year"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  style={{ fontSize: isMobile ? "0.75rem" : "0.85rem" }}
                />
                <XAxis
                  type="number"
                  tickFormatter={(value) =>
                    value.toLocaleString("en-US", {
                      style: "currency",
                      currency: currency,
                      notation: "compact",
                    })
                  }
                  style={{ fontSize: isMobile ? "0.75rem" : "0.85rem" }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) =>
                        value.toLocaleString("en-US", {
                          style: "currency",
                          currency: currency,
                        })
                      }
                    />
                  }
                />
                <Bar dataKey="cost" radius={5}>
                  <LabelList
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={isMobile ? 10 : 12}
                    formatter={(value: number) =>
                      value.toLocaleString("en-US", {
                        style: "currency",
                        currency: currency,
                      })
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
