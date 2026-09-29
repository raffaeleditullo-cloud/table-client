const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export const INK = '#0b0b0c';
export const WHITE = '#ffffff';

// Returns a lowercase 6-digit "#rrggbb", or null when the input is not a valid HEX
export function normalizeHex(value) {
  const match = HEX_RE.exec(String(value ?? '').trim());
  if (!match) return null;
  let hex = match[1].toLowerCase();
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  return `#${hex}`;
}

export function hexToRgb(hex) {
  const num = parseInt((normalizeHex(hex) || INK).slice(1), 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// Text color to place on top of an accent fill
export function onAccent(hex) {
  return contrastRatio(hex, INK) >= contrastRatio(hex, WHITE) ? INK : WHITE;
}

// Darkens the accent until it is readable as text on white (WCAG AA)
export function inkVariant(hex, target = 4.5) {
  const base = hexToRgb(hex);
  for (let step = 0; step <= 20; step++) {
    const k = 1 - step / 20;
    const candidate = rgbToHex({ r: base.r * k, g: base.g * k, b: base.b * k });
    if (contrastRatio(candidate, WHITE) >= target) return candidate;
  }
  return INK;
}

// CSS custom properties consumed by the Tailwind `accent` color tokens
export function accentVars(hex) {
  const safe = normalizeHex(hex) || '#06b6d4';
  return {
    '--accent': safe,
    '--accent-ink': inkVariant(safe),
    '--on-accent': onAccent(safe)
  };
}
