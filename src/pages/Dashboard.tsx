import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Phone, Wrench, AlertTriangle, ChevronLeft, X, Radio } from 'lucide-react';
import { type Screen } from '../App';
import ActivityLog from '../components/ActivityLog';
import CallModal from '../components/CallModal';

interface Props {
  onNavigate: (screen: Screen) => void;
}

function useTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Dashboard({ onNavigate }: Props) {
  const time = useTime();
  const [callOpen, setCallOpen] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [logItems, setLogItems] = useState([
    { time: '2:14 AM', text: 'Fault detected', icon: '⚡' },
    { time: '2:14 AM', text: 'Alert generated', icon: '🔔' },
  ]);

  const handleCallOwner = () => {
    setCallOpen(true);
    setLogItems((prev) => {
      if (prev.some((i) => i.text === 'Call initiated')) return prev;
      return [...prev, { time: '2:15 AM', text: 'Call initiated', icon: '📞' }];
    });
  };

  const handleDispatch = () => {
    if (dispatched) return;
    setDispatched(true);
    toast.success('✅ Mechanic dispatched successfully', {
      description: 'Rajesh Kumar is on the way — ETA 22 mins',
      duration: 4000,
    });
    setLogItems((prev) => {
      if (prev.some((i) => i.text === 'Mechanic dispatched')) return prev;
      return [...prev, { time: '2:16 AM', text: 'Mechanic dispatched', icon: '🔧' }];
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(170deg, #0B0F14 0%, #111827 100%)' }}>
      {/* TOP BAR */}
      <header
        className="flex items-center justify-between px-4 py-3 sticky top-0 z-30"
        style={{
          background: 'rgba(11,15,20,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          <button
            id="back-btn"
            onClick={() => onNavigate('landing')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-white font-black text-lg tracking-tight">
            MSME<span className="text-green-400">Guard</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 live-dot" />
          <span className="text-sm text-slate-300 font-medium">Live • {time}</span>
        </div>
      </header>

      {/* SCROLLABLE CONTENT */}
      <main className="flex-1 px-4 pb-8 pt-4 max-w-md mx-auto w-full flex flex-col gap-4">

        {/* ALERT CARD */}
        <div
          id="alert-card"
          className="rounded-2xl p-5 alert-glow-pulse slide-up"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.05))',
            border: '1.5px solid rgba(239,68,68,0.5)',
          }}
        >
          {/* Badge row */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-red-400"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <AlertTriangle size={11} />
              FAILURE RISK DETECTED
            </span>
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-blue-300"
              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}
            >
              <Radio size={10} className="animate-pulse" />
              Real-time signal
            </span>
          </div>

          {/* Machine */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-black text-white">CNC-03</span>
            <span
              className="px-2 py-0.5 rounded-md text-xs font-bold text-orange-400"
              style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.25)' }}
            >
              87% confidence
            </span>
          </div>

          <p className="text-base font-semibold text-red-300 mb-1">Bearing fault detected</p>
          <p className="text-sm text-slate-400">⏱ Estimated failure within <span className="text-orange-400 font-semibold">48 hours</span></p>
        </div>

        {/* COST COMPARISON */}
        <div className="slide-up" style={{ animationDelay: '0.08s' }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 px-1">Cost Comparison</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Fix Now */}
            <div
              className="rounded-2xl p-4 flex flex-col gap-1"
              style={{
                background: 'rgba(34,197,94,0.07)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              <p className="text-xs font-semibold text-slate-400">Fix Now</p>
              <p className="text-3xl font-black text-green-400">₹1,200</p>
              <p className="text-xs text-slate-500">Minor repair</p>
            </div>

            {/* Ignore */}
            <div
              className="rounded-2xl p-4 flex flex-col gap-1"
              style={{
                background: 'rgba(239,68,68,0.07)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              <p className="text-xs font-semibold text-slate-400">Ignore</p>
              <p className="text-4xl font-black text-red-400">₹47K</p>
              <p className="text-xs text-slate-500">Major failure</p>
            </div>
          </div>
        </div>

        {/* SAVINGS CARD */}
        <div
          className="rounded-2xl p-4 flex items-center justify-between slide-up"
          style={{
            animationDelay: '0.12s',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.18), rgba(16,185,129,0.08))',
            border: '1px solid rgba(34,197,94,0.35)',
            boxShadow: '0 0 24px rgba(34,197,94,0.12)',
          }}
        >
          <div>
            <p className="text-xs font-semibold text-green-500 uppercase tracking-widest mb-0.5">You save</p>
            <p className="text-2xl font-black text-green-400">₹45,800</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-green-300">Fix early →</p>
            <p className="text-xs text-slate-400">Save big</p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-3 slide-up" style={{ animationDelay: '0.16s' }}>
          <button
            id="call-owner-btn"
            onClick={handleCallOwner}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.96] hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
            }}
          >
            <Phone size={16} />
            Call Owner
          </button>

          <button
            id="dispatch-mechanic-btn"
            onClick={handleDispatch}
            disabled={dispatched}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.96] hover:brightness-110 disabled:opacity-70"
            style={{
              background: dispatched
                ? 'linear-gradient(135deg, #166534, #14532d)'
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
              boxShadow: dispatched ? 'none' : '0 4px 20px rgba(34,197,94,0.3)',
            }}
          >
            <Wrench size={16} />
            {dispatched ? 'Dispatched ✓' : 'Dispatch'}
          </button>
        </div>

        {/* ACTIVITY LOG */}
        <ActivityLog items={logItems} />
      </main>

      {/* FOOTER */}
      <footer
        className="py-3 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <p className="text-xs text-slate-600">Predictive maintenance for Indian MSMEs</p>
      </footer>

      {/* CALL MODAL */}
      {callOpen && <CallModal onClose={() => setCallOpen(false)} />}
    </div>
  );
}
