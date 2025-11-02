"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/loading-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Check,
  Sparkles,
  TrendingUp,
  ShieldX,
  User,
  Server,
  FileCog,
  Bell,
  Target,
  Github,
  Linkedin,
  Database,
  LogIn,
  X,
  Zap,
  Crown,
  Rocket,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export function LandingPage() {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const handleStartClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoading(true);
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#000000' }}>
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <Link href="#" className="flex items-center justify-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          <span className="text-2xl font-semibold tracking-tight font-headline">
            Subsight
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="https://github.com/MuhammadTanveerAbbas/Subsight-Tracker"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative w-full pt-10 md:pt-18 lg:pt-14 pb-0 md:pb-18 lg:pb-14 overflow-hidden"
        >
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-4 pt-6">
                <div className="inline-block mb-2">
                  <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold border border-primary/20">
                    🎯 100% Free & Private Forever
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl font-headline">
                  Stop Wasting Money on <br className="hidden lg:block" />
                  <span className="gradient-text">Forgotten Subscriptions</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-base md:text-lg mx-auto leading-relaxed">
                  Subsight is your free, private, and powerful dashboard to
                  track, manage, and optimize all your recurring payments with
                  instant insights. No signup required.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-6">
                <Button size="lg" className="text-base px-8" asChild>
                  <Link href="/dashboard" onClick={handleStartClick}>
                    Start Tracking for Free{" "}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8"
                  asChild
                >
                  <Link href="#features">See Features</Link>
                </Button>
              </div>
              {/* Info Boxes Section */}
              <div className="pt-10 md:pt-14 w-full max-w-5xl hidden md:block">
                <div className="md:hidden">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      <CarouselItem className="basis-full sm:basis-1/2">
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 h-full hover:border-primary/30 transition-colors">
                          <CardHeader className="items-center pb-3">
                            <div className="p-2 rounded-full bg-primary/10 mb-2">
                              <Server className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-base">
                              Track Everything
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-center pt-0">
                            <p className="text-xs text-muted-foreground">
                              Get a crystal clear overview of all your
                              subscriptions, due dates, and annual costs.
                            </p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                      <CarouselItem className="basis-full sm:basis-1/2">
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 h-full hover:border-primary/30 transition-colors">
                          <CardHeader className="items-center pb-3">
                            <div className="p-2 rounded-full bg-primary/10 mb-2">
                              <FileCog className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-base">
                              Uncover Savings
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-center pt-0">
                            <p className="text-xs text-muted-foreground">
                              Use the simulation mode to see how much you can
                              save by canceling services.
                            </p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                      <CarouselItem className="basis-full sm:basis-1/2">
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 h-full hover:border-primary/30 transition-colors">
                          <CardHeader className="items-center pb-3">
                            <div className="p-2 rounded-full bg-primary/10 mb-2">
                              <Bell className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-base">
                              AI Powered Insights
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-center pt-0">
                            <p className="text-xs text-muted-foreground">
                              Let AI find subscription details and provide a
                              summary of your spending habits.
                            </p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    </CarouselContent>
                  </Carousel>
                </div>
                <div className="mx-auto hidden max-w-5xl items-start gap-6 md:grid md:grid-cols-3">
                  <Card className="bg-card/50 backdrop-blur-sm border-primary/10 h-full hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                    <CardHeader className="items-center pb-3">
                      <div className="p-2 rounded-full bg-primary/10 mb-2">
                        <Server className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-sm">
                        Track Everything
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <p className="text-muted-foreground text-xs">
                        Get a crystal clear overview of all your subscriptions,
                        due dates, and annual costs.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 backdrop-blur-sm border-primary/10 h-full hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                    <CardHeader className="items-center pb-3">
                      <div className="p-2 rounded-full bg-primary/10 mb-2">
                        <FileCog className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-sm">Uncover Savings</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <p className="text-muted-foreground text-xs">
                        Use the simulation mode to see how much you can save by
                        canceling services.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 backdrop-blur-sm border-primary/10 h-full hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                    <CardHeader className="items-center pb-3">
                      <div className="p-2 rounded-full bg-primary/10 mb-2">
                        <Bell className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-sm">
                        AI Powered Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <p className="text-muted-foreground text-xs">
                        Let AI find subscription details and provide a summary
                        of your spending habits.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 mt-20 md:mt-0"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Your All In One Subscription Dashboard
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From AI powered data entry to powerful budget simulations, we
                  give you the tools to take back control.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-1 md:grid-cols-3">
              <Card className="h-full bg-background border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                <CardHeader className="items-center">
                  <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Interactive Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Visualize monthly and annual spending with beautiful,
                    responsive charts and real time insights.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full bg-background border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                <CardHeader className="items-center">
                  <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>AI Assistant</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Instantly fill subscription details and get AI generated
                    summaries of your spending patterns.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full bg-background border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                <CardHeader className="items-center">
                  <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <ShieldX className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Simulation Mode</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Toggle subscriptions on or off to see the immediate impact
                    on your budget in real time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                Why Choose Subsight?
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Better Than The Rest
              </h2>
            </div>
            <div className="mx-auto max-w-5xl overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left font-semibold">Feature</th>
                    <th className="p-4 text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span className="gradient-text">Subsight</span>
                      </div>
                    </th>
                    <th className="p-4 text-center font-semibold text-muted-foreground">
                      Others
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Privacy First (No Account)</td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-primary mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <td className="p-4">AI Auto Fill</td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-primary mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Simulation Mode</td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-primary mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <td className="p-4">100% Free Forever</td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-primary mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-muted-foreground text-sm">
                        $5-15/mo
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Export to PDF/CSV/JSON</td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-primary mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-muted-foreground text-sm">
                        Premium
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <td className="p-4">AI Spending Summary</td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-primary mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">No Data Tracking</td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-primary mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                  </tr>
                  <tr className="bg-secondary/30">
                    <td className="p-4">Open Source</td>
                    <td className="p-4 text-center">
                      <Check className="w-5 h-5 text-primary mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="w-full py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">
                Simple Pricing
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Choose Your Plan
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Start free and upgrade as you grow. All plans include core
                features.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-3">
              <Card className="relative border-border/50 bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <CardTitle>Free</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Up to 10 subscriptions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Basic dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Manual entry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Export to CSV</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">100% private & secure</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/dashboard" onClick={handleStartClick}>
                      Get Started Free
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="relative border-primary/50 bg-card shadow-lg shadow-primary/10 scale-105">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    MOST POPULAR
                  </span>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-primary" />
                    <CardTitle>Free Pro</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$9</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-semibold">
                        Everything in Free, plus:
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Unlimited subscriptions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">AI auto-fill & insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Simulation mode</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Export to PDF/CSV/JSON</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="default" asChild>
                    <Link href="/dashboard" onClick={handleStartClick}>
                      Start Pro Trial
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="relative border-border/50 bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Rocket className="w-5 h-5 text-primary" />
                    <CardTitle>Free Enterprise</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-semibold">
                        Everything in Pro, plus:
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Team collaboration (5 users)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Priority support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Custom integrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Advanced analytics</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/dashboard" onClick={handleStartClick}>
                      Get Started Free
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              All plans include 14-day free trial. No credit card required to
              start.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Take Control of Your <span className="gradient-text">Subscriptions Today</span>
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl">
                  Join thousands who have already saved money by tracking their subscriptions with Subsight.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button size="lg" className="text-base px-8" asChild>
                  <Link href="/dashboard" onClick={handleStartClick}>
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  No credit card required • 100% Free Forever
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Get Started in 3 Simple Steps
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Gain clarity on your spending in under five minutes.
              </p>
            </div>
            <div className="mx-auto grid gap-8 sm:max-w-4xl sm:grid-cols-3 md:gap-12 mt-12">
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold">1. Add Your Subscriptions</h3>
                <p className="text-sm text-muted-foreground">
                  Quickly add your services manually or let our AI assistant do
                  the heavy lifting for you.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold">
                  2. Visualize Your Spending
                </h3>
                <p className="text-sm text-muted-foreground">
                  See exactly where your money is going with our intuitive and
                  interactive charts.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold">3. Find & Cut Waste</h3>
                <p className="text-sm text-muted-foreground">
                  Use our AI summary and simulation tools to identify and
                  eliminate unwanted subscriptions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section
          id="privacy"
          className="w-full py-12 md:py-24 lg:py-32"
        >
          <div className="container grid items-center justify-center gap-8 px-4 text-center md:px-6">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">
                Privacy First
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Your Finances, Your Device. Period.
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Subsight is engineered for privacy. All your subscription data
                is stored exclusively in your browser's local storage. No
                accounts, no databases, no cloud sync. Your information never
                leaves your computer.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-4xl">
              <div className="flex flex-col items-center gap-2">
                <LogIn className="w-10 h-10 text-primary" />
                <h3 className="font-semibold">No Sign Up Required</h3>
                <p className="text-sm text-muted-foreground">
                  Start tracking immediately.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Database className="w-10 h-10 text-primary" />
                <h3 className="font-semibold">No Database</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is never stored on our servers.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ShieldX className="w-10 h-10 text-primary" />
                <h3 className="font-semibold">100% Client Side</h3>
                <p className="text-sm text-muted-foreground">
                  Use securely in your browser.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="mx-auto max-w-3xl w-full pt-12">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, your data is stored locally in your browser and never
                    leaves your device. We do not have a database or user
                    accounts. We prioritize your privacy and security above all
                    else.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is Subsight free to use?</AccordionTrigger>
                  <AccordionContent>
                    Yes, Subsight is completely free to use with no hidden fees
                    or premium tiers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How does the AI assistant work?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our AI assistant uses Google's Gemini model to fetch common
                    details about a subscription service to pre fill the form,
                    saving you time and effort. It can also analyze your
                    spending and provide a helpful summary.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Can I import or export my data?
                  </AccordionTrigger>
                  <AccordionContent>
                    Absolutely. You can easily import your subscriptions from a
                    JSON or CSV file. You can also export all your data to JSON,
                    CSV, or a printable PDF report at any time.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    What is Subsight built with?
                  </AccordionTrigger>
                  <AccordionContent>
                    Subsight is built with a modern tech stack including
                    Next.js, React, TypeScript, Tailwind CSS for styling, and
                    Google's Gemini model for its AI capabilities.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          Made by Muhammad Tanveer Abbas
        </p>
        <div className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="https://www.linkedin.com/in/muhammadtanveerabbas"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
          >
            <Linkedin className="w-6 h-6" />
          </Link>
          <Link
            href="https://github.com/muhammadtanveerabbas"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
          >
            <Github className="w-6 h-6" />
          </Link>
          <Link
            href="https://twitter.com/m_tanveerabbas"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
          >
            <XIcon className="w-5 h-5" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
