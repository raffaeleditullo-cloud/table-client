import React, { useState } from 'react';
import { ChevronDown, FileDown, Settings2, Lock, ArrowRight, Clock } from 'lucide-react';
import { HOSTING_COMPLIANCE, FONT_OPTIONS, RADIUS_STYLES } from '../../data/configOptions';
import { ECONOMIC_NOTICE } from '../../data/mimitFaq';
import ScreenFrame from '../flow/ScreenFrame';
import { NoteArea } from '../flow/Fields';

function Card({ title, onEdit, children }) {
  return (
    <section className="bg-surface border border-line">
      <header className="flex items-center justify-between gap-4 px-6 pt-5 pb-3">
        <h2 className="text-[16px] font-bold text-ink">{title}</h2>
        {onEdit && (
          <button type="button" onClick={onEdit} className="text-[14px] font-semibold text-brand hover:text-brand-ink cursor-pointer">
            Modifica
          </button>
        )}
      </header>
      <div className="px-6 pb-6">{children}</div>
    </section>
  );
}

const Empty = ({ children = 'Non indicato' }) => <span className="text-faint font-normal">{children}</span>;

function Chips({ items }) {
  if (!items.length) return <Empty>Nessuna selezione</Empty>;
  return (
    <span className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <span key={i} className="text-[13px] font-semibold px-2 py-1 bg-sunken text-ink-soft">{i}</span>
      ))}
    </span>
  );
}

function TechSelect({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-[13px] font-semibold text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(options.find((o) => o.id === e.target.value))}
        className="w-full h-11 px-3 text-[14px] text-ink bg-surface border border-line-strong outline-none focus:border-brand cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
    </label>
  );
}

