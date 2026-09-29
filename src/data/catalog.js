// ─────────────────────────────────────────────────────────────
// CATALOGO — Soluzioni ammissibili Voucher MIMIT Cloud & Cybersecurity 2026
// Nessun prezzo: offerta economica e codici di spesa sono definiti
// esclusivamente dalla Presidenza e dall'Ufficio Amministrazione.
// ─────────────────────────────────────────────────────────────

export const SOLUTIONS = [
  {
    id: 'gestionale',
    name: 'Gestionale Cloud & ERP SaaS',
    short: 'Software gestionale in cloud, con o senza sito web / portale clienti integrato',
    icon: 'Boxes',
    eligibility: 'Software gestionale erogato in modalità SaaS (cloud), accessibile da browser e dispositivi mobili.',
    modules: [
      { id: 'fatturazione', name: 'Contabilità & fatturazione elettronica' },
      { id: 'magazzino', name: 'Magazzino, ordini & logistica' },
      { id: 'commesse', name: 'Gestione commesse / progetti' },
      { id: 'hr', name: 'Personale, presenze & turni' },
      { id: 'sito_integrato', name: 'Sito web integrato al gestionale' },
      { id: 'portale_clienti', name: 'Portale clienti / area riservata' }
    ],
    improvements: [
      'Gestionale in cloud accessibile da qualsiasi sede e dispositivo',
      'Dati aziendali centralizzati al posto di fogli Excel e archivi separati',
      'Fatturazione, ordini e magazzino automatizzati e sincronizzati'
    ]
  },
  {
    id: 'crm',
    name: 'CRM & Automazione Workflow con AI',
    short: 'Gestione clienti e processi con automazioni e assistente AI integrato',
    icon: 'Workflow',
    eligibility: 'Piattaforma CRM in cloud con automazione dei flussi di lavoro e funzioni di intelligenza artificiale.',
    modules: [
      { id: 'contatti', name: 'Anagrafica clienti & pipeline commerciale' },
      { id: 'automazioni', name: 'Automazioni email / WhatsApp / follow-up' },
      { id: 'chatbot', name: 'Assistente AI testuale (chatbot)' },
      { id: 'calendario', name: 'Agenda & appuntamenti integrati' },
      { id: 'report', name: 'Report & dashboard direzionali' }
    ],
    improvements: [
      'Storico clienti e trattative unificato e consultabile da tutto il team',
      'Follow-up e promemoria automatici, nessun contatto dimenticato',
      'Assistente AI che risponde ai clienti e qualifica le richieste'
    ]
  },
  {
    id: 'voice',
    name: 'Centralino Virtuale VoIP & Agente Vocale AI',
    short: 'Centralino in cloud con assistente vocale AI che risponde alle chiamate',
    icon: 'Headset',
    eligibility: 'Centralino virtuale in cloud (VoIP) con agente vocale basato su intelligenza artificiale.',
    modules: [
      { id: 'voip', name: 'Numero VoIP / portabilità numero esistente' },
      { id: 'ivr', name: 'Smistamento chiamate & code (IVR)' },
      { id: 'trascrizioni', name: 'Registrazione & trascrizione chiamate' },
      { id: 'crm_sync', name: 'Collegamento chiamate al CRM / gestionale' }
    ],
    improvements: [
      'Nessuna chiamata persa: risposta automatica 24/7 anche fuori orario',
      'Centralino in cloud al posto dell\'impianto analogico',
      'Appuntamenti e richieste registrati automaticamente durante la chiamata'
    ]
  },
  {
    id: 'web',
    name: 'Portale Web & E-commerce integrato a Gestionale Cloud',
    short: 'Sito, e-commerce o portale collegato ai processi del gestionale SaaS',
    icon: 'ShoppingCart',
    eligibility: 'Il sito web è ammissibile in quanto collegato a workflow e gestionale SaaS (ordini, clienti, magazzino, prenotazioni): non si tratta di un semplice sito vetrina.',
    modules: [
      { id: 'ecommerce', name: 'E-commerce con ordini sincronizzati al gestionale' },
      { id: 'catalogo', name: 'Catalogo prodotti collegato al magazzino' },
      { id: 'prenotazioni', name: 'Prenotazioni online collegate all\'agenda' },
      { id: 'area_clienti', name: 'Area clienti con documenti e pratiche' }
    ],
    improvements: [
      'Ordini e prenotazioni online che arrivano direttamente nel gestionale',
      'Catalogo e disponibilità sempre allineati al magazzino',
      'Clienti autonomi nell\'area riservata, meno telefonate all\'ufficio'
    ]
  },
  {
    id: 'rag',
    name: 'Knowledge Base Aziendale / RAG Documentale sicuro',
    short: 'Archivio intelligente dei documenti aziendali, conforme GDPR',
    icon: 'BookLock',
    eligibility: 'Sistema cloud di gestione e interrogazione documentale con AI, con dati protetti e conformità GDPR.',
    modules: [
      { id: 'archivio', name: 'Archivio documenti interrogabile in linguaggio naturale' },
      { id: 'permessi', name: 'Permessi di accesso per ruolo' },
      { id: 'assistente_interno', name: 'Assistente interno per i dipendenti' },
      { id: 'dati_ue', name: 'Dati ospitati su server UE' }
    ],
    improvements: [
      'Informazioni ritrovate in secondi invece di cercare tra cartelle e carta',
      'Procedure e documenti accessibili in sicurezza, con permessi per ruolo',
      'Nuovi dipendenti operativi più velocemente'
    ]
  },
  {
    id: 'cyber',
    name: 'Cybersecurity & Protezione Reti',
    short: 'Firewall di nuova generazione, EDR, antivirus e backup in cloud',
    icon: 'ShieldCheck',
    eligibility: 'Soluzioni di sicurezza informatica per la protezione di reti, dispositivi e dati aziendali.',
    modules: [
      { id: 'firewall', name: 'Firewall NGFW (nuova generazione)' },
      { id: 'edr', name: 'EDR – protezione avanzata degli endpoint' },
      { id: 'antivirus', name: 'Antivirus gestito' },
      { id: 'backup', name: 'Backup Cloud automatico' }
    ],
    improvements: [
      'Rete aziendale protetta da accessi non autorizzati e attacchi',
      'Dispositivi monitorati con risposta automatica alle minacce',
      'Backup automatici in cloud al posto di copie manuali o assenti'
    ]
  }
];

