import React, { useState } from 'react';
import { Check, Plus, Orbit, Sparkles } from 'lucide-react';
import { COLOR_PALETTES, FONT_OPTIONS, STYLE_PRESETS, RADIUS_STYLES, AI_ORBS } from '../../data/configOptions';
import { normalizeHex, onAccent } from '../../utils/color';
import ScreenFrame, { SectionTitle } from '../flow/ScreenFrame';
import ChoiceCard from '../flow/ChoiceCard';

function SwatchTile({ hex, name, selected, onSelect, children }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <div
        className={`relative aspect-square flex items-center justify-center transition-[box-shadow,transform] duration-150 ${
          selected
            ? 'shadow-[0_0_0_3px_var(--color-surface),0_0_0_5px_var(--color-brand)]'
            : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] group-hover:-translate-y-0.5'
        }`}
        style={{ backgroundColor: hex }}
      >
        {selected && (
          <span className="w-9 h-9 flex items-center justify-center" style={{ backgroundColor: onAccent(hex), color: hex }}>
            <Check className="w-5 h-5" strokeWidth={3} />
          </span>
        )}
        {children}
      </div>
      <div className="mt-3 text-[15px] font-semibold text-ink leading-tight">{name}</div>
      <div className="mt-0.5 text-[13px] text-muted font-mono uppercase">{hex}</div>
    </div>
  );
}

