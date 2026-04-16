import { AlertTriangle } from "lucide-react";

interface AlertCardProps {
  machine: string;
  fault: string;
  window: string;
  confidence: number;
}

export const AlertCard = ({ machine, fault, window, confidence }: AlertCardProps) => {
  return (
    <section
      aria-label="Failure risk alert"
      className="relative rounded-2xl bg-card p-6 sm:p-8 ring-danger overflow-hidden"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-danger opacity-75 pulse-danger" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-danger" />
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
            Machine · {machine}
          </span>
        </div>
        <span className="text-xs font-semibold text-danger tabular">
          {confidence}% confidence
        </span>
      </div>

      <div className="flex items-start gap-3">
        <AlertTriangle className="h-7 w-7 text-danger shrink-0 mt-1" strokeWidth={2.5} />
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-danger leading-[1.05]">
            FAILURE RISK<br className="sm:hidden" /> DETECTED
          </h1>
          <p className="mt-3 text-base sm:text-lg text-foreground/90 font-medium">
            {fault}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Failure expected within {window}
          </p>
        </div>
      </div>
    </section>
  );
};
