import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  CalendarDays,
  Ban,
  BadgeCheck,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { MIMIT_FAQ, FAQ_CATEGORIES, MIMIT_DATES, MIMIT_PROCEDURE_NOTE } from '../data/mimitFaq';
import { SOLUTIONS } from '../data/catalog';
import { getIcon } from '../data/icons';

export default function FaqDrawer({ open, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const filteredFaqs = useMemo(() => {
    return MIMIT_FAQ.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const matchQ = faq.question.toLowerCase().includes(query);
      const matchA = faq.answer.toLowerCase().includes(query);
      const matchBadge = faq.badge?.toLowerCase().includes(query);
      const matchDetails = faq.details?.some((d) => d.toLowerCase().includes(query));
      return matchQ || matchA || matchBadge || matchDetails;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopy = (faq) => {
    const textToCopy = `*Domanda:* ${faq.question}\n*Risposta:* ${faq.answer}\n${faq.details ? faq.details.map((d) => `• ${d}`).join('\n') : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(faq.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-title"
        className={`absolute top-0 right-0 h-full w-full max-w-[560px] bg-surface border-l-2 border-brand shadow-[-16px_0_40px_-10px_rgba(11,11,12,0.4)] flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Brand Accent Bar */}
        <div aria-hidden="true" className="h-[4px] bg-gradient-to-r from-brand via-teal-500 to-brand" />

        {/* Header */}
        <header className="px-6 py-4 border-b border-line bg-surface/90 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-brand text-white text-[11px] font-extrabold uppercase tracking-wider">
                  Guida Operatore
                </span>
                <span className="text-[12px] text-muted font-bold">Voucher MIMIT 2026</span>
              </div>
              <h2 id="faq-title" className="text-[20px] font-black text-ink mt-1">
                Prontuario FAQ & Risposte Telefoniche
              </h2>
              <p className="text-[13px] text-ink-soft">
                Tutte le risposte ufficiali e la traduzione in parole semplici per i clienti.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Chiudi"
              className="w-9 h-9 shrink-0 flex items-center justify-center border border-line text-muted hover:text-ink hover:border-ink cursor-pointer bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Search Bar */}
          <div className="mt-3.5 relative">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca parola chiave (es. DURC, PC, 30 Mbps, RENTRI, CRM, rimborso...)"
              className="w-full h-10 pl-9 pr-8 text-[13.5px] bg-paper border border-line focus:border-brand focus:bg-white focus:outline-none transition-colors text-ink placeholder:text-muted"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-[12px] font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[12px]">
            {FAQ_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-ink text-white border-ink shadow-sm'
                      : 'bg-paper text-ink-soft border-line hover:border-ink hover:text-ink'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* Scrollable FAQ List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Timeline Quick Box (always useful) */}
          {selectedCategory === 'all' || selectedCategory === 'date' ? (
            <section className="border-2 border-brand/40 bg-brand-soft/20 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-brand font-black text-[13px] uppercase tracking-wider">
                <CalendarDays className="w-4 h-4" />
                <span>Date Ufficiali Invitalia MIMIT</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                {MIMIT_DATES.map((d, i) => (
                  <div key={d.date} className="bg-white border border-line p-2.5">
                    <div className="text-[11px] font-bold text-brand uppercase">{i === 0 ? 'Fase 1' : i === 1 ? 'Click Day' : 'Chiusura'}</div>
                    <div className="text-[13.5px] font-black text-ink leading-tight mt-0.5">{d.date}</div>
                    <div className="text-[11px] text-muted leading-tight mt-1">{d.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[12px] font-semibold text-brand-ink bg-white/80 p-2 border border-brand/20">
                ⚡ <strong>{MIMIT_PROCEDURE_NOTE}</strong> È cruciale raccogliere i dati prima del 20 Ottobre.
              </p>
            </section>
          ) : null}

          {/* Results count when searching */}
          {searchQuery && (
            <div className="text-[12.5px] font-bold text-muted">
              Trovate {filteredFaqs.length} risposte per "{searchQuery}":
            </div>
          )}

          {/* FAQ Items */}
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <HelpCircle className="w-10 h-10 mx-auto mb-2 text-line-strong" />
              <p className="text-[15px] font-bold text-ink">Nessuna FAQ corrispondente</p>
              <p className="text-[13px] mt-1">Prova a cercare termini come "DURC", "anticipo", "medico", "CRM", "50%".</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 px-4 py-1.5 bg-brand text-white text-[12px] font-bold"
              >
                Mostra tutte le FAQ
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const Icon = getIcon(faq.icon);
              const isExpanded = expandedId === faq.id || searchQuery.length > 0;
              const isCopied = copiedId === faq.id;

              return (
                <article
                  key={faq.id}
                  className={`border transition-all ${
                    isExpanded ? 'border-brand bg-white shadow-sm' : 'border-line bg-paper hover:border-line-strong'
                  }`}
                >
                  <header
                    onClick={() => toggleExpand(faq.id)}
                    className="p-4 cursor-pointer flex items-start justify-between gap-3 select-none"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-brand text-white mt-0.5">
                        <Icon className="w-4 h-4" strokeWidth={2} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          {faq.badge && (
                            <span className="text-[10.5px] font-extrabold uppercase tracking-wide px-2 py-0.5 bg-ink text-white">
                              {faq.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="text-[15px] font-bold text-ink mt-1 leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 mt-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(faq);
                        }}
                        title="Copia risposta per WhatsApp / Email"
                        className={`w-7 h-7 flex items-center justify-center border transition-colors ${
                          isCopied
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'border-line text-muted hover:text-ink hover:border-ink bg-white'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 flex items-center justify-center text-muted"
                        aria-label="Espandi"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </header>

                  {/* Body */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-line/60 bg-white">
                      <p className="text-[14px] font-bold text-brand-ink leading-relaxed bg-brand-soft/30 p-2.5 border-l-2 border-brand">
                        {faq.answer}
                      </p>

                      {faq.details && faq.details.length > 0 && (
                        <ul className="mt-2.5 space-y-1.5 pl-1">
                          {faq.details.map((d, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[13px] text-ink-soft leading-snug">
                              <span aria-hidden="true" className="mt-[6px] w-1.5 h-1.5 bg-brand shrink-0" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </article>
              );
            })
          )}

          {/* Warning Banner on Prices / Capobianco note */}
          <section className="bg-ink text-white p-4 border border-ink flex items-start gap-3 shadow-md mt-6">
            <Ban className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-bold uppercase tracking-wider text-amber-300">
                Regola Istituzionale Operatore
              </div>
              <p className="text-[13px] text-white/90 leading-relaxed mt-1">
                <strong>NON comunicare prezzi o quantificazioni al telefono.</strong> L'offerta economica ufficiale e l'assegnazione dei codici fornitore abilitato MIMIT vengono elaborate dalla <strong>Presidenza Roberto Capobianco</strong> e dall'Ufficio Amministrazione.
              </p>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