// Settore del cliente. `recommended` = aree di soluzione più frequenti nel settore.
export const SECTORS = [
  { id: 'benessere', name: 'Benessere, Bellezza & Cura Personale (Parrucchieri, Estetica, Barbieri, SPA)', icon: 'Scissors', recommended: ['voice', 'crm', 'gestionale', 'web'] },
  { id: 'sanita', name: 'Sanità, Ospedali & Studi Medici', icon: 'Stethoscope', recommended: ['voice', 'gestionale', 'rag', 'cyber'] },
  { id: 'legal', name: 'Studi Legali, Avvocati & Commercialisti', icon: 'Scale', recommended: ['rag', 'gestionale', 'cyber'] },
  { id: 'hospitality', name: 'Ristorazione, Bar & Hospitality', icon: 'UtensilsCrossed', recommended: ['voice', 'crm', 'web'] },
  { id: 'retail', name: 'Retail, Negozi & E-commerce', icon: 'ShoppingBag', recommended: ['web', 'gestionale', 'crm'] },
  { id: 'real_estate', name: 'Immobiliare & Agenzie', icon: 'House', recommended: ['crm', 'voice', 'web'] },
  { id: 'automotive', name: 'Automotive, Officine & Concessionarie', icon: 'Car', recommended: ['voice', 'crm', 'gestionale'] },
  { id: 'manufacturing', name: 'Manifattura & Industria', icon: 'Factory', recommended: ['gestionale', 'rag', 'cyber'] },
  { id: 'finance', name: 'Finance, Banche & Assicurazioni', icon: 'Landmark', recommended: ['cyber', 'rag', 'crm'] },
  { id: 'b2b', name: 'Servizi B2B, Consulenza & Agenzie', icon: 'Briefcase', recommended: ['crm', 'gestionale', 'web'] },
  { id: 'education', name: 'Formazione, Scuole & Corsi', icon: 'GraduationCap', recommended: ['web', 'crm', 'rag'] },
  { id: 'startup', name: 'Startup & Nuove Imprese', icon: 'Rocket', recommended: ['crm', 'web', 'gestionale'] },
  { id: 'other', name: 'Altro Settore / Multi-Attività', icon: 'LayoutGrid', recommended: [] }
];

export const getSolution = (id) => SOLUTIONS.find((s) => s.id === id);
export const isRecommended = (sector, solutionId) => Boolean(sector?.recommended.includes(solutionId));
