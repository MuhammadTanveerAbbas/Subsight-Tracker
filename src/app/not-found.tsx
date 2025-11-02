import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Target, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          <span className="text-2xl font-semibold tracking-tight font-headline">
            Subsight
          </span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-8xl md:text-9xl font-bold gradient-text">404</h1>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