export default function SummaryScreen({ dossier, docCode, operatorNotes, onChangeNotes, tech, onEdit, onGeneratePdf, isGenerating }) {
  const [showTech, setShowTech] = useState(false);

  return (
    <ScreenFrame
      eyebrow="Scheda"
      title="Riepilogo Scheda Tecnica di Fabbisogno"
      subtitle="Controlla i dati raccolti, aggiungi le note operative e genera il PDF per la Presidenza."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
        <div className="space-y-5 min-w-0">
          <Card title="Azienda & referente" onEdit={() => onEdit('company')}>
            <dl className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4">
              {dossier.company.map((row) => (
                <div key={row.label}>
                  <dt className="text-[13px] font-semibold text-muted">{row.label}</dt>
                  <dd className="mt-0.5 text-[15px] font-semibold text-ink break-words">{row.value || <Empty />}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title="Soluzione architetturale richiesta" onEdit={() => onEdit('solutions')}>
            <div className="space-y-4">
              {dossier.solutions.map((sol) => (
                <div key={sol.id} className="pl-4 border-l-2 border-brand">
                  <h3 className="text-[15px] font-bold text-ink">{sol.name}</h3>
                  <div className="mt-2"><Chips items={sol.modules} /></div>
                </div>
              ))}
              {dossier.voice && (
                <div className="p-4 bg-sunken">
                  <h3 className="text-[14px] font-bold text-ink">Agente vocale</h3>
                  <dl className="mt-2 space-y-2 text-[14px]">
                    <div className="flex gap-3"><dt className="w-24 shrink-0 text-muted">Voce</dt><dd className="font-semibold text-ink">{dossier.voice.gender || <Empty />}</dd></div>
                    <div className="flex gap-3"><dt className="w-24 shrink-0 text-muted">Compiti</dt><dd><Chips items={dossier.voice.roles} /></dd></div>
                    <div className="flex gap-3"><dt className="w-24 shrink-0 text-muted">Istruzioni</dt><dd className="text-ink whitespace-pre-line">{dossier.voice.prompt || <Empty />}</dd></div>
                  </dl>
                </div>
              )}
              <div>
                <h3 className="text-[14px] font-bold text-ink mb-2">Canali & integrazioni</h3>
                <Chips items={dossier.channels} />
              </div>
            </div>
          </Card>

          <Card title="Situazione attuale → Miglioramento sostanziale" onEdit={() => onEdit('gap')}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
              <div className="p-4 bg-sunken">
                <h3 className="text-[13px] font-semibold text-muted">Stato iniziale</h3>
                <p className="mt-1.5 text-[14px] text-ink whitespace-pre-line leading-relaxed">{dossier.currentState || <Empty />}</p>
              </div>
              <ArrowRight className="hidden md:block self-center w-5 h-5 text-ink" />
              <div className="p-4 bg-brand-soft">
                <h3 className="text-[13px] font-semibold text-brand-ink">Miglioramento atteso</h3>
                <p className="mt-1.5 text-[14px] text-ink whitespace-pre-line leading-relaxed">{dossier.improvement || <Empty />}</p>
              </div>
            </div>
          </Card>

          <Card title="Look & Feel desiderato" onEdit={() => onEdit('look')}>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {dossier.look.map((row) => (
                <div key={row.label}>
                  <dt className="text-[13px] font-semibold text-muted">{row.label}</dt>
                  <dd className="mt-0.5 flex items-center gap-2 text-[15px] font-semibold text-ink">
                    {row.swatch && <span className="w-4 h-4 shrink-0" style={{ backgroundColor: row.swatch }} />}
                    {row.value || <Empty />}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title="Stima tempistiche operative di rilascio (Sviluppo AI)">
            <div className="p-4 bg-brand-soft border border-brand/20 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11.5px] font-extrabold uppercase tracking-wider text-brand-ink block">
                  Tempo Stimato di Sviluppo & Messa in Produzione
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-[22px] font-black text-ink">
                    ~{dossier.timeline?.weeks} {dossier.timeline?.weeks === 1 ? 'Settimana' : 'Settimane'}
                  </span>
                  <span className="text-[13px] text-muted font-medium">
                    (circa {dossier.timeline?.totalDays} giorni lavorativi)
                  </span>
                </div>
              </div>
              <span className="self-start sm:self-auto text-[11.5px] px-3 py-1.5 bg-brand text-white font-bold">
                Incluso Testing, Bug Fixing & Collaudo
              </span>
            </div>

            <div className="space-y-2.5">
              {dossier.timeline?.phases.map((ph, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 p-3 bg-sunken">
                  <div className="min-w-0">
                    <h4 className="text-[13.5px] font-bold text-ink">{ph.name}</h4>
                    <p className="text-[12px] text-muted mt-0.5">{ph.desc}</p>
                  </div>
                  <span className="text-[12px] font-mono font-bold text-ink shrink-0 px-2 py-0.5 bg-surface border border-line">
                    ~{ph.days} gg
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <NoteArea
            label="Note operative dell'operatore"
            hint="Tutto ciò che è emerso in chiamata e serve alla Presidenza: urgenze, disponibilità, dubbi del cliente."
            value={operatorNotes}
            onChange={onChangeNotes}
            placeholder="Es. il cliente vuole partire prima del click-day, richiamare giovedì pomeriggio, firma digitale già disponibile…"
            suggestions={['Firma digitale disponibile', 'Firma digitale da attivare', 'Richiamare per conferma', 'Cliente interessato a più aree', 'Urgenza: prima del click-day']}
            rows={5}
          />

          {/* Internal technical settings: hidden by default */}
          <div className="border border-dashed border-line-strong bg-paper">
            <button
              type="button"
              onClick={() => setShowTech((v) => !v)}
              aria-expanded={showTech}
              className="w-full flex items-center justify-between gap-3 px-6 h-14 text-left cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-[14px] font-semibold text-muted">
                <Settings2 className="w-4 h-4" />
                Dettagli tecnici · uso interno
              </span>
              <ChevronDown className={`w-5 h-5 text-muted transition-transform ${showTech ? 'rotate-180' : ''}`} />
            </button>
            {showTech && (
              <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <TechSelect label="Hosting & GDPR" value={tech.hosting.id} options={HOSTING_COMPLIANCE} onChange={tech.setHosting} />
                <TechSelect label="Font interfaccia" value={tech.font.id} options={FONT_OPTIONS} onChange={tech.setFont} />
                <TechSelect label="Forma degli elementi" value={tech.radius} options={RADIUS_STYLES} onChange={(r) => tech.setRadius(r.id)} />
              </div>
            )}
          </div>
        </div>

        {/* ── Right: reserved economic notice + PDF ── */}
        <div className="lg:sticky lg:top-[100px]">
          <div className="bg-ink text-white p-7">
            <div className="flex items-center gap-2.5 text-[14px] font-bold">
              <Lock className="w-4 h-4" />
              Proposta economica riservata
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-white/80">
              {ECONOMIC_NOTICE.replace(/^Proposta economica riservata:\s*/, '')}
            </p>

            <button
              type="button"
              onClick={onGeneratePdf}
              disabled={isGenerating}
              className="mt-7 w-full h-14 flex items-center justify-center gap-2.5 bg-brand text-white text-[16px] font-bold hover:bg-brand-ink transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-wait"
            >
              {isGenerating ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <FileDown className="w-5 h-5" />
              )}
              {isGenerating ? 'Preparo il PDF…' : 'Genera Scheda Tecnica PDF'}
            </button>
            <div className="mt-3 text-center text-[12px] text-white/50 font-mono">{docCode}</div>
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}
