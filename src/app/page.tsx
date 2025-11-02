import { LandingPage } from "@/components/subsight/landing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Subscription Tracker - Manage Recurring Payments | Subsight",
  description: "Take control of your finances with Subsight, a free and private subscription tracker. Manage recurring payments, analyze spending with AI powered insights, and discover savings. No sign up required.",
  keywords: ["subscription tracker", "manage subscriptions", "recurring payments", "budgeting tool", "save money", "personal finance", "spending tracker", "AI insights", "privacy-first"],
  openGraph: {
    title: "Free Subscription Tracker - Manage Recurring Payments | Subsight",
    description: "Track subscriptions with AI-powered insights. 100% free, private, and secure.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Subsight',
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    operatingSystem: 'Web Browser',
    description: 'Free privacy-first subscription tracker with AI-powered insights',
    author: {
      '@type': 'Person',
      name: 'Muhammad Tanveer Abbas',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <LandingPage />
      </main>
    </>
  );
}
