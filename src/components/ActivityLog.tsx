interface LogEntry {
  time: string;
  event: string;
  tone?: "danger" | "success" | "default";
}

const entries: LogEntry[] = [
  { time: "2:14 AM", event: "Fault detected", tone: "danger" },
  { time: "2:14 AM", event: "Alert generated", tone: "danger" },
  { time: "2:15 AM", event: "Call initiated", tone: "default" },
  { time: "2:16 AM", event: "Mechanic dispatched", tone: "success" },
];

const toneClass = (t?: LogEntry["tone"]) =>
  t === "danger" ? "bg-danger" : t === "success" ? "bg-success" : "bg-muted-foreground/60";

export const ActivityLog = () => {
  return (
    <section aria-label="Activity log" className="rounded-2xl bg-card p-5 sm:p-6">
      <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
        Activity
      </h2>
      <ol className="space-y-3">
        {entries.map((e, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${toneClass(e.tone)}`} />
            <span className="text-muted-foreground tabular w-16 shrink-0">{e.time}</span>
            <span className="text-foreground/90">{e.event}</span>
          </li>
        ))}
      </ol>
    </section>
  );
};
