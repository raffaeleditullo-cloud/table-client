import { getSolution } from '../data/catalog';
import { CHANNELS, VOICE_GENDERS, VOICE_ROLES, RADIUS_STYLES, STYLE_PRESETS } from '../data/configOptions';

export function createDocCode() {
  return `STF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function calculateTimeline(solutionIds = [], channelIds = []) {
  const count = solutionIds.length;
  const hasVoice = solutionIds.includes('voice');
  const hasWeb = solutionIds.includes('web');
  const hasRag = solutionIds.includes('rag');

  // AI-accelerated dev timeline calculation (accounting for setup, testing, bug fixes and client trials)
  let baseDays = 7;
  if (count <= 1) baseDays = 8;
  else if (count === 2) baseDays = 12;
  else if (count === 3) baseDays = 15;
  else baseDays = 18;

  if (hasVoice) baseDays += 3; // VoIP trunking, audio latency tuning & interruptions
  if (hasWeb) baseDays += 3;   // Portal UI & booking flow
  if (hasRag) baseDays += 2;   // Document vectorization & testing
  if (channelIds && channelIds.length > 2) baseDays += 2; // Multi-channel webhook routing

  const weeks = Math.max(1, Math.ceil(baseDays / 5));

  return {
    totalDays: baseDays,
    weeks,
    phases: [
      { name: 'Fase 1: Setup Architettura & Prompt Engineering', desc: 'Configurazione database cloud, prompt system e logica di business', days: Math.max(2, Math.round(baseDays * 0.3)) },
      { name: 'Fase 2: Integrazione Canali & Pipeline AI', desc: 'Collegamento canali (VoIP, WhatsApp Business, Webhook, CRM)', days: Math.max(2, Math.round(baseDays * 0.3)) },
      { name: 'Fase 3: Test, Bug Fixing & Collaudo Cliente', desc: 'Simulazione chiamate reali, gestione imprevisti e prova con il cliente', days: Math.max(3, Math.round(baseDays * 0.25)) },
      { name: 'Fase 4: Go-Live & Monitoraggio', desc: 'Messa in produzione e monitoraggio operativo', days: Math.max(2, Math.round(baseDays * 0.15)) }
    ]
  };
}

// Single source for the Scheda Tecnica di Fabbisogno: used by the summary screen and the PDF
export function buildDossier(state) {
  const {
    sector, solutionIds, modules, voice, channelIds, hosting,
    currentState, improvement, primaryColor, font, uiBorderRadius, brandFont, selectedOrb, clientInfo, operatorNotes
  } = state;

  const solutions = solutionIds.map((id) => {
    const sol = getSolution(id);
    const chosen = modules[id] || [];
    return {
      id,
      name: sol.name,
      eligibility: sol.eligibility,
      modules: sol.modules.filter((m) => chosen.includes(m.id)).map((m) => m.name)
    };
  });

  const hasVoice = solutionIds.includes('voice');
  const preset = STYLE_PRESETS.find((p) => p.fontId === font?.id && p.radius === uiBorderRadius);
  const timeline = calculateTimeline(solutionIds, channelIds);

  return {
    company: [
      { label: 'Ragione sociale', value: clientInfo.company },
      { label: 'Partita IVA / Codice Fiscale', value: clientInfo.vat },
      { label: 'Settore', value: sector?.name },
      { label: 'Referente', value: [clientInfo.name, clientInfo.role].filter(Boolean).join(' · ') },
      { label: 'Email', value: clientInfo.email },
      { label: 'Telefono', value: clientInfo.phone }
    ],
    solutions,
    voice: hasVoice
      ? {
          gender: VOICE_GENDERS.find((g) => g.id === voice.gender)?.name,
          roles: VOICE_ROLES.filter((r) => voice.roles.includes(r.id)).map((r) => r.name),
          prompt: voice.prompt
        }
      : null,
    channels: CHANNELS.filter((c) => channelIds.includes(c.id)).map((c) => c.name),
    hosting: hosting ? `${hosting.name} · ${hosting.gdpr}` : null,
    currentState,
    improvement,
    timeline,
    look: [
      { label: 'Identità 3D AI Orb', value: selectedOrb?.name || 'Nexus Cyber (Marmo Smeraldo & Oro 24K)' },
      { label: 'Colore brand', value: `${primaryColor.name} · ${primaryColor.hex.toUpperCase()}`, swatch: primaryColor.hex },
      { label: 'Stile interfaccia', value: preset?.name || 'Personalizzato' },
      { label: 'Font interfaccia', value: font?.name },
      { label: 'Font aziendale indicato', value: brandFont },
      { label: 'Forma degli elementi', value: RADIUS_STYLES.find((r) => r.id === uiBorderRadius)?.name }
    ],
    operatorNotes
  };
}
