import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { LoadingProvider } from "@/contexts/loading-context";
import { LoadingScreen } from "@/components/subsight/loading-screen";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "Subsight",
  description: "Track and manage your subscriptions effortlessly.",
  icons: {
    icon: "/favicon.png",
  },
};

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", sora.variable)}>
      <body className="font-body antialiased">
        <LoadingProvider>
          {children}
          <LoadingScreen />
        </LoadingProvider>
        <Toaster />
      </body>
    </html>
  );
}
