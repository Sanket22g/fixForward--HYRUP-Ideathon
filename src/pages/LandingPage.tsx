import { toast } from 'sonner';
import { type Screen } from '../App';
import { Cpu, Zap, Shield } from 'lucide-react';

interface Props {
  onNavigate: (screen: Screen) => void;
}

export default function LandingPage({ onNavigate }: Props) {
  const handleConnectDevice = () => {
    toast('📡 Waiting for device connection...', {
      description: 'Searching for MSME-Guard hardware on local network',
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full opacity-10 blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-72 h-72 rounded-full opacity-10 blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
      />

      {/* Feature pills */}
      <div className="flex gap-2 mb-10 fade-in flex-wrap justify-center">
        {[
          { icon: Zap, label: 'Real-time Alerts' },
          { icon: Shield, label: 'Failure Prevention' },
          { icon: Cpu, label: 'AIoT Powered' },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#86efac',
            }}
          >
            <Icon size={11} />
            {label}
          </span>
        ))}
      </div>

      {/* Logo shield */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 fade-in"
        style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(59,130,246,0.1))',
          border: '1px solid rgba(34,197,94,0.3)',
          boxShadow: '0 0 30px rgba(34,197,94,0.15)',
        }}
      >
        <Shield size={38} className="text-green-400" />
      </div>

      {/* Title */}
      <h1
        className="text-5xl font-black tracking-tight text-white mb-3 fade-in text-center"
        style={{ animationDelay: '0.05s', letterSpacing: '-1.5px' }}
      >
        MSME<span className="text-green-400">Guard</span>
      </h1>

      {/* Tagline */}
      <p
        className="text-lg font-semibold fade-in text-center"
        style={{
          animationDelay: '0.1s',
          background: 'linear-gradient(90deg, #86efac, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Predict. Prevent. Protect.
      </p>

      {/* Sub-description */}
      <p
        className="text-sm text-slate-400 mt-3 mb-10 text-center max-w-xs fade-in"
        style={{ animationDelay: '0.15s' }}
      >
        Real-time predictive maintenance for MSMEs
      </p>

      {/* Action buttons */}
      <div className="w-full max-w-xs flex flex-col gap-3 fade-in" style={{ animationDelay: '0.2s' }}>
        <button
          id="view-demo-btn"
          onClick={() => onNavigate('dashboard')}
          className="w-full py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 active:scale-[0.97] hover:scale-[1.02] hover:brightness-110"
          style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            boxShadow: '0 4px 24px rgba(34,197,94,0.35)',
          }}
        >
          ▶ View Demo
        </button>

        <button
          id="connect-device-btn"
          onClick={handleConnectDevice}
          className="w-full py-4 rounded-2xl text-base font-semibold text-green-400 transition-all duration-200 active:scale-[0.97] hover:scale-[1.02]"
          style={{
            background: 'transparent',
            border: '1.5px solid rgba(34,197,94,0.4)',
          }}
        >
          Connect Live Device
        </button>
      </div>

      {/* Data source label */}
      <p className="mt-6 text-xs text-slate-500 fade-in text-center" style={{ animationDelay: '0.25s' }}>
        📍 Demo based on real MSME data (Nashik MIDC)
      </p>

      {/* Bottom trust strip */}
      <div
        className="absolute bottom-0 left-0 right-0 py-3 px-6 flex justify-center fade-in"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          animationDelay: '0.3s',
        }}
      >
        <p className="text-xs text-slate-500">Predictive maintenance for Indian MSMEs</p>
      </div>
    </div>
  );
}
