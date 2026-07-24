import { Navbar } from "@/components/navbar";
import { PriceStreamProvider } from "@/components/market/price-stream-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PriceStreamProvider>
      <div className="flex min-h-full flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>
      </div>
    </PriceStreamProvider>
  );
}
