import React from 'react';
import { getSolution } from '../../data/catalog';
import { getIcon } from '../../data/icons';
import ScreenFrame from '../flow/ScreenFrame';
import { ToggleChip } from '../flow/Fields';

export default function ModulesScreen({ solutionIds, modules, onToggleModule }) {
  return (
    <ScreenFrame
      eyebrow="Fabbisogno"
      title="Quali funzioni servono in ogni soluzione?"
      subtitle="Seleziona le funzioni emerse durante la chiamata. Puoi lasciarne vuota una se non è ancora chiaro."
    >
      <div className="space-y-5">
        {solutionIds.map((id) => {
          const sol = getSolution(id);
          const Icon = getIcon(sol.icon);
          const chosen = modules[id] || [];
          return (
            <section key={id} className="bg-surface border border-line p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 shrink-0 flex items-center justify-center bg-brand text-white">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[18px] font-bold text-ink leading-snug">{sol.name}</h2>
                  <p className="text-[13px] text-muted">
                    {chosen.length ? `${chosen.length} di ${sol.modules.length} funzioni selezionate` : 'Nessuna funzione selezionata'}
                  </p>
                </div>
              </div>
              {id === 'web' && (
                <p className="mt-4 px-4 py-3 bg-brand-soft text-[14px] text-brand-ink leading-relaxed">{sol.eligibility}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {sol.modules.map((m) => (
                  <ToggleChip key={m.id} selected={chosen.includes(m.id)} onToggle={() => onToggleModule(id, m.id)}>
                    {m.name}
                  </ToggleChip>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </ScreenFrame>
  );
}
