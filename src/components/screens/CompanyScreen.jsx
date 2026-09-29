import React from 'react';
import { ShieldCheck } from 'lucide-react';
import ScreenFrame from '../flow/ScreenFrame';
import { CONTACT_FIELDS } from '../../data/contactFields';

export default function CompanyScreen({ clientInfo, onChange, errors = {} }) {
  return (
    <ScreenFrame
      eyebrow="Azienda"
      title="Dati azienda e referente"
      subtitle="Intestazione della Scheda Tecnica di Fabbisogno. Obbligatori: ragione sociale e referente."
    >
      <div className="max-w-4xl bg-surface border border-line p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CONTACT_FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="block mb-2 text-[15px] font-semibold text-ink">
                {f.label}
                {f.required ? <span className="text-brand"> *</span> : <span className="font-normal text-muted"> · facoltativo</span>}
              </span>
              <input
                type={f.type}
                inputMode={f.inputMode}
                value={clientInfo[f.key]}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                aria-invalid={Boolean(errors[f.key])}
                className={`w-full h-14 px-4 text-[17px] text-ink bg-surface border outline-none transition-colors placeholder:text-faint focus:border-brand focus:ring-3 focus:ring-brand/20 ${
                  errors[f.key] ? 'border-danger' : 'border-line-strong'
                }`}
              />
              {errors[f.key] && <span className="mt-1.5 block text-[13px] text-danger">{errors[f.key]}</span>}
            </label>
          ))}
        </div>

        <p className="mt-6 flex items-start gap-2.5 text-[14px] text-muted">
          <ShieldCheck className="w-5 h-5 shrink-0 text-brand" strokeWidth={1.75} />
          Dati raccolti esclusivamente per la redazione della scheda e la predisposizione della domanda MIMIT.
        </p>
      </div>
    </ScreenFrame>
  );
}
