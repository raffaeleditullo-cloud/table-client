// Opzioni della Scheda Tecnica di Fabbisogno. Nessun prezzo o costo.

export const COLOR_PALETTES = [
  { id: 'cyan', name: 'Electric Cyan', hex: '#06b6d4' },
  { id: 'purple', name: 'Obsidian Violet', hex: '#8b5cf6' },
  { id: 'emerald', name: 'Fintech Emerald', hex: '#10b981' },
  { id: 'amber', name: 'Solar Amber', hex: '#f59e0b' },
  { id: 'rose', name: 'Neon Rose', hex: '#f43f5e' },
  { id: 'blue', name: 'Deep Royal', hex: '#3b82f6' },
  { id: 'titanium', name: 'Titanium Slate', hex: '#64748b' }
];

export const FONT_OPTIONS = [
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', style: 'Modern & Clean', family: "'Plus Jakarta Sans', sans-serif" },
  { id: 'Inter', name: 'Inter', style: 'Neutro, Enterprise & Standard UI', family: "'Inter', sans-serif" },
  { id: 'Outfit', name: 'Outfit', style: 'Geometrico, Morbido & Consumer', family: "'Outfit', sans-serif" },
  { id: 'Space Grotesk', name: 'Space Grotesk', style: 'Hi-Tech & Futuristico', family: "'Space Grotesk', sans-serif" },
  { id: 'Syne', name: 'Syne', style: 'Creativo, Luxury & Bold', family: "'Syne', sans-serif" },
  { id: 'Fira Code', name: 'Fira Code', style: 'Developer & Tech Terminal', family: "'Fira Code', monospace" }
];

export const RADIUS_STYLES = [
  { id: 'rounded-xl', name: 'Arrotondato Moderno', radius: '14px' },
  { id: 'rounded-none', name: 'Squadrato Minimal', radius: '0px' },
  { id: 'rounded-3xl', name: 'Pill Friendly', radius: '28px' }
];

// Stile grafico in un click: imposta insieme carattere e forma degli angoli
export const STYLE_PRESETS = [
  { id: 'moderno', name: 'Moderno', desc: 'Pulito, attuale, adatto a tutti', fontId: 'Plus Jakarta Sans', radius: 'rounded-xl' },
  { id: 'essenziale', name: 'Essenziale', desc: 'Rigoroso e professionale', fontId: 'Inter', radius: 'rounded-none' },
  { id: 'amichevole', name: 'Amichevole', desc: 'Morbido e accogliente', fontId: 'Outfit', radius: 'rounded-3xl' },
  { id: 'tecnologico', name: 'Tecnologico', desc: 'Innovativo e deciso', fontId: 'Space Grotesk', radius: 'rounded-none' }
];

// ── Luxury 3D AI Orbs (Visual Brand Identity per Assistente AI) ──
export const AI_ORBS = [
  {
    id: 'nexus_cyber',
    name: 'Nexus Cyber (Marmo Smeraldo & Oro 24K)',
    persona: 'Strategic, Executive & Creative',
    tag: 'Brand Ufficiale Conflavoro',
    type: 'pbr_marble',
    glowColor: 'rgba(0, 163, 163, 0.45)',
    bgDark: '#021512',
    accentHex: '#00a3a3',
    desc: 'Marmo verde smeraldo scuro Calacatta con venature in lamina d\'oro 24K e riflesso specchiato.'
  },
  {
    id: 'aura_quantum',
    name: 'Aura Quantum (Cristallo Ametista & Raggi)',
    persona: 'Analytical, Visionary & Decisive',
    tag: 'Cristallo Quantistico',
    type: 'procedural_crystal',
    glowColor: 'rgba(157, 0, 255, 0.4)',
    bgDark: '#030106',
    accentHex: '#9d00ff',
    desc: 'Struttura geometrica icosaedrica a gemma con sfaccettature riflettenti viola ossidiana e iridescenza lilla.'
  },
  {
    id: 'scifi_crimson',
    name: 'Crimson Core (Cyberpunk & Carbonio)',
    persona: 'High-Speed, Security & Precision',
    tag: 'Cyber Defense',
    type: 'pbr_scifi',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    bgDark: '#110305',
    accentHex: '#ef4444',
    desc: 'Nucleo energetico rosso rubino con pattern di emissione cibernetica ad alto contrasto.'
  },
  {
    id: 'liquid_cobalt',
    name: 'Liquid Cobalt (Cromo Titanio Blu Reale)',
    persona: 'Enterprise, Corporate & Trust',
    tag: 'Liquid Metal',
    type: 'procedural_chrome',
    glowColor: 'rgba(31, 71, 209, 0.45)',
    bgDark: '#050b1e',
    accentHex: '#1f47d1',
    desc: 'Metallo liquido specchiato ad altissima rifrazione con smalto protettivo in vetro zaffiro.'
  },
  {
    id: 'solar_amber',
    name: 'Solar Amber Luxe (Oro Zecchino & Quarzo)',
    persona: 'Warm, Hospitality & Luxury',
    tag: 'Gold Edition',
    type: 'procedural_gold',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    bgDark: '#1c1002',
    accentHex: '#f59e0b',
    desc: 'Sfera solare in oro caldo con riflessi di topazio lucido e rifrazione calda per il brand.'
  }
];

