import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Fixed bottom bar: back · progress · next. Always in the same place, so the flow is muscle memory.
export default function ActionBar({ onBack, onNext, nextLabel = 'Avanti', nextDisabled, position, total, docCode, companyName }) {
  const progress = Math.round((position / total) * 100);
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-sm border-t border-line">
      <div aria-hidden="true" className="h-[3px] bg-line">
        <div className="h-full bg-brand transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[80px] flex items-center justify-between gap-4">
        <div className="w-[170px]">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 h-12 px-4 text-[15px] font-semibold text-ink-soft hover:text-ink cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              Indietro
            </button>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-6 text-center min-w-0">
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-muted">Scheda {docCode}</div>
            <div className="text-[16px] font-bold text-ink truncate max-w-[320px]">{companyName || 'Azienda da compilare'}</div>
          </div>
          <span aria-hidden="true" className="w-px h-9 bg-line" />
          <div className="text-[14px] font-semibold text-muted tabular-nums whitespace-nowrap">
            Passo {position} di {total}
          </div>
        </div>

        <div className="w-[170px] flex justify-end">
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              disabled={nextDisabled}
              className="flex items-center gap-2 h-12 px-6 text-[15px] font-bold bg-brand text-white hover:bg-brand-ink transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait whitespace-nowrap"
            >
              {nextLabel}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
