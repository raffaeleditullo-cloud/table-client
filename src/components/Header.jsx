import React from 'react';
import { Check, RotateCcw, CircleHelp } from 'lucide-react';
import Logo from './Logo';

// Top bar: logo · phases · FAQ MIMIT · new sheet
export default function Header({ phases, currentPhase, onPhaseClick, onReset, onOpenFaq }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-sm border-b border-line">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[76px] flex items-center justify-between gap-6">
        <div className="shrink-0"><Logo /></div>

        <nav aria-label="Fasi" className="hidden md:block">
          <ol className="flex items-center gap-1">
            {phases.map((phase, idx) => {
              const isActive = idx === currentPhase;
              const isDone = idx < currentPhase;
              return (
                <li key={phase.id} className="flex items-center">
                  {idx > 0 && <span aria-hidden="true" className={`w-4 lg:w-6 h-px mx-0.5 ${isDone || isActive ? 'bg-ink' : 'bg-line-strong'}`} />}
                  <button
                    type="button"
                    onClick={() => onPhaseClick(phase)}
                    aria-current={isActive ? 'step' : undefined}
                    className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer"
                  >
                    <span
                      className={`w-7 h-7 flex items-center justify-center text-[13px] font-bold transition-colors ${
                        isActive ? 'bg-brand text-white' : isDone ? 'bg-ink text-white' : 'bg-surface text-muted border border-line-strong'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" strokeWidth={3} /> : idx + 1}
                    </span>
                    <span className={`${isActive ? 'hidden lg:block' : 'hidden 2xl:block'} text-[14px] font-semibold whitespace-nowrap ${isActive ? 'text-ink' : isDone ? 'text-ink-soft' : 'text-muted'}`}>
                      {phase.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenFaq}
            title="Apri la cheat-sheet (tasto F)"
            className="flex items-center gap-2 h-10 px-3.5 text-[14px] font-bold whitespace-nowrap bg-brand text-white hover:bg-brand-ink transition-colors cursor-pointer"
          >
            <CircleHelp className="w-4 h-4" />
            <span className="hidden sm:inline">FAQ MIMIT</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            title="Nuova scheda"
            className="flex items-center gap-2 h-10 px-3.5 text-[14px] font-semibold whitespace-nowrap text-ink-soft border border-line hover:border-ink transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden xl:inline">Nuova scheda</span>
          </button>
        </div>
      </div>
    </header>
  );
}
