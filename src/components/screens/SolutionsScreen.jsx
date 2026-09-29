import React from 'react';
import { BadgeCheck, Layers, Sparkles, CheckCheck, X, PlusCircle, AlertCircle } from 'lucide-react';
import { SOLUTIONS, isRecommended, getSolution } from '../../data/catalog';
import { getIcon } from '../../data/icons';
import ScreenFrame from '../flow/ScreenFrame';
import ChoiceCard from '../flow/ChoiceCard';

export default function SolutionsScreen({ selectedSector, solutionIds, onToggle, error }) {
  const selectedCount = solutionIds.length;
  const recommendedIds = selectedSector?.recommended || [];

  const handleSelectAllRecommended = () => {
    recommendedIds.forEach((id) => {
      if (!solutionIds.includes(id)) {
        onToggle(id);
      }
    });
  };

  const isBenessereSector = selectedSector?.id === 'benessere';

  return (
    <ScreenFrame
      eyebrow="Fabbisogno"
      title="Quali soluzioni servono all'azienda?"
      subtitle="Aree ammissibili al Voucher MIMIT Cloud & Cybersecurity 2026. Si possono selezionare più progetti contemporaneamente: verranno unificati in una singola domanda."
    >
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
                    : `Piano Integrato MIMIT: ${selectedCount} ${selectedCount === 1 ? 'Area Selezionata' : 'Aree Combinate'}`}
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
              <span>Includi tutte le consigliate per {selectedSector?.name?.split(' ')[0]}</span>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand text-white text-[12.5px] font-bold"
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

      {/* Specific advice for Parrucchieri / Estetica / Benessere */}
      {isBenessereSector && (
        <div className="mb-6 p-4 bg-brand-soft border border-brand/30 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-brand shrink-0 mt-0.5" />
          <div className="text-[13.5px] text-brand-ink leading-relaxed">
            <strong className="block font-bold">Consiglio Operativo per Saloni, Parrucchieri & Centri Benessere:</strong>
            Spesso i titolari sono impegnati nei trattamenti e perdono telefonate di clienti. La configurazione ideale multi-progetto è:
            <strong> Agente Vocale AI</strong> (risponde h24 e fissa appuntamenti) + 
            <strong> CRM & Automazioni</strong> (promemoria WhatsApp anti-no-show e anagrafica schede tecniche) + 
            <strong> Gestionale Cloud</strong> (agenda turni e cassa) + 
            <strong> Portale Web</strong> (prenotazione autonoma dei clienti da smartphone).
          </div>
        </div>
      )}

      {error && (
        <div className="mb-5 p-4 bg-danger/10 border border-danger text-danger text-[15px] font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of Solutions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SOLUTIONS.map((sol) => (
          <ChoiceCard
            key={sol.id}
            icon={getIcon(sol.icon)}
            badge={isRecommended(selectedSector, sol.id) ? 'Consigliato per il settore' : null}
            title={sol.name}
            description={sol.short}
            selected={solutionIds.includes(sol.id)}
            onSelect={() => onToggle(sol.id)}
            footer={
              <p className="flex items-start gap-2 pt-4 border-t border-line text-[13px] text-ink-soft leading-relaxed">
                <BadgeCheck className="w-4 h-4 shrink-0 mt-0.5 text-brand" strokeWidth={2} />
                {sol.eligibility}
              </p>
            }
          />
        ))}
      </div>
    </ScreenFrame>
  );
}
