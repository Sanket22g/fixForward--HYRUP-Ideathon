import { useState, useEffect } from 'react';
import { PhoneOff, Phone } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function CallModal({ onClose }: Props) {
  const [stage, setStage] = useState<'ringing' | 'connected'>('ringing');

  useEffect(() => {
    const t = setTimeout(() => setStage('connected'), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center scale-in"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-t-3xl pb-10 pt-6 px-6 slide-up"
        style={{
          background: 'linear-gradient(180deg, #0d1625 0%, #0B0F14 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-slate-700 mx-auto mb-8" />

        {/* Avatar ring */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="relative">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl ${
                stage === 'ringing' ? 'call-ring' : ''
              }`}
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.2))',
                border: '2px solid rgba(59,130,246,0.5)',
                boxShadow: stage === 'ringing' ? '0 0 30px rgba(59,130,246,0.3)' : '0 0 20px rgba(34,197,94,0.3)',
              }}
            >
              🏭
            </div>
            {stage === 'connected' && (
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0d1625]" />
            )}
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-white">MSME-Guard Alert</p>
            <p className="text-sm text-slate-400 mt-1">
              {stage === 'ringing' ? (
                <span className="flex items-center gap-1 justify-center">
                  <Phone size={12} className="text-blue-400 animate-pulse" />
                  Calling owner...
                </span>
              ) : (
                <span className="text-green-400 font-medium">● Connected</span>
              )}
            </p>
          </div>
        </div>

        {/* Message bubble (shows after connected) */}
        {stage === 'connected' && (
          <div
            className="rounded-2xl p-4 mb-8 scale-in"
            style={{
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.2)',
            }}
          >
            <p className="text-sm text-blue-200 font-medium mb-1">🤖 Auto-message sent:</p>
            <p className="text-white text-base font-semibold">"Machine fault detected on CNC-03. Immediate attention required."</p>
          </div>
        )}

        {/* End Call button */}
        <button
          id="end-call-btn"
          onClick={onClose}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-bold text-base transition-all active:scale-[0.97] hover:brightness-110"
          style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            boxShadow: '0 4px 20px rgba(239,68,68,0.35)',
          }}
        >
          <PhoneOff size={18} />
          End Call
        </button>
      </div>
    </div>
  );
}
