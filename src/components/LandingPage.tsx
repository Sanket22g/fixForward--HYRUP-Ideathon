import { useState } from "react";
import { Zap, Wifi } from "lucide-react";

interface LandingPageProps {
  onViewDemo: () => void;
}

export default function LandingPage({ onViewDemo }: LandingPageProps) {
  const [toast, setToast] = useState(false);

  const handleConnectDevice = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-green-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full fade-in">
        {/* Logo mark */}
        <div className="mb-8 relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center">
            <Zap className="w-10 h-10 text-green-400" strokeWidth={2} />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-400 live-dot" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-black tracking-tight text-white mb-3">
          MSME<span className="text-green-400">-</span>Guard
        </h1>

        {/* Tagline */}
        <p className="text-xl font-semibold text-slate-300 mb-3 tracking-wide">
          Predict. Prevent. Protect.
        </p>

        {/* Sub-tagline */}
        <p className="text-sm text-slate-500 mb-10 font-medium">
          Real-time predictive maintenance for MSMEs
        </p>

        {/* CTA Buttons */}
        <div className="w-full flex flex-col gap-3 mb-8">
          <button
            id="view-demo-btn"
            onClick={onViewDemo}
            className="w-full h-14 rounded-xl bg-green-500 hover:bg-green-400 active:scale-[0.98] text-black font-bold text-base transition-all duration-200 shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            View Demo
          </button>

          <button
            id="connect-device-btn"
            onClick={handleConnectDevice}
            className="w-full h-14 rounded-xl border border-slate-600 hover:border-slate-400 active:scale-[0.98] text-slate-300 hover:text-white font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.06]"
          >
            <Wifi className="w-5 h-5" />
            Connect Live Device
          </button>
        </div>

        {/* Trust line */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span>Demo based on real MSME data (Nashik MIDC)</span>
        </div>
      </div>

      {/* Bottom badge */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <span>Powered by AIoT</span>
          <span>•</span>
          <span>Made for Indian MSMEs</span>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-4 right-4 z-50 scale-in">
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-2xl max-w-sm mx-auto">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Wifi className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Waiting for device...</p>
              <p className="text-xs text-slate-400">Scanning on local network</p>
            </div>
            <div className="ml-auto flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
