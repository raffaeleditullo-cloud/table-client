import React from 'react';

// One question per screen: big question, one-line help, then the choices.
// `aside` (e.g. live preview) sits on the right on wide screens.
export default function ScreenFrame({ eyebrow, title, subtitle, aside, children }) {
  return (
    <section className="animate-screen">
      <div className="max-w-3xl">
        {eyebrow && <p className="text-[14px] font-bold text-brand">{eyebrow}</p>}
        <h1 className="mt-2 text-[32px] sm:text-[40px] leading-[1.1] font-extrabold tracking-[-0.025em] text-ink">
          {title}
        </h1>
        {subtitle && <p className="mt-3 text-[17px] text-muted leading-relaxed">{subtitle}</p>}
      </div>

      {aside ? (
        <div className="mt-10 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] gap-10 items-start">
          <div className="min-w-0">{children}</div>
          <div className="xl:sticky xl:top-[120px]">{aside}</div>
        </div>
      ) : (
        <div className="mt-10">{children}</div>
      )}
    </section>
  );
}

export function SectionTitle({ children, hint }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="text-[18px] font-bold text-ink">{children}</h2>
      {hint && <span className="text-[14px] text-muted">{hint}</span>}
    </div>
  );
}
