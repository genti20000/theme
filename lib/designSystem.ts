export const DS = {
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  typography: {
    display: 'text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95]',
    h1: 'text-3xl md:text-5xl font-black tracking-tight leading-tight',
    h2: 'text-2xl md:text-4xl font-extrabold tracking-tight leading-tight',
    h3: 'text-xl md:text-2xl font-bold tracking-tight',
    body: 'text-sm md:text-base text-zinc-300 leading-relaxed',
    bodySm: 'text-xs md:text-sm text-zinc-400 leading-relaxed'
  },
  colors: {
    bg: '#0a0a0a',
    bgElevated: '#111114',
    border: 'rgba(255,255,255,0.12)',
    accent: '#facc15'
  }
} as const;
