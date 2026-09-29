import React from 'react';
import { Sparkles, ShieldCheck, CheckCheck } from 'lucide-react';
import { getSolution } from '../../data/catalog';
import { getIcon } from '../../data/icons';
import ScreenFrame from '../flow/ScreenFrame';
import { ToggleChip } from '../flow/Fields';

export default function ModulesScreen({ solutionIds, modules, onToggleModule }) {
  return (
    <ScreenFrame
      eyebrow="Fabbisogno"
      title="Quali funzioni servono in ogni soluzione?"
      subtitle="Seleziona le funzioni emerse durante la chiamata. Ognuna corrisponde a un modulo operativo ammissibile al 50% dal Voucher MIMIT."
    >
      <div className="space-y-5">
        {solutionIds.map((id) => {
          const sol = getSolution(id);
          const Icon = getIcon(sol.icon);
          const chosen = modules[id] || [];
          const allSelected = sol.modules.every((m) => chosen.includes(m.id));

          const handleSelectAll = () => {
            if (allSelected) {
              sol.modules.forEach((m) => {
                if (chosen.includes(m.id)) onToggleModule(id, m.id);
              });
            } else {
              sol.modules.forEach((m) => {
                if (!chosen.includes(m.id)) onToggleModule(id, m.id);
              });
            }
          };

          return (
            <section key={id} className="bg-surface border-2 border-line p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 shrink-0 flex items-center justify-center bg-brand text-white shadow-xs">
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-[18px] font-black text-ink leading-snug">{sol.name}</h2>
                    <p className="text-[13px] text-brand font-bold">
                      {sol.plainName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="px-3 py-1 text-[12px] font-bold border border-line hover:border-ink bg-paper text-ink-soft cursor-pointer transition-colors"
                  >
                    {allSelected ? 'Deseleziona tutti' : '✓ Seleziona tutti'}
                  </button>
                  <span className="text-[12px] font-extrabold px-2.5 py-1 bg-brand-soft text-brand-ink">
                    {chosen.length} / {sol.modules.length} attivi
                  </span>
                </div>
              </div>

              {/* MIMIT rule banner */}
              {sol.mimitCategory && (
                <div className="mt-3.5 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-[12px] text-emerald-800 font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Categoria MIMIT:</strong> {sol.mimitCategory}. {sol.mimitRule}
                  </span>
                </div>
              )}

              {/* Modules chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {sol.modules.map((m) => {
                  const isChecked = chosen.includes(m.id);
                  return (
                    <ToggleChip key={m.id} selected={isChecked} onToggle={() => onToggleModule(id, m.id)}>
                      {m.name}
                    </ToggleChip>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </ScreenFrame>
  );
}
