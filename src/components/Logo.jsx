import React from 'react';

// CONFLAVORO TABLE CLIENT STUDIO — marchio ufficiale.
// Il simbolo è una "tavola" 2×2: tre caselle aperte e una piena nel blu brand (la scelta del cliente).
export function LogoMark({ size = 40, className = '' }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" className={`shrink-0 ${className}`}>
      <rect width="40" height="40" fill="#0b0b0c" />
      <rect x="8.5" y="8.5" width="10" height="10" fill="none" stroke="#ffffff" strokeWidth="2" />
      <rect x="21.5" y="8.5" width="10" height="10" fill="none" stroke="#ffffff" strokeWidth="2" />
      <rect x="8.5" y="21.5" width="10" height="10" fill="none" stroke="#ffffff" strokeWidth="2" />
      <rect x="20.5" y="20.5" width="12" height="12" fill="#1f47d1" />
    </svg>
  );
}

export default function Logo({ size = 40, compact = false }) {
  return (
    <div className="flex items-center gap-3 min-w-0" aria-label="Conflavoro Table Client Studio">
      <LogoMark size={size} />
      <div className="min-w-0 leading-none">
        <div className="text-[18px] font-extrabold tracking-[0.06em] text-ink whitespace-nowrap">CONFLAVORO</div>
        {!compact && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[9.5px] font-semibold tracking-[0.3em] text-muted whitespace-nowrap">
            <span>TABLE CLIENT</span>
            <span aria-hidden="true" className="w-1 h-1 bg-brand" />
            <span>STUDIO</span>
          </div>
        )}
      </div>
    </div>
  );
}
