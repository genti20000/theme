import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type AnchorProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

const base = 'inline-flex items-center justify-center min-h-11 px-5 rounded-full text-xs md:text-sm font-black uppercase tracking-[0.08em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/70 active:scale-[0.98]';
const variants: Record<Variant, string> = {
  primary: 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_24px_rgba(250,204,21,0.28)]',
  secondary: 'bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700',
  ghost: 'bg-transparent text-zinc-200 border border-zinc-700 hover:bg-zinc-900'
};

const Button: React.FC<AnchorProps | ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const cls = `${base} ${variants[variant]} ${className}`.trim();

  if ('href' in props && props.href) {
    const { href, ...rest } = props;
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} {...(props as ButtonProps)}>
      {children}
    </button>
  );
};

export default Button;
