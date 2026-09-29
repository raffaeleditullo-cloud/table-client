import React from 'react';
import { Check, RotateCcw, CircleHelp, Mic } from 'lucide-react';
import Logo from './Logo';

// Top bar: logo · phases · Copilota Live · FAQ MIMIT · new sheet
export default function Header({ phases, currentPhase, onPhaseClick, onReset, onOpenFaq, onOpenCopilot }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-sm border-b border-line shadow-xs">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[76px] flex items-center justify-between gap-4">
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
                    className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:opacity-80 transition-opacity"
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
          {/* ── COPILOTA LIVE CALL BUTTON ── */}
          <button
            type="button"
            onClick={onOpenCopilot}
            title="Avvia Copilota Live Chiamata con Trascrizione & AI (Tasto C)"
            className="group relative flex items-center gap-2 h-10 px-4 text-[13px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-red-600 via-brand to-brand-ink shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer overflow-hidden rounded-xs"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <Mic className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span className="font-extrabold whitespace-nowrap">Copilota Live</span>
            <span className="hidden sm:inline-block text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-normal">C</span>
          </button>

          <button
            type="button"
            onClick={onOpenFaq}
            title="Apri le FAQ e la cheat-sheet Bando MIMIT (Tasto F)"
            className="flex items-center gap-1.5 h-10 px-3.5 text-[13px] font-bold whitespace-nowrap bg-white text-ink border border-line hover:border-ink transition-colors cursor-pointer"
          >
            <CircleHelp className="w-4 h-4 text-brand" />
            <span className="hidden sm:inline">FAQ MIMIT</span>
            <span className="hidden md:inline-block text-[10px] bg-surface px-1.5 py-0.5 rounded font-mono text-muted">F</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            title="Nuova scheda di configurazione"
            className="flex items-center gap-1.5 h-10 px-3 text-[13px] font-semibold whitespace-nowrap text-ink-soft border border-line hover:border-ink transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Nuova scheda</span>
          </button>
        </div>
      </div>
    </header>
  );
}
