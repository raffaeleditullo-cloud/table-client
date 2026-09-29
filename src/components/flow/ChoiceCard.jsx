import React from 'react';
import { Check } from 'lucide-react';

// Big, readable choice tile. `compact` for dense lists (sectors, extras).
export default function ChoiceCard({
  selected,
  onSelect,
  icon: Icon,
  title,
  description,
  badge,
  footer,
  compact = false,
  className = '',
  style,
  children
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      style={style}
      className={`relative h-full flex flex-col text-left border cursor-pointer select-none transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        compact ? 'p-4' : 'p-6'
      } ${
        selected
          ? 'bg-brand-soft/25 border-brand ring-2 ring-brand shadow-lg'
          : 'bg-surface border-line hover:border-line-strong hover:shadow-[0_10px_28px_-18px_rgba(11,11,12,0.35)] hover:-translate-y-px'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        {Icon && (
          <span
            className={`flex items-center justify-center shrink-0 transition-colors ${
              compact ? 'w-10 h-10' : 'w-12 h-12'
            } ${selected ? 'bg-brand text-white shadow-sm' : 'bg-sunken text-ink'}`}
          >
            <Icon className={compact ? 'w-5 h-5' : 'w-6 h-6'} strokeWidth={1.75} />
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {selected && (
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-brand text-white rounded-none">
              ✓ Selezionato
            </span>
          )}
          <span
            aria-hidden="true"
            className={`w-6 h-6 shrink-0 flex items-center justify-center border-2 transition-colors ${
              selected ? 'bg-brand border-brand text-white' : 'bg-surface border-line-strong'
            }`}
          >
            {selected && <Check className="w-4 h-4" strokeWidth={3} />}
          </span>
        </div>
      </div>

      {badge && (
        <span className="mt-4 self-start text-[12px] font-bold px-2 py-1 bg-brand-soft text-brand-ink">{badge}</span>
      )}

      {title && (
        <h3 className={`font-bold text-ink leading-snug ${compact ? 'mt-3 text-[15px]' : 'mt-4 text-[19px]'}`}>
          {title}
        </h3>
      )}
      {description && (
        <p className={`text-muted leading-relaxed ${compact ? 'mt-1 text-[13px]' : 'mt-2 text-[15px]'}`}>{description}</p>
      )}
      {children}
      {footer && <div className="mt-auto pt-5">{footer}</div>}
    </div>
  );
}
