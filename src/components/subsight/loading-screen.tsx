"use client";

import { Target } from "lucide-react";
import { useLoading } from "@/contexts/loading-context";

export function LoadingScreen() {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full border-4 border-primary/20"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
        </div>
        <div className="relative flex h-24 w-24 items-center justify-center">
          <Target className="h-10 w-10 text-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
}
