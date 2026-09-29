import { SOLUTIONS, SECTORS } from '../data/catalog';
import { CHANNELS, VOICE_GENDERS, VOICE_ROLES } from '../data/configOptions';

// ─────────────────────────────────────────────────────────────
// NORMALIZZAZIONE DATI ESTRATTI DAL COPILOTA
// L'output dell'LLM (o del fallback euristico) viene ripulito prima di
// entrare nello stato del configuratore o nel dossier: id sconosciuti
// scartati, stringhe segnaposto azzerate, contatti malformati rimossi.
// La funzione è idempotente: può essere applicata più volte.
// ─────────────────────────────────────────────────────────────

const SOLUTION_IDS = new Set(SOLUTIONS.map((s) => s.id));
const SECTOR_IDS = new Set(SECTORS.map((s) => s.id));
const CHANNEL_IDS = new Set(CHANNELS.map((c) => c.id));
const GENDER_IDS = new Set(VOICE_GENDERS.map((g) => g.id));
const ROLE_IDS = new Set(VOICE_ROLES.map((r) => r.id));
const MODULE_IDS = Object.fromEntries(SOLUTIONS.map((s) => [s.id, new Set(s.modules.map((m) => m.id))]));

const SHORT_MAX = 200;
const LONG_MAX = 5000;
const REPORT_MAX = 20000;

// Valori che l'LLM usa al posto di "non so": trattati come campo vuoto
const PLACEHOLDER_RE = /^(null|undefined|none|n\/?a|n\.?d\.?|-+|\?+|non (indicat[oa]|specificat[oa]|disponibile|rilevat[oa]|menzionat[oa])|in (acquisizione|definizione)|sconosciut[oa])$/i;

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Stringa pulita: trim, segnaposto → ''. I campi brevi diventano una riga sola;
// quelli lunghi (note, report Markdown) conservano a capo e indentazione.
function text(value, max = SHORT_MAX) {
  if (typeof value === 'number' && Number.isFinite(value)) value = String(value);
  if (typeof value !== 'string') return '';
  const unified = value.replace(/\r\n?/g, '\n');
  const clean = (max === SHORT_MAX ? unified.replace(/\s+/g, ' ') : unified).trim();
  if (!clean || PLACEHOLDER_RE.test(clean)) return '';
  return clean.slice(0, max);
}

// Elenco di id ammessi: accetta array o stringa "a, b", normalizza maiuscole, deduplica
function idList(value, allowed) {
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[,;]/) : [];
  const out = [];
  for (const item of items) {
    const id = typeof item === 'string' ? item.trim().toLowerCase() : '';
    if (allowed.has(id) && !out.includes(id)) out.push(id);
  }
  return out;
}

function oneOf(value, allowed) {
  const id = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return allowed.has(id) ? id : null;
}

// P.IVA (11 cifre) o Codice Fiscale (16 caratteri), altrimenti ''
function vat(value) {
  const raw = text(value).replace(/[\s.\-/]/g, '').replace(/^IT/i, '');
  if (/^\d{11}$/.test(raw)) return raw;
  if (/^[A-Za-z0-9]{16}$/.test(raw)) return raw.toUpperCase();
  return '';
}

function email(value) {
  const raw = text(value).replace(/^mailto:/i, '').replace(/\s/g, '').toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw) ? raw : '';
}

// Telefono: solo cifre, spazi, + e separatori comuni; almeno 6 cifre
function phone(value) {
  const raw = text(value);
  if (!/^[+\d\s().\-/]+$/.test(raw)) return '';
  const digits = raw.replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 15 ? raw : '';
}

// Moduli: solo soluzioni note, solo moduli di quella soluzione; se `solutionIds` è dato, solo quelle scelte
function modulesMap(value, solutionIds) {
  if (!isPlainObject(value)) return {};
  const out = {};
  for (const [key, list] of Object.entries(value)) {
    const solId = key.trim().toLowerCase();
    if (!MODULE_IDS[solId] || (solutionIds && !solutionIds.includes(solId))) continue;
    const ids = idList(list, MODULE_IDS[solId]);
    if (ids.length) out[solId] = ids;
  }
  return out;
}

export function normalizeExtraction(raw) {
  if (!isPlainObject(raw)) return null;

  const info = isPlainObject(raw.clientInfo) ? raw.clientInfo : {};
  const voice = isPlainObject(raw.voice) ? raw.voice : {};
  const solutionIds = idList(raw.solutionIds, SOLUTION_IDS);

  return {
    clientInfo: {
      company: text(info.company),
      vat: vat(info.vat),
      name: text(info.name),
      role: text(info.role),
      email: email(info.email),
      phone: phone(info.phone)
    },
    sectorId: oneOf(raw.sectorId, SECTOR_IDS),
    solutionIds,
    modules: modulesMap(raw.modules, solutionIds.length ? solutionIds : null),
    voice: {
      gender: oneOf(voice.gender, GENDER_IDS),
      roles: idList(voice.roles, ROLE_IDS),
      prompt: text(voice.prompt, LONG_MAX)
    },
    channelIds: idList(raw.channelIds, CHANNEL_IDS),
    currentState: text(raw.currentState, LONG_MAX),
    improvement: text(raw.improvement, LONG_MAX),
    operatorNotes: text(raw.operatorNotes, LONG_MAX),
    reportMarkdown: text(raw.reportMarkdown, REPORT_MAX)
  };
}
