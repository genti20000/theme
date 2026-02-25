import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type AnchorProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

const base = 'inline-flex items-center justify-center h-10 px-5 rounded-full text-xs md:text-sm font-black uppercase tracking-[0.08em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/70 active:scale-[0.98]';
const variants: Record<Variant, string> = {
  primary: 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_18px_40px_rgba(250,204,21,0.2)]',
  secondary: 'bg-white/5 text-white border border-white/15 hover:bg-white/10',
  ghost: 'bg-transparent text-zinc-200 border border-white/15 hover:bg-white/5'
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
