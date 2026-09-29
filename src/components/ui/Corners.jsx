import React from 'react';

// HUD lock-on brackets drawn on the four corners of the parent (parent must be `relative`)
const POSITIONS = [
  'top-0 left-0',
  'top-0 right-0 rotate-90',
  'bottom-0 right-0 rotate-180',
  'bottom-0 left-0 -rotate-90'
];

export default function Corners({ size = 12, className = 'text-ink' }) {
  return (
    <>
      {POSITIONS.map((pos) => (
        <svg
          key={pos}
          aria-hidden="true"
          viewBox="0 0 12 12"
          width={size}
          height={size}
          className={`pointer-events-none absolute -m-px ${pos} ${className}`}
        >
          <path d="M1 11V1h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        </svg>
      ))}
    </>
  );
}
