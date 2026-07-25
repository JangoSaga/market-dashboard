import { Toaster } from "sonner";

import { AlertMonitor } from "@/components/market/alert-monitor";
import { PriceStreamProvider } from "@/components/market/price-stream-provider";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: activeAlerts } = user
    ? await supabase
        .from("alerts")
        .select("id, symbol, direction, target_price")
        .eq("user_id", user.id)
        .eq("status", "active")
    : { data: [] };

  return (
    <PriceStreamProvider>
      <div className="flex min-h-full flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>
      </div>
      <AlertMonitor alerts={activeAlerts ?? []} />
      <Toaster theme="dark" position="top-right" richColors />
    </PriceStreamProvider>
  );
}