export default function LookScreen({
  primaryColor,
  onSelectColor,
  selectedFont,
  uiBorderRadius,
  onSelectPreset,
  brandFont,
  onChangeBrandFont,
  selectedOrb,
  onSelectOrb,
  preview
}) {
  const [hexDraft, setHexDraft] = useState(null);
  const isCustom = primaryColor.id === 'custom';
  const draftInvalid = hexDraft !== null && !normalizeHex(hexDraft);
  const activePreset = STYLE_PRESETS.find((p) => p.fontId === selectedFont.id && p.radius === uiBorderRadius);

  const selectCustom = (value) => {
    const hex = normalizeHex(value);
    if (!hex) return;
    onSelectColor({ id: 'custom', name: 'Colore personalizzato', hex, glow: `${hex}50`, bgDark: '#0f172a' });
  };

  return (
    <ScreenFrame
      eyebrow="Look & Feel"
      title="Colori, font e stile dell'interfaccia"
      subtitle="Preferenze grafiche del cliente per portale, gestionale, assistente e Avatar 3D AI Orb. L'anteprima si aggiorna subito."
      aside={preview}
    >
      {/* ── 3D AI ORB IDENTITÀ ── */}
      <div className="mb-12">
        <SectionTitle hint={selectedOrb?.name || 'Nexus Cyber'}>
          Identità 3D AI Orb (Avatar e Nucleo Visivo dell'Assistente)
        </SectionTitle>
        <p className="text-[13.5px] text-muted mb-4">
          Scegli la sfera 3D fisica per l'assistente vocale o per il widget chat. Sviluppata con materiali PBR e rendering Three.js.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_ORBS.map((orb) => {
            const isSelected = (selectedOrb?.id || 'nexus_cyber') === orb.id;
            return (
              <ChoiceCard
                key={orb.id}
                icon={Orbit}
                badge={orb.tag}
                title={orb.name}
                description={orb.desc}
                selected={isSelected}
                onSelect={() => {
                  onSelectOrb(orb);
                  onSelectColor({
                    id: orb.id,
                    name: orb.name.split(' ')[0],
                    hex: orb.accentHex,
                    glow: orb.glowColor,
                    bgDark: orb.bgDark
                  });
                }}
                footer={
                  <div className="flex items-center justify-between text-[11.5px] text-muted font-mono pt-3 border-t border-line">
                    <span>{orb.persona}</span>
                    <span className="font-bold uppercase" style={{ color: orb.accentHex }}>
                      {orb.accentHex}
                    </span>
                  </div>
                }
              />
            );
          })}
        </div>
      </div>

      {/* ── BRAND COLOR PALETTE ── */}
      <SectionTitle hint={primaryColor.name}>Colore del brand</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-7">
        {COLOR_PALETTES.map((palette) => (
          <SwatchTile
            key={palette.id}
            hex={palette.hex}
            name={palette.name}
            selected={primaryColor.id === palette.id}
            onSelect={() => onSelectColor(palette)}
          />
        ))}

        {/* Custom color */}
        <div>
          <label
            className={`relative aspect-square flex items-center justify-center cursor-pointer transition-shadow ${
              isCustom
                ? 'shadow-[0_0_0_3px_var(--color-surface),0_0_0_5px_var(--color-brand)]'
                : 'border-2 border-dashed border-line-strong hover:border-ink text-muted'
            }`}
            style={isCustom ? { backgroundColor: primaryColor.hex } : undefined}
            title="Scegli un colore"
          >
            <input
              type="color"
              value={primaryColor.hex}
              onChange={(e) => selectCustom(e.target.value)}
              aria-label="Scegli un colore personalizzato"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {isCustom ? (
              <span className="w-9 h-9 flex items-center justify-center" style={{ backgroundColor: onAccent(primaryColor.hex), color: primaryColor.hex }}>
                <Check className="w-5 h-5" strokeWidth={3} />
              </span>
            ) : (
              <span className="flex flex-col items-center gap-1 text-[13px] font-semibold">
                <Plus className="w-6 h-6" />
                Il tuo colore
              </span>
            )}
          </label>
          <div className="mt-3 text-[15px] font-semibold text-ink leading-tight">Hai già un colore?</div>
          <input
            type="text"
            value={hexDraft ?? (isCustom ? primaryColor.hex : '')}
            onChange={(e) => {
              setHexDraft(e.target.value);
              selectCustom(e.target.value);
            }}
            onBlur={() => setHexDraft(null)}
            placeholder="es. #1F47D1"
            spellCheck={false}
            aria-invalid={draftInvalid}
            aria-label="Codice colore"
            className={`mt-1 w-full h-9 px-2.5 text-[13px] font-mono uppercase bg-surface border outline-none ${
              draftInvalid ? 'border-danger' : 'border-line-strong focus:border-brand'
            }`}
          />
          {draftInvalid && <div className="mt-1 text-[12px] text-danger">Codice non valido</div>}
        </div>
      </div>

      <div className="mt-12">
        <SectionTitle hint={activePreset?.name || 'Personalizzato'}>Stile dell'interfaccia</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STYLE_PRESETS.map((preset) => {
            const font = FONT_OPTIONS.find((f) => f.id === preset.fontId);
            const radius = RADIUS_STYLES.find((r) => r.id === preset.radius)?.radius || '0px';
            return (
              <ChoiceCard
                key={preset.id}
                title={preset.name}
                description={preset.desc}
                selected={activePreset?.id === preset.id}
                onSelect={() => onSelectPreset(preset)}
              >
                <div className="mt-4 flex items-center justify-between gap-4 p-4 bg-sunken" style={{ fontFamily: font?.family, borderRadius: radius }}>
                  <span className="text-[30px] leading-none font-semibold text-ink">Aa</span>
                  <span
                    className="inline-flex items-center h-9 px-4 text-[13px] font-semibold"
                    style={{ backgroundColor: primaryColor.hex, color: onAccent(primaryColor.hex), borderRadius: radius }}
                  >
                    Prenota ora
                  </span>
                </div>
              </ChoiceCard>
            );
          })}
        </div>
      </div>

      <label className="block mt-10 max-w-xl">
        <span className="block mb-2 text-[15px] font-semibold text-ink">
          Font aziendale già in uso <span className="font-normal text-muted">· facoltativo</span>
        </span>
        <input
          type="text"
          value={brandFont}
          onChange={(e) => onChangeBrandFont(e.target.value)}
          placeholder="es. Montserrat, Helvetica, font del logo…"
          className="w-full h-12 px-4 text-[16px] text-ink bg-surface border border-line-strong outline-none transition-colors placeholder:text-faint focus:border-brand focus:ring-3 focus:ring-brand/20"
        />
      </label>
    </ScreenFrame>
  );
}
