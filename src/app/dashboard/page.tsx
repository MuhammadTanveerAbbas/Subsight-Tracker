import { Dashboard } from "@/components/subsight/dashboard";
import { SubscriptionProvider } from "@/contexts/subscription-context";

export default function DashboardPage() {
  return (
    <main>
      <SubscriptionProvider>
        <Dashboard />
      </SubscriptionProvider>
    </main>
  );
}
