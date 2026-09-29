import React, { useState } from 'react';
import { Send, Bot, Laptop, Globe, ArrowRight, Sparkles, Orbit } from 'lucide-react';
import ThreeOrbViewer from './ThreeOrbViewer';

// Visual-only preview of the chosen Look & Feel with 3D AI Orb Viewer
const RADIUS_MAP = {
  'rounded-none': { frame: '0px', el: '0px', bubble: '0px' },
  'rounded-xl': { frame: '22px', el: '10px', bubble: '12px' },
  'rounded-3xl': { frame: '34px', el: '999px', bubble: '20px' }
};

export default function LivePreview({ config }) {
  const radius = RADIUS_MAP[config.uiBorderRadius] || RADIUS_MAP['rounded-xl'];
  const [mode, setMode] = useState('orb'); // Default to 3D AI Orb to showcase luxury identity
  const brandName = config.companyName || 'La tua azienda';
  const headline = config.solutionNames?.[0] || 'Soluzione digitale su misura';
  const orb = config.selectedOrb || { id: 'nexus_cyber', name: 'Nexus Cyber (Marmo Smeraldo & Oro 24K)', persona: 'Strategic, Executive & Creative', accentHex: '#00a3a3' };

  const modeButton = (id, Icon, label) => (
    <button
      type="button"
      onClick={() => setMode(id)}
      aria-pressed={mode === id}
      className={`flex items-center gap-1.5 h-8 px-3 text-[12px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
        mode === id ? 'bg-ink text-white' : 'text-muted hover:text-ink'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );

  return (
    <div className="bg-surface border border-line shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 min-h-12 py-2.5 border-b border-line">
        <span className="flex items-center gap-2.5 text-[15px] font-bold text-ink">
          <span aria-hidden="true" className="w-2.5 h-2.5 bg-brand" />
          Anteprima Look & Feel
        </span>
        <div className="flex items-center border border-line-strong">
          {modeButton('orb', Orbit, '3D AI Orb')}
          {modeButton('site', Globe, 'Portale')}
          {modeButton('chat', Laptop, 'Assistente')}
        </div>
      </div>

      <div className="bg-paper px-5 py-6 flex justify-center">
        <div
          className="w-full bg-surface border border-ink overflow-hidden shadow-[8px_8px_0_0_var(--color-line)] transition-[border-radius] duration-300 relative"
          style={{ fontFamily: config.font?.family || 'sans-serif', borderRadius: radius.frame }}
        >
          {/* ── MODE 1: 3D LUXURY AI ORB ── */}
          {mode === 'orb' && (
            <div className="flex flex-col h-[390px] bg-[#030712] relative overflow-hidden text-white p-4 justify-between">
              {/* Top ambient badge */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-ping bg-emerald-400" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-300">
                    3D AI Identity Core
                  </span>
                </div>
                <span className="text-[10.5px] font-mono px-2 py-0.5 bg-white/10 text-slate-200 border border-white/15">
                  Three.js PBR Physics
                </span>
              </div>

              {/* 3D Orb Canvas */}
              <div className="absolute inset-0 flex items-center justify-center">
                <ThreeOrbViewer orbId={orb.id} height={390} />
              </div>

              {/* Bottom Info Card */}
              <div className="z-10 p-3 bg-slate-900/85 backdrop-blur-md border border-white/15">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-[13px] font-bold text-white tracking-tight">{orb.name}</h5>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{orb.persona}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Interattivo 360°
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  💡 Trascina con il mouse o tocca per ruotare la sfera in tempo reale.
                </p>
              </div>
            </div>
          )}

          {/* ── MODE 2: WEB PORTAL ── */}
          {mode === 'site' && (
            <div className="flex flex-col h-[390px]">
              <div className="flex items-center gap-2 px-3 h-9 border-b border-line bg-paper">
                <span className="flex gap-1" aria-hidden="true">
                  <span className="w-2 h-2 bg-line-strong" />
                  <span className="w-2 h-2 bg-line-strong" />
                  <span className="w-2 h-2 bg-brand" />
                </span>
                <span className="flex-1 h-5 px-2 flex items-center bg-surface border border-line text-[10px] text-faint" style={{ borderRadius: radius.el }}>
                  portale.{brandName.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18) || 'azienda'}.it
                </span>
              </div>
              <div className="flex items-center justify-between px-4 h-11 border-b border-line">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-4 h-4 shrink-0 bg-brand" style={{ borderRadius: radius.el }} />
                  <span className="text-[12px] font-bold text-ink truncate">{brandName}</span>
                </span>
                <span className="flex gap-3 text-[10.5px] text-muted shrink-0">
                  <span>Servizi</span><span>Area clienti</span><span>Contatti</span>
                </span>
              </div>
              <div className="px-4 pt-6 pb-4">
                <span className="text-[10px] font-semibold text-brand">Conflavoro AI</span>
                <h4 className="mt-1.5 text-[19px] leading-[1.15] font-bold text-ink tracking-[-0.01em]">{headline}</h4>
                <p className="mt-1.5 text-[11.5px] text-muted leading-relaxed">
                  Processi digitali, dati in cloud e servizi sempre disponibili per i tuoi clienti.
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="inline-flex items-center gap-1.5 h-8 px-3 text-[11px] font-semibold bg-brand text-white" style={{ borderRadius: radius.el }}>
                    Accedi <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="inline-flex items-center h-8 px-3 text-[11px] font-semibold border border-line-strong text-ink" style={{ borderRadius: radius.el }}>
                    Scopri di più
                  </span>
                </div>
              </div>
              <div className="mt-auto grid grid-cols-3 gap-2 px-4 pb-4">
                {(config.solutionNames?.length ? config.solutionNames : ['Gestionale', 'CRM', 'Sicurezza']).slice(0, 3).map((item) => (
                  <div key={item} className="p-2.5 bg-sunken" style={{ borderRadius: radius.bubble }}>
                    <span className="block w-4 h-4 bg-brand/25 mb-2" style={{ borderRadius: radius.el }} />
                    <span className="block text-[9.5px] leading-snug font-semibold text-ink line-clamp-3">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MODE 3: ASSISTANT CHAT WIDGET ── */}
          {mode === 'chat' && (
            <div className="flex flex-col h-[390px] p-4">
              <div className="p-3 mb-3 flex items-center justify-between bg-brand text-white" style={{ borderRadius: radius.bubble }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-black/15 flex items-center justify-center" style={{ borderRadius: radius.el }}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[12.5px] font-bold leading-none">{brandName}</h5>
                    <span className="text-[10.5px] opacity-80">Assistente digitale · online</span>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 opacity-70" />
              </div>
              <div className="flex-1 space-y-2.5">
                <div className="max-w-[85%] px-3 py-2 text-[12px] leading-relaxed bg-sunken text-ink border-l-[3px] border-brand" style={{ borderRadius: radius.bubble }}>
                  Buongiorno! Sono l'assistente di {brandName}. Come posso aiutarla?
                </div>
                <div className="ml-auto max-w-[80%] px-3 py-2 text-[12px] leading-relaxed bg-ink text-white" style={{ borderRadius: radius.bubble }}>
                  Vorrei fissare un appuntamento.
                </div>
                <div className="max-w-[85%] px-3 py-2 text-[12px] leading-relaxed bg-sunken text-ink border-l-[3px] border-brand" style={{ borderRadius: radius.bubble }}>
                  Certo, ho disponibilità giovedì alle 10:00 o venerdì alle 15:30. Quale preferisce?
                </div>
              </div>
              <div className="pt-2 border-t border-line flex items-center gap-1.5">
                <span className="flex-1 h-9 px-2.5 flex items-center border border-line-strong text-[12px] text-faint" style={{ borderRadius: radius.el }}>
                  Scrivi un messaggio…
                </span>
                <span className="w-9 h-9 shrink-0 flex items-center justify-center bg-brand text-white" style={{ borderRadius: radius.el }}>
                  <Send className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