export const HOSTING_COMPLIANCE = [
  { id: 'eu_cloud', name: 'Cloud Europeo (Francoforte/Milano)', gdpr: '100% GDPR Compliant' },
  { id: 'swiss_vault', name: 'Swiss On-Premise / Strict Vault', gdpr: 'Banche & Sanità' },
  { id: 'global_edge', name: 'Global Serverless Edge', gdpr: 'Massima Ridondanza' }
];

// ── Agente vocale ──
export const VOICE_GENDERS = [
  { id: 'male', name: 'Voce Maschile', desc: 'Un unico assistente con voce maschile', icon: 'User' },
  { id: 'female', name: 'Voce Femminile', desc: 'Un unico assistente con voce femminile', icon: 'UserRound' },
  { id: 'both', name: 'Entrambe', desc: 'Voci intercambiabili / più operatori virtuali', icon: 'UsersRound' }
];

export const VOICE_ROLES = [
  { id: 'appointments', name: 'Presa Appuntamenti & Calendario', icon: 'CalendarCheck' },
  { id: 'support', name: 'Assistenza Clienti & FAQ', icon: 'LifeBuoy' },
  { id: 'routing', name: 'Qualificazione Lead / Centralino di Smistamento', icon: 'PhoneForwarded' },
  { id: 'tech_support', name: 'Supporto Tecnico di Primo Livello', icon: 'Wrench' }
];

// ── Canali & integrazioni (senza costi) ──
export const CHANNEL_GROUPS = [
  { id: 'channels', name: 'Canali di contatto' },
  { id: 'systems', name: 'Collegamenti con sistemi esistenti' },
  { id: 'devices', name: 'Dispositivi fisici' }
];

export const CHANNELS = [
  { id: 'whatsapp', group: 'channels', name: 'WhatsApp Business', icon: 'MessageCircle' },
  { id: 'voip', group: 'channels', name: 'Linea VoIP / numero aziendale', icon: 'Phone' },
  { id: 'web_chat', group: 'channels', name: 'Chat sul sito web', icon: 'Layout' },
  { id: 'email', group: 'channels', name: 'Email', icon: 'Mail' },
  { id: 'telegram', group: 'channels', name: 'Telegram', icon: 'Send' },
  { id: 'crm_existing', group: 'systems', name: 'CRM già in uso (HubSpot, Salesforce…)', icon: 'Share2' },
  { id: 'calendar', group: 'systems', name: 'Calendario (Google, Outlook, Calendly)', icon: 'Calendar' },
  { id: 'erp_existing', group: 'systems', name: 'Gestionale / ERP già in uso', icon: 'Server' },
  { id: 'ecommerce_existing', group: 'systems', name: 'Negozio online esistente (Shopify, WooCommerce…)', icon: 'ShoppingCart' },
  { id: 'payments', group: 'systems', name: 'Pagamenti online', icon: 'CreditCard' },
  { id: 'automation', group: 'systems', name: 'Automazioni Make / Zapier / Webhook', icon: 'Zap' },
  { id: 'pbx', group: 'devices', name: 'Centralino fisico in ufficio', icon: 'Router' },
  { id: 'kiosk', group: 'devices', name: 'Totem touch', icon: 'Monitor' },
  { id: 'tablet', group: 'devices', name: 'Tablet reception', icon: 'Tablet' },
  { id: 'pos', group: 'devices', name: 'Cassa / POS', icon: 'Receipt' },
  { id: 'iot', group: 'devices', name: 'Sensori IoT / domotica', icon: 'Radio' }
];

// ── Stato iniziale: voci rapide ──
export const CURRENT_STATE_CHIPS = [
  'Fogli Excel',
  'Agenda o archivio cartaceo',
  'Centralino analogico',
  'Nessun CRM',
  'Software gestionale obsoleto on-premise',
  'Sito vetrina non collegato ai processi',
  'Nessun sito web',
  'Solo antivirus di base',
  'Backup manuali o assenti',
  'Chiamate perse fuori orario'
];
