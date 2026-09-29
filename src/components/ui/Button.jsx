import React from 'react';

const VARIANTS = {
  primary: 'bg-ink text-white hover:bg-ink-soft',
  accent: 'bg-accent text-on-accent hover:brightness-95',
  ghost: 'bg-surface text-ink border border-line-strong hover:border-ink'
};

const SIZES = {
  sm: 'h-9 px-3.5 text-[12px]',
  md: 'h-11 px-5 text-[13px]',
  lg: 'h-14 px-7 text-[15px]'
};

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2.5 font-semibold tracking-[0.02em] cursor-pointer transition-[background-color,border-color,filter] duration-150 active:translate-y-px disabled:opacity-70 disabled:cursor-wait ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
