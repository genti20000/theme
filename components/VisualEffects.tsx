
import React, { useMemo } from 'react';
import { Music, Mic2, Star } from 'lucide-react';

// Explicitly type as React.FC to handle standard React props like 'key' correctly in TypeScript
const Sparkle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div 
    className="absolute pointer-events-none text-white/40"
    style={{
      animation: `sparkle-blink ${Math.random() * 2 + 1}s linear infinite`,
      ...style
    }}
  >
    <Star size={Math.random() * 8 + 4} fill="currentColor" />
  </div>
);

// Explicitly type as React.FC to handle standard React props like 'key' correctly in TypeScript
const FloatingNote: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
  const Icon = Math.random() > 0.5 ? Music : Mic2;
  
  // Memoize random drift and rotation values to prevent re-randomization on every render
  const drift = useMemo(() => (Math.random() - 0.5) * 150, []); // Increased drift range
  const rotation = useMemo(() => (Math.random() - 0.5) * 90, []); // Increased rotation range
  const duration = useMemo(() => Math.random() * 8 + 8, []); // Slower, more elegant rise
  const size = useMemo(() => Math.random() * 20 + 20, []); // Slightly larger icons

  return (
    <div 
      className="absolute pointer-events-none text-white/40 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
      style={{
        animation: `float-note ${duration}s ease-in-out infinite`,
        ['--drift' as any]: `${drift}px`,
        ['--rotation' as any]: `${rotation}deg`,
        ...style
      } as React.CSSProperties}
    >
      <Icon size={size} strokeWidth={1.5} />
    </div>
  );
};

const VisualEffects: React.FC = () => {
  const sparkles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    style: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`
    }
  })), []);

  const notes = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      bottom: `-${Math.random() * 10}vh`,
      animationDelay: `${Math.random() * 12}s`
    }
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Light Rays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200vw] h-[200vw] origin-top">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)]"
          style={{ animation: 'ray-sweep 20s linear infinite' }}
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.03)_0%,transparent_40%)]"
          style={{ animation: 'ray-sweep 15s linear infinite reverse' }}
        />
      </div>

      {/* Mirror Ball */}
      <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-32 h-32 md:w-48 md:h-48 group">
        {/* String */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-10 bg-gradient-to-b from-zinc-800 to-zinc-500" />
        
        {/* Ball Body */}
        <div className="absolute top-10 w-full h-full rounded-full bg-zinc-400 overflow-hidden shadow-[0_10px_40px_rgba(255,255,255,0.2)] border border-white/20">
          <div 
            className="absolute inset-0 disco-ball-grid"
            style={{ animation: 'rotate-disco 10s linear infinite' }}
          />
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-white/10 pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/40 rounded-full blur-xl" />
        </div>
      </div>

      {/* Sparkles spread across */}
      {sparkles.map(s => <Sparkle key={s.id} style={s.style} />)}

      {/* Musical notes at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-64 overflow-hidden">
        {notes.map(n => <FloatingNote key={n.id} style={n.style} />)}
      </div>
    </div>
  );
};

export default VisualEffects;
