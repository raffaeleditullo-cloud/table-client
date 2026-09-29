import React from 'react';
import { Check, Plus } from 'lucide-react';

// Toggle chip for fast multi-select while on the phone
export function ToggleChip({ selected, onToggle, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`inline-flex items-center gap-2 min-h-11 px-3.5 py-2 text-left text-[14px] font-semibold border transition-colors cursor-pointer ${
        selected
          ? 'bg-brand border-brand text-white'
          : 'bg-surface border-line-strong text-ink hover:border-ink'
      }`}
    >
      {selected ? <Check className="w-4 h-4 shrink-0" strokeWidth={3} /> : Icon ? <Icon className="w-4 h-4 shrink-0 text-muted" strokeWidth={1.75} /> : null}
      {children}
    </button>
  );
}

// Textarea with one-click suggestions appended as bullet lines
export function NoteArea({ label, hint, value, onChange, placeholder, suggestions = [], rows = 6, tone = 'default' }) {
  const addLine = (text) => {
    const line = `• ${text}`;
    if (value.includes(line)) return;
    onChange(value.trim() ? `${value.replace(/\s+$/, '')}\n${line}` : line);
  };

  return (
    <div className={`bg-surface border p-5 sm:p-6 ${tone === 'brand' ? 'border-brand' : 'border-line'}`}>
      <label className="block">
        <span className="block text-[17px] font-bold text-ink">{label}</span>
        {hint && <span className="block mt-1 text-[14px] text-muted">{hint}</span>}
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-4 w-full px-4 py-3 text-[15px] leading-relaxed text-ink bg-surface border border-line-strong outline-none resize-y transition-colors placeholder:text-faint focus:border-brand focus:ring-3 focus:ring-brand/20"
        />
      </label>
      {suggestions.length > 0 && (
        <div className="mt-4">
          <span className="block mb-2 text-[13px] font-semibold text-muted">Aggiungi con un clic</span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => {
              const used = value.includes(`• ${s}`);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => addLine(s)}
                  disabled={used}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] font-semibold border transition-colors ${
                    used
                      ? 'bg-brand-soft border-transparent text-brand-ink cursor-default'
                      : 'bg-surface border-line text-ink-soft hover:border-ink cursor-pointer'
                  }`}
                >
                  {used ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <Plus className="w-3.5 h-3.5" />}
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
