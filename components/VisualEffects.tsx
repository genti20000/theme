
import React, { useMemo } from 'react';
import { Star } from 'lucide-react';

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

const VisualEffects: React.FC = () => {
  const sparkles = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    style: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`
    }
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Light Rays - Subtle atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200vw] h-[200vw] origin-top">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_50%)]"
          style={{ animation: 'ray-sweep 25s linear infinite' }}
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.02)_0%,transparent_40%)]"
          style={{ animation: 'ray-sweep 18s linear infinite reverse' }}
        />
      </div>

      {/* Sparkles spread across the screen */}
      {sparkles.map(s => <Sparkle key={s.id} style={s.style} />)}
      
      {/* Gradient overlay to ground the effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
  );
};

export default VisualEffects;
