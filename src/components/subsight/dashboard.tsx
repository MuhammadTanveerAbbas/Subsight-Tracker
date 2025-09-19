
"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useSubscriptions } from "@/contexts/subscription-context";
import { AppHeader } from "@/components/subsight/header";
import { KpiGrid } from "@/components/subsight/kpi-grid";
import { SubscriptionsTable } from "@/components/subsight/subscriptions-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/contexts/loading-context";

const ChartsGrid = dynamic(() => import('@/components/subsight/charts-grid').then(mod => mod.ChartsGrid), {
  ssr: false,
  loading: () => <div className="grid gap-4 md:grid-cols-2">
    <Skeleton className="h-[300px] sm:h-[360px]" />
    <Skeleton className="h-[300px] sm:h-[360px]" />
  </div>
});

export function Dashboard() {
  const { subscriptions, loading: subsLoading } = useSubscriptions();
  const { setIsLoading } = useLoading();
  const [simulation, setSimulation] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Only show the global loading screen on initial app load, not when subscriptions change.
    // subsLoading is true on first render, and then false.
    if (!subsLoading) {
      setIsLoading(false);
    }
  }, [subsLoading, setIsLoading]);

  const simulatedSubscriptions = subscriptions.map((sub) => ({
    ...sub,
    activeStatus:
      simulation[sub.id] === undefined ? sub.activeStatus : simulation[sub.id],
  }));

  if (subsLoading) {
    return null; // The global loading screen is shown by the layout
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <KpiGrid
          subscriptions={subscriptions}
          simulatedSubscriptions={simulatedSubscriptions}
        />
        <ChartsGrid subscriptions={simulatedSubscriptions} />
        <SubscriptionsTable
          subscriptions={subscriptions}
          simulation={simulation}
          setSimulation={setSimulation}
        />
      </main>
    </div>
  );
}
