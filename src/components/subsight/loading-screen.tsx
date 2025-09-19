"use client";

import { Loader2 } from "lucide-react";
import { useLoading } from "@/contexts/loading-context";

export function LoadingScreen() {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
