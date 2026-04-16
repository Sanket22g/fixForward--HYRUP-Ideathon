import { Phone, Truck } from "lucide-react";
import { toast } from "sonner";

export const ActionButtons = () => {
  return (
    <section aria-label="Actions" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        onClick={() => toast.success("Calling owner…", { description: "Connecting to +91 98••• ••421" })}
        className="flex items-center justify-center gap-3 rounded-2xl bg-primary text-primary-foreground py-5 px-6 text-lg font-semibold active:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
      >
        <Phone className="h-5 w-5" strokeWidth={2.5} />
        Call Owner
      </button>
      <button
        onClick={() => toast.success("Mechanic dispatched", { description: "ETA 22 min · Ravi K." })}
        className="flex items-center justify-center gap-3 rounded-2xl bg-success text-success-foreground py-5 px-6 text-lg font-semibold active:scale-[0.98] transition-transform shadow-lg shadow-success/20"
      >
        <Truck className="h-5 w-5" strokeWidth={2.5} />
        Dispatch Mechanic
      </button>
    </section>
  );
};
