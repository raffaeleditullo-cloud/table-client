import React, { useState } from 'react';
import {
  BadgeCheck,
  Layers,
  Sparkles,
  CheckCheck,
  X,
  PlusCircle,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { SOLUTIONS, isRecommended, getSolution } from '../../data/catalog';
import { getIcon } from '../../data/icons';
import ScreenFrame from '../flow/ScreenFrame';

export default function SolutionsScreen({ selectedSector, solutionIds, onToggle, error }) {
  const [plainMode, setPlainMode] = useState(true);
  const selectedCount = solutionIds.length;
  const recommendedIds = selectedSector?.recommended || [];

  const handleSelectAllRecommended = () => {
    recommendedIds.forEach((id) => {
      if (!solutionIds.includes(id)) {
        onToggle(id);
      }
    });
  };

  const sectorKey = selectedSector?.id || 'other';

  return (
    <ScreenFrame
      eyebrow="Fabbisogno"
      title="Quali soluzioni servono all'azienda / studio?"
      subtitle="Aree ammissibili al Voucher MIMIT Cloud & Cybersecurity 2026 (50% a fondo perduto fino a 20.000 €). È possibile selezionare più aree per un piano integrato completo."
    >
      {/* ── TOOLBAR: PLAIN LANGUAGE TOGGLE & SECTOR INDICATOR ── */}
      <div className="mb-6 p-4 bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 shrink-0 flex items-center justify-center bg-brand text-white font-bold">
            <BookOpen className="w-4.5 h-4.5" />
          </span>
          <div>
            <div className="text-[13px] font-black uppercase tracking-wider text-ink">
              Linguaggio Operatore al Telefono
            </div>
            <div className="text-[12px] text-muted">
              {selectedSector ? (
                <span>
                  Settore attivo:{' '}
                  <strong className="text-ink">{selectedSector.name.split('(')[0]}</strong>
                </span>
              ) : (
                'Tutti i settori'
              )}
            </div>
          </div>
        </div>

        {/* Toggle Simple Language Mode */}
        <button
          type="button"
          onClick={() => setPlainMode(!plainMode)}
          className={`inline-flex items-center gap-2 h-10 px-4 text-[13px] font-bold transition-all cursor-pointer border ${
            plainMode
              ? 'bg-ink text-white border-ink shadow-sm'
              : 'bg-paper text-ink-soft border-line hover:border-ink'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Modalità: {plainMode ? '«Parole Semplici per il Cliente»' : '«Tecnico / Bando»'}</span>
          <span className={`w-2 h-2 rounded-full ${plainMode ? 'bg-emerald-400' : 'bg-muted'}`} />
        </button>
      </div>

      {/* ── HIGH VISIBILITY STICKY MULTI-PROJECT BANNER ── */}
      <div className="mb-6 p-5 bg-surface border-2 border-brand shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <span className="w-10 h-10 shrink-0 flex items-center justify-center bg-brand text-white font-bold text-lg shadow-sm">
              {selectedCount}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-black uppercase tracking-tight text-ink">
                  {selectedCount === 0
                    ? 'Nessuna area ancora selezionata'
                    : `Piano Integrato MIMIT: ${selectedCount} ${
                        selectedCount === 1 ? 'Area Selezionata' : 'Aree Combinate'
                      }`}
                </span>
                {selectedCount >= 2 && (
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-brand text-white">
                    Multi-Progetto Attivo
                  </span>
                )}
              </div>
              <p className="text-[13px] text-ink-soft mt-0.5">
                {selectedCount === 0
                  ? 'Clicca sulle card per includerle nel progetto. Cliccare una card NON deseleziona le altre.'
                  : 'Tutte le aree selezionate sotto faranno parte dello stesso capitolato e della stessa domanda MIMIT.'}
              </p>
            </div>
          </div>

          {recommendedIds.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAllRecommended}
              className="inline-flex items-center gap-2 h-10 px-4 text-[13px] font-bold bg-brand text-white hover:bg-brand-ink transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Includi consigliate per {selectedSector?.name?.split(' ')[0]}</span>
            </button>
          )}
        </div>

        {/* Selected solution pills strip */}
        {selectedCount > 0 && (
          <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-muted mr-1">
              Aree Incluse:
            </span>
            {solutionIds.map((id) => {
              const sol = getSolution(id);
              if (!sol) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-white text-[12.5px] font-bold shadow-xs"
                >
                  <span>✓ {sol.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(id);
                    }}
                    title="Rimuovi dal piano"
                    className="hover:text-red-200 cursor-pointer ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-900 flex items-start gap-3 text-[14px]"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong>Attenzione:</strong> {error}
          </div>
        </div>
      )}

      {/* ── SOLUTIONS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SOLUTIONS.map((sol) => {
          const selected = solutionIds.includes(sol.id);
          const recommended = isRecommended(selectedSector, sol.id);
          const Icon = getIcon(sol.icon);
          const sectorExample = sol.sectorExamples?.[sectorKey] || sol.plainBenefits?.[0];

          return (
            <article
              key={sol.id}
              onClick={() => onToggle(sol.id)}
              className={`relative border-2 p-5 flex flex-col justify-between transition-all cursor-pointer select-none ${
                selected
                  ? 'border-brand bg-brand-soft/20 shadow-md ring-1 ring-brand'
                  : 'border-line bg-surface hover:border-ink hover:shadow-sm'
              }`}
            >
              <div>
                {/* Header Card: Icon, Badges, Checkbox */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-10 h-10 shrink-0 flex items-center justify-center transition-colors ${
                        selected ? 'bg-brand text-white' : 'bg-paper text-ink border border-line'
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </span>
                    <div>
                      {recommended && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold uppercase tracking-wider text-brand px-1.5 py-0.5 bg-brand-soft border border-brand/30 mb-1">
                          <Sparkles className="w-3 h-3" /> Consigliata per il settore
                        </span>
                      )}
                      <h3 className="text-[17px] font-black text-ink leading-tight">
                        {plainMode ? sol.plainName || sol.name : sol.name}
                      </h3>
                      {plainMode && (
                        <div className="text-[11.5px] font-bold text-muted mt-0.5">
                          Nome bando: {sol.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Checkbox indicator */}
                  <span
                    className={`w-6 h-6 shrink-0 flex items-center justify-center border transition-colors ${
                      selected ? 'bg-brand border-brand text-white' : 'border-line-strong bg-white'
                    }`}
                  >
                    {selected && <CheckCheck className="w-4 h-4" strokeWidth={3} />}
                  </span>
                </div>

                {/* Explanation text */}
                <p className="mt-3 text-[13.5px] text-ink-soft leading-relaxed">
                  {plainMode ? sol.plainExplanation : sol.short}
                </p>

                {/* Plain language sector-specific callout */}
                {plainMode && sectorExample && (
                  <div className="mt-3 p-3 bg-white border-l-2 border-brand border-y border-r border-line text-[12.5px]">
                    <div className="font-extrabold text-brand uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Come spiegarlo al cliente ({selectedSector?.name?.split(' ')[0] || 'Settore'}):
                    </div>
                    <p className="mt-1 text-ink font-medium leading-snug">
                      «{sectorExample}»
                    </p>
                  </div>
                )}

                {/* Plain benefits list */}
                {plainMode && sol.plainBenefits && (
                  <ul className="mt-3 space-y-1">
                    {sol.plainBenefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12.5px] text-ink-soft">
                        <span className="w-1.5 h-1.5 mt-1.5 bg-emerald-600 rounded-full shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* MIMIT Compliance Badge in Footer */}
              <div className="mt-4 pt-3 border-t border-line/80 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11.5px]">
                  <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {sol.mimitCategory || 'Ammissibile MIMIT 50% Fondo Perduto'}
                  </span>
                  <span className="text-muted font-bold">
                    {sol.modules?.length} moduli inclusi
                  </span>
                </div>
                {sol.mimitRule && (
                  <div className="text-[11px] text-muted italic">
                    ℹ️ {sol.mimitRule}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </ScreenFrame>
  );
}
