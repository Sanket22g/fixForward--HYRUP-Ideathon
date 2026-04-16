interface LogItem {
  time: string;
  text: string;
  icon: string;
}

interface Props {
  items: LogItem[];
}

export default function ActivityLog({ items }: Props) {
  return (
    <div
      className="rounded-2xl p-4 slide-up"
      style={{
        animationDelay: '0.2s',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Activity Log</p>

      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-[22px] top-2 bottom-2 w-px"
          style={{ background: 'linear-gradient(to bottom, rgba(34,197,94,0.4), rgba(34,197,94,0.05))' }}
        />

        <div className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 pl-1 scale-in" style={{ animationDelay: `${idx * 0.05}s` }}>
              {/* Dot */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-base z-10"
                style={{
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-mono">{item.time}</p>
                <p className="text-sm text-slate-200 font-medium">{item.text}</p>
              </div>
              {/* Checkmark for completed */}
              <span className="text-green-500 text-xs">✓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
