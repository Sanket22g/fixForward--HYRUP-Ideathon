import { useState, useEffect } from "react";
import {
  Phone,
  Wrench,
  X,
  AlertTriangle,
  Signal,
  CheckCircle2,
  Clock,
  PhoneOff,
} from "lucide-react";

interface DashboardProps {
  onBack: () => void;
}

type CallState = "idle" | "calling" | "connected";

export default function Dashboard({ onBack }: DashboardProps) {
  const [callState, setCallState] = useState<CallState>("idle");
  const [dispatchToast, setDispatchToast] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  const handleCall = () => {
    setCallState("calling");
    setTimeout(() => setCallState("connected"), 1500);
  };

  const handleEndCall = () => setCallState("idle");

  const handleDispatch = () => {
    setDispatchToast(true);
    setTimeout(() => setDispatchToast(false), 3000);
  };

  return (
    <div className="min-h-screen pb-8 fade-in relative">
      {/* TOP BAR */}
      <div className="sticky top-0 z-30 bg-[#0B0F14]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white font-black text-lg tracking-tight"
          id="back-to-home-btn"
        >
          MSME<span className="text-green-400">-</span>Guard
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 live-dot" />
          <span className="text-xs font-semibold text-slate-400">Live • {formatTime(time)}</span>
        </div>
      </div>

      <div className="px-4 pt-4 max-w-sm mx-auto space-y-3">
        {/* ── MAIN ALERT CARD ── */}
        <div
          id="alert-card"
          className="rounded-2xl border border-red-500/60 bg-gradient-to-br from-red-950/40 to-slate-900/80 p-4 alert-glow-pulse slide-up"
          style={{ animationDelay: "0.05s" }}
        >
          {/* Header row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-red-400 tracking-widest uppercase">
                  Failure Risk Detected
                </p>
                <p className="text-base font-black text-white">CNC-03</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] font-bold">
              87% confidence
            </span>
          </div>

          {/* Fault detail */}
          <div className="bg-black/20 rounded-xl p-3 mb-3">
            <p className="text-sm font-semibold text-white mb-0.5">Bearing fault detected</p>
            <p className="text-xs text-red-300 font-medium">⏱ Estimated failure within 48 hours</p>
          </div>

          {/* Real-time signal label */}
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-slate-500" />
            <span className="text-[11px] text-slate-500 font-medium">Real-time signal from device</span>
          </div>
        </div>

        {/* ── COST COMPARISON ── */}
        <div
          className="slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-2 px-1">
            Cost Comparison
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* Fix Now card */}
            <div
              id="fix-now-card"
              className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 card-shadow"
            >
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Fix Now</p>
              <p className="text-3xl font-black text-white mb-1">
                ₹<span className="text-green-400">1,200</span>
              </p>
              <p className="text-xs text-slate-500 font-medium">Minor repair</p>
              <div className="mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span className="text-[10px] text-green-400 font-semibold">Recommended</span>
              </div>
            </div>

            {/* Ignore card */}
            <div
              id="ignore-card"
              className="rounded-2xl border border-red-800/50 bg-gradient-to-br from-red-950/30 to-slate-900/60 p-4 card-shadow"
            >
              <p className="text-[11px] text-red-400/80 font-semibold uppercase tracking-wider mb-1">Ignore</p>
              <p className="text-3xl font-black text-red-400">
                ₹47,000
              </p>
              <p className="text-xs text-slate-500 font-medium">Major failure</p>
              <div className="mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span className="text-[10px] text-red-400 font-semibold">High risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SAVINGS BANNER ── */}
        <div
          id="savings-card"
          className="rounded-2xl bg-gradient-to-r from-green-950/60 to-green-900/30 border border-green-500/30 px-5 py-4 flex items-center justify-between success-glow slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div>
            <p className="text-xs text-green-400/70 font-semibold uppercase tracking-wider mb-0.5">Potential Savings</p>
            <p className="text-xl font-black text-green-400">Fix early → Save ₹45,800</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 text-lg font-black">↑</span>
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div
          className="grid grid-cols-2 gap-3 slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <button
            id="call-owner-btn"
            onClick={handleCall}
            className="h-14 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.97] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
          >
            <Phone className="w-4 h-4" />
            Call Owner
          </button>

          <button
            id="dispatch-mechanic-btn"
            onClick={handleDispatch}
            className="h-14 rounded-xl bg-green-600 hover:bg-green-500 active:scale-[0.97] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-600/25"
          >
            <Wrench className="w-4 h-4" />
            Dispatch Mechanic
          </button>
        </div>

        {/* ── ACTIVITY LOG ── */}
        <div
          className="slide-up"
          style={{ animationDelay: "0.25s" }}
        >
          <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-2 px-1">
            Activity Log
          </p>
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 overflow-hidden card-shadow">
            {[
              { time: "2:14 AM", event: "Fault detected", icon: "🔍", status: "done" },
              { time: "2:14 AM", event: "Alert generated", icon: "🚨", status: "done" },
              { time: "2:15 AM", event: "Call initiated", icon: "📞", status: "done" },
              { time: "2:16 AM", event: "Mechanic dispatched", icon: "🔧", status: "done" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 px-4 py-3 ${idx < 3 ? "border-b border-slate-800/60" : ""}`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-base">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.event}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span className="text-[11px] text-slate-500 font-medium">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-slate-600 font-medium pt-2 pb-4">
          Predictive maintenance for Indian MSMEs
        </p>
      </div>

      {/* ── CALL MODAL ── */}
      {callState !== "idle" && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-t-3xl p-6 scale-in">
            {callState === "calling" ? (
              <>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center mb-4 call-ring">
                    <Phone className="w-9 h-9 text-blue-400" />
                  </div>
                  <p className="text-xs text-slate-400 font-semibold tracking-widest uppercase mb-1">Connecting...</p>
                  <h2 className="text-2xl font-black text-white mb-1">MSME-Guard Alert</h2>
                  <p className="text-sm text-slate-400">Calling machine owner</p>
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleEndCall}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-400 active:scale-95 flex items-center justify-center transition-all"
                  >
                    <PhoneOff className="w-7 h-7 text-white" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-green-400 font-bold uppercase tracking-wider">Connected</p>
                    <h2 className="text-lg font-black text-white">MSME-Guard Alert</h2>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 live-dot" />
                    <span className="text-xs text-green-400 font-semibold">Live</span>
                  </div>
                </div>

                <div className="bg-slate-800/60 rounded-xl p-4 mb-5 border border-slate-700/50">
                  <p className="text-sm font-semibold text-white mb-1">Machine fault detected</p>
                  <p className="text-xs text-slate-400">CNC-03 bearing fault • Failure risk within 48 hours</p>
                  <p className="text-xs text-slate-400 mt-1">Estimated repair cost: <span className="text-green-400 font-bold">₹1,200</span></p>
                </div>

                <button
                  id="end-call-btn"
                  onClick={handleEndCall}
                  className="w-full h-12 rounded-xl bg-red-500/90 hover:bg-red-500 active:scale-95 text-white font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <PhoneOff className="w-4 h-4" />
                  End Call
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── DISPATCH TOAST ── */}
      {dispatchToast && (
        <div className="fixed bottom-6 left-4 right-4 z-50 scale-in">
          <div className="bg-slate-800 border border-green-500/30 rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-2xl max-w-sm mx-auto">
            <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Mechanic dispatched successfully</p>
              <p className="text-xs text-slate-400">ETA: 25 minutes • CNC-03 unit</p>
            </div>
            <button onClick={() => setDispatchToast(false)} className="ml-auto text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
