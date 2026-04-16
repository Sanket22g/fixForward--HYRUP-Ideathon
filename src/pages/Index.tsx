import { AlertCard } from "@/components/AlertCard";
import { CostComparison } from "@/components/CostComparison";
import { ActionButtons } from "@/components/ActionButtons";
import { ActivityLog } from "@/components/ActivityLog";
import { ShieldCheck } from "lucide-react";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-xl px-4 py-6 sm:py-10 space-y-5">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            <span className="font-semibold tracking-tight">MSME-Guard</span>
          </div>
          <span className="text-xs text-muted-foreground tabular">Live · 02:16 AM</span>
        </header>

        {/* 1. Alert */}
        <AlertCard
          machine="CNC-03"
          fault="Bearing fault detected"
          window="48 hours"
          confidence={87}
        />

        {/* 2. Cost decision */}
        <CostComparison fixCost={1200} ignoreCost={47000} />

        {/* 3. Actions */}
        <ActionButtons />

        {/* 4. Activity */}
        <ActivityLog />

        <p className="pt-2 pb-6 text-center text-[11px] text-muted-foreground">
          Predictive maintenance for Indian MSMEs
        </p>
      </div>
    </main>
  );
};

export default Index;
