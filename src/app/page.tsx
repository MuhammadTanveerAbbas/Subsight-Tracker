import { LandingPage } from "@/components/subsight/landing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subsight",
  description: "Take control of your finances with Subsight, a free and private subscription tracker. Manage recurring payments, analyze spending with AI powered insights, and discover savings. No sign up required.",
  keywords: ["subscription tracker", "manage subscriptions", "recurring payments", "budgeting tool", "save money", "personal finance", "spending tracker"],
};

export default function Home() {
  return (
    <main>
      <LandingPage />
    </main>
  );
}
