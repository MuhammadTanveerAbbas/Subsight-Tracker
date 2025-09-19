"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  delta?: number;
  deltaType?: "increase" | "decrease";
  deltaText?: string;
}

export function KpiCard({
  title,
  value,
  delta,
  deltaType,
  deltaText,
}: KpiCardProps) {
  const hasDelta = delta !== undefined && delta !== 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {deltaText && (
            <div className="text-xs text-muted-foreground flex items-center">
                 {hasDelta && deltaType === "increase" && (
                    <ArrowUp className="h-4 w-4 text-destructive mr-1" />
                )}
                {hasDelta && deltaType === "decrease" && (
                    <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
                )}
                <p>{deltaText}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
