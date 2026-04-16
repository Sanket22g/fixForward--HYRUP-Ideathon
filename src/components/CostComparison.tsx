import { TrendingDown, Wrench } from "lucide-react";

interface CostComparisonProps {
  fixCost: number;
  ignoreCost: number;
}

const formatINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN");

export const CostComparison = ({ fixCost, ignoreCost }: CostComparisonProps) => {
  const savings = ignoreCost - fixCost;

  return (
    <section aria-label="Cost comparison" className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Fix Now */}
        <article className="rounded-2xl bg-card p-5 sm:p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="h-4 w-4 text-success" />
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Fix Now
            </h2>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-foreground tabular leading-none">
            {formatINR(fixCost)}
          </p>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
            Minor repair
          </p>
        </article>

        {/* Ignore */}
        <article className="relative rounded-2xl bg-card p-5 sm:p-6 border border-danger/40 overflow-hidden">
          <div className="absolute inset-0 bg-danger/5 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-4 w-4 text-danger" />
              <h2 className="text-xs uppercase tracking-wider text-danger font-semibold">
                Ignore
              </h2>
            </div>
            <p className="text-4xl sm:text-5xl font-black text-danger tabular leading-none">
              {formatINR(ignoreCost)}
            </p>
            <p className="mt-3 text-xs sm:text-sm text-danger/80 font-medium">
              Major failure
            </p>
          </div>
        </article>
      </div>

      {/* Savings highlight */}
      <div className="rounded-2xl bg-success/10 border border-success/30 p-5 sm:p-6 text-center">
        <p className="text-xs sm:text-sm text-success/80 font-medium uppercase tracking-wider">
          By fixing early
        </p>
        <p className="mt-2 text-3xl sm:text-4xl font-black text-success tabular leading-tight">
          You save {formatINR(savings)}
        </p>
      </div>
    </section>
  );
};
