import React, { useEffect } from 'react';
import { X, CalendarDays, Ban, BadgeCheck } from 'lucide-react';
import { MIMIT_FAQ, MIMIT_DATES, MIMIT_PROCEDURE_NOTE } from '../data/mimitFaq';
import { SOLUTIONS } from '../data/catalog';
import { getIcon } from '../data/icons';

// Operator cheat-sheet, readable at a glance during the call
export default function FaqDrawer({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-title"
        className={`absolute top-0 right-0 h-full w-full max-w-[460px] bg-surface border-l border-ink shadow-[-12px_0_32px_-16px_rgba(11,11,12,0.35)] flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div aria-hidden="true" className="h-[3px] bg-brand" />
        <header className="flex items-start justify-between gap-4 px-6 py-5 border-b border-line">
          <div>
            <h2 id="faq-title" className="text-[20px] font-extrabold text-ink">Cheat-sheet FAQ MIMIT</h2>
            <p className="mt-0.5 text-[14px] text-muted">Voucher Cloud & Cybersecurity 2026</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="w-10 h-10 shrink-0 flex items-center justify-center border border-line text-muted hover:text-ink hover:border-ink cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {MIMIT_FAQ.map((faq) => {
            const Icon = getIcon(faq.icon);
            return (
              <section key={faq.id} className="border border-line p-5">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 shrink-0 flex items-center justify-center bg-brand text-white">
                    <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                  </span>
                  <h3 className="text-[14px] font-semibold text-muted">{faq.question}</h3>
                </div>
                <p className="mt-3 text-[17px] font-bold text-ink leading-snug">{faq.answer}</p>
                {faq.details.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {faq.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-[14px] text-ink-soft">
                        <span aria-hidden="true" className="mt-[7px] w-1.5 h-1.5 bg-brand shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}

          <section className="border border-line p-5">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 shrink-0 flex items-center justify-center bg-brand text-white">
                <CalendarDays className="w-4.5 h-4.5" strokeWidth={2} />
              </span>
              <h3 className="text-[14px] font-semibold text-muted">Date chiave</h3>
            </div>
            <ol className="mt-4">
              {MIMIT_DATES.map((d, i) => (
                <li key={d.date} className="relative flex gap-4 pb-4 last:pb-0">
                  {i < MIMIT_DATES.length - 1 && <span aria-hidden="true" className="absolute left-[5px] top-4 bottom-0 w-px bg-line-strong" />}
                  <span aria-hidden="true" className="relative mt-1.5 w-[11px] h-[11px] shrink-0 bg-ink" />
                  <div>
                    <div className="text-[16px] font-bold text-ink">{d.date}</div>
                    <div className="text-[14px] text-muted">{d.label}</div>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 px-3 py-2.5 bg-brand-soft text-[14px] font-semibold text-brand-ink">{MIMIT_PROCEDURE_NOTE}</p>
          </section>

          <section className="border border-line p-5">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 shrink-0 flex items-center justify-center bg-brand text-white">
                <BadgeCheck className="w-4.5 h-4.5" strokeWidth={2} />
              </span>
              <h3 className="text-[14px] font-semibold text-muted">Aree ammissibili gestite</h3>
            </div>
            <ul className="mt-3 space-y-1.5">
              {SOLUTIONS.map((s) => (
                <li key={s.id} className="flex items-start gap-2 text-[14px] text-ink-soft">
                  <span aria-hidden="true" className="mt-[7px] w-1.5 h-1.5 bg-brand shrink-0" />
                  {s.name}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-ink text-white p-5 flex items-start gap-3">
            <Ban className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-[14px] leading-relaxed">
              <strong>Non comunicare prezzi o codici di spesa al telefono.</strong> L'offerta economica ufficiale è elaborata dalla Presidenza e dall'Ufficio Amministrazione.
            </p>
          </section>
        </div>
      </aside>
    </div>
  );
}
