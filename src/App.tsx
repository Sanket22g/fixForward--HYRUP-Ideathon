import { useState } from 'react';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

export type Screen = 'landing' | 'dashboard';

function App() {
  const [screen, setScreen] = useState<Screen>('landing');

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a2235',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#f1f5f9',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
      {screen === 'landing' ? (
        <LandingPage onNavigate={setScreen} />
      ) : (
        <Dashboard onNavigate={setScreen} />
      )}
    </>
  );
}

export default App;
