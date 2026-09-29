// ─────────────────────────────────────────────────────────────
// CATALOGO — Soluzioni ammissibili Voucher MIMIT Cloud & Cybersecurity 2026
// Con traduzione in "Parole Semplici per il Cliente" e Vincoli Ufficiali MIMIT.
// Nessun prezzo: offerta economica e codici di spesa sono definiti
// esclusivamente dalla Presidenza e dall'Ufficio Amministrazione.
// ─────────────────────────────────────────────────────────────

export const SOLUTIONS = [
  {
    id: 'gestionale',
    name: 'Gestionale Cloud & ERP SaaS',
    plainName: 'Centro di Comando Studio / Azienda & Fatturazione Cloud',
    short: 'Software gestionale in cloud, con o senza sito web / portale clienti integrato',
    plainExplanation: 'Un unico programma facile sul computer e sul cellulare per gestire fatture elettroniche, pratiche, clienti e magazzino, senza più fogli Excel o documenti sparsi.',
    icon: 'Boxes',
    mimitCategory: 'Cloud SaaS (Spesa Ammissibile 50% Fondo Perduto)',
    mimitRule: 'Ammissibile se erogato in cloud (SaaS). Non sono ammessi vecchi software su CD/on-premise o meri rinnovi.',
    plainBenefits: [
      'Accessibile ovunque da PC, tablet o smartphone con credenziali sicure',
      'Fatturazione elettronica immediata e invio automatico dati contabili',
      'Archivio ordinato di clienti, fornitori e scadenze'
    ],
    sectorExamples: {
      sanita: 'Cartelle cliniche pazienti, referti EEG/EMG in PDF e connettore Sistema Tessera Sanitaria (730).',
      legal: 'Fascicoli legali digitali, scadenze udienze sincronizzate e pareri archiviati.',
      benessere: 'Scheda trattamenti cliente, storico sedute e cassa/ricevute veloci.',
      retail: 'Giacenze magazzino in tempo reale, scontrini/fatture e ordini ai fornitori.'
    },
    modules: [
      { id: 'fatturazione', name: 'Contabilità & fatturazione elettronica' },
      { id: 'magazzino', name: 'Magazzino, ordini & logistica' },
      { id: 'commesse', name: 'Gestione commesse / progetti / pratiche' },
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
    plainName: 'Rubrica Intelligente Clienti & Promemoria WhatsApp Automatici',
    short: 'Gestione clienti e processi con automazioni e assistente AI integrato',
    plainExplanation: 'Una rubrica digitale che ricorda tutto di ogni cliente, manda in automatico promemoria WhatsApp ed email, e risponde subito ai nuovi contatti per non perdere lavoro.',
    icon: 'Workflow',
    mimitCategory: 'Cloud SaaS & Automazione Processi (Spesa Ammissibile 50%)',
    mimitRule: 'Ammissibile come nuova piattaforma o upgrade con intelligenza artificiale integrata.',
    plainBenefits: [
      'Mai più appuntamenti dimenticati: messaggi WhatsApp di conferma e promemoria automatici',
      'Storico completo di ogni persona: telefonate fatte, preventivi e note',
      'Assistente AI che accoglie le richieste dal sito e qualifica i contatti'
    ],
    sectorExamples: {
      sanita: 'Promemoria visita WhatsApp per azzerare i "no-show" (pazienti che non si presentano).',
      legal: 'Invio automatico richieste documenti ai clienti e aggiornamenti sullo stato della pratica.',
      benessere: 'Ricorda al cliente di rifare il trattamento o la seduta dopo 30 giorni.',
      retail: 'Messaggi personalizzati per compleanni, promozioni e riordini automatici.'
    },
    modules: [
      { id: 'contatti', name: 'Anagrafica clienti & pipeline commerciale' },
      { id: 'automazioni', name: 'Automazioni email / WhatsApp / follow-up' },
      { id: 'chatbot', name: 'Assistente AI testuale (chatbot web)' },
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
    plainName: 'Segretaria Virtuale Vocale AI 24/7 & Centralino Cloud',
    short: 'Centralino in cloud con assistente vocale AI che risponde alle chiamate',
    plainExplanation: 'Una voce virtuale professionale che risponde al telefono quando sei occupato con un cliente o a studio chiuso: fissa appuntamenti, dà informazioni e trascrive tutto.',
    icon: 'Headset',
    mimitCategory: 'Cloud SaaS & Telecomunicazioni Cloud (Spesa Ammissibile 50%)',
    mimitRule: 'Ammissibile come servizio di centralino cloud integrato e gestione vocale avanzata.',
    plainBenefits: [
      'Zero chiamate perse: risponde 24 ore su 24 con tono educato e naturale',
      'Fissa gli appuntamenti direttamente sull\'agenda condivisa',
      'Fornisce istruzioni preparatorie (es. documenti da portare o preparazione esami)'
    ],
    sectorExamples: {
      sanita: 'Risponde mentre il medico è in visita; spiega le istruzioni pre-esame (es. EEG/EMG).',
      legal: 'Raccoglie i dati del cliente e l\'oggetto della causa fuori orario studio.',
      benessere: 'Prende prenotazioni per taglio/trattamenti mentre i collaboratori lavorano.',
      retail: 'Comunica orari, disponibilità prodotti e gestisce le richieste d\'ordine.'
    },
    modules: [
      { id: 'voip', name: 'Numero VoIP / portabilità numero esistente' },
      { id: 'ivr', name: 'Smistamento chiamate & code (IVR)' },
      { id: 'trascrizioni', name: 'Registrazione & trascrizione chiamate con AI' },
      { id: 'crm_sync', name: 'Collegamento automatico chiamate ad Agenda/CRM' }
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
    plainName: 'Sito Web / Area Riservata Clienti & Vendite Online',
    short: 'Sito, e-commerce o portale collegato ai processi del gestionale SaaS',
    plainExplanation: 'Un sito moderno e un\'area riservata dove i tuoi clienti possono prenotare, scaricare documenti o acquistare in autonomia, collegato in tempo reale al tuo gestionale.',
    icon: 'ShoppingCart',
    mimitCategory: 'Cloud SaaS Integrato (Spesa Ammissibile 50%)',
    mimitRule: 'Ammissibile perché integrato a workflow e database gestionale (NO semplice sito vetrina statico).',
    plainBenefits: [
      'Clienti autonomi: scaricano fatture, referti o contratti senza telefonare',
      'Prenotazioni e pagamenti online sincronizzati istantaneamente',
      'Visibilità professionale e catalogo sempre aggiornato'
    ],
    sectorExamples: {
      sanita: 'Area sicura dove il paziente scarica i referti medici con codice OTP.',
      legal: 'Portale clienti per consultare lo stato degli atti e caricare ricevute.',
      benessere: 'Prenotazione online del servizio con scelta operatore e orario libero.',
      retail: 'Negozio online con magazzino sincronizzato e pagamenti elettronici.'
    },
    modules: [
      { id: 'ecommerce', name: 'E-commerce con ordini sincronizzati al gestionale' },
      { id: 'catalogo', name: 'Catalogo prodotti/servizi collegato in tempo reale' },
      { id: 'prenotazioni', name: 'Prenotazioni online collegate all\'agenda' },
      { id: 'area_clienti', name: 'Area clienti con documenti, fatture e pratiche' }
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
    plainName: 'Motore di Ricerca Privato & Archivio Intelligente Documenti',
    short: 'Archivio intelligente dei documenti aziendali, conforme GDPR',
    plainExplanation: 'Un archivio intelligente blindato che legge tutti i tuoi PDF, contratti o normative e risponde a qualsiasi tua domanda in 2 secondi, trovando subito la pagina che cerchi.',
    icon: 'BookLock',
    mimitCategory: 'Cloud SaaS & Intelligenza Artificiale (Spesa Ammissibile 50%)',
    mimitRule: 'Ammissibile su server UE certificati GDPR per la valorizzazione del patrimonio informativo aziendale.',
    plainBenefits: [
      'Trova all\'istante qualsiasi dato o clausola senza sprecare ore a cercare tra i faldoni',
      'Confronta contratti, perizie o schede tecniche in linguaggio naturale',
      'Dati protetti e riservati: accessibile solo dal personale autorizzato'
    ],
    sectorExamples: {
      sanita: 'Ricerca rapida tra linee guida cliniche, protocolli e storico anamnesi.',
      legal: 'Ricerca istantanea tra giurisprudenza, memorie difensive e contratti di studio.',
      benessere: 'Schede tecniche prodotti, manuali macchinari estetici e normative igieniche.',
      retail: 'Schede tecniche articoli, listini fornitori e procedure reso.'
    },
    modules: [
      { id: 'archivio', name: 'Archivio documenti interrogabile in italiano semplice' },
      { id: 'permessi', name: 'Permessi di accesso riservati per ruolo' },
      { id: 'assistente_interno', name: 'Assistente interno per i collaboratori' },
      { id: 'dati_ue', name: 'Server europei crittografati al 100% GDPR' }
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
    plainName: 'Cassaforte Digitale, Firewall & Backup Salvavita',
    short: 'Firewall di nuova generazione, EDR, antivirus e backup in cloud',
    plainExplanation: 'La protezione totale per i tuoi computer e la tua rete contro virus ricattatori (ransomware) e ladri di dati, con copia di sicurezza automatica su server protetti.',
    icon: 'ShieldCheck',
    mimitCategory: 'Cybersecurity Hardware & Software (Spesa Ammissibile 50%)',
    mimitRule: 'Ammissibili firewall NGFW fisici, antivirus/EDR gestiti e backup in cloud. NO computer/PC generici.',
    plainBenefits: [
      'Blocca le truffe via email, phishing e virus prima che infettino i computer',
      'Backup automatico ogni sera: se un PC si rompe o viene rubato, recuperi tutto in pochi minuti',
      'Tranquillità legale totale: piena conformità al Garante Privacy e normative GDPR'
    ],
    sectorExamples: {
      sanita: 'Protezione dati sanitari sensibili dei pazienti da attacchi e perdite accidentali.',
      legal: 'Segretezza assoluta degli atti legali e dei dati bancari/patrimoniali dei clienti.',
      benessere: 'Sicurezza dei dati anagrafici e pagamenti elettronici.',
      retail: 'Protezione delle casse telematiche, ordini online e banche dati clienti.'
    },
    modules: [
      { id: 'firewall', name: 'Firewall NGFW fisico per la rete aziendale' },
      { id: 'edr', name: 'EDR – blocco automatico ransomware e virus avanzati' },
      { id: 'antivirus', name: 'Antivirus professionale gestito' },
      { id: 'backup', name: 'Copia di sicurezza automatica in Cloud protetto' }
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
  { id: 'sanita', name: 'Sanità, Medici & Studi Specialistici', icon: 'Stethoscope', recommended: ['voice', 'gestionale', 'cyber', 'rag'] },
  { id: 'legal', name: 'Studi Legali, Avvocati & Commercialisti', icon: 'Scale', recommended: ['rag', 'gestionale', 'cyber', 'crm'] },
  { id: 'benessere', name: 'Benessere, Bellezza & Cura Personale (Parrucchieri, Estetica, Barbieri, SPA)', icon: 'Scissors', recommended: ['voice', 'crm', 'gestionale', 'web'] },
  { id: 'hospitality', name: 'Ristorazione, Bar & Hospitality', icon: 'UtensilsCrossed', recommended: ['voice', 'crm', 'web'] },
  { id: 'retail', name: 'Retail, Negozi & E-commerce', icon: 'ShoppingBag', recommended: ['web', 'gestionale', 'crm', 'cyber'] },
  { id: 'real_estate', name: 'Immobiliare & Agenzie', icon: 'House', recommended: ['crm', 'voice', 'web'] },
  { id: 'automotive', name: 'Automotive, Officine & Concessionarie', icon: 'Car', recommended: ['voice', 'crm', 'gestionale', 'cyber'] },
  { id: 'manufacturing', name: 'Manifattura & Industria', icon: 'Factory', recommended: ['gestionale', 'rag', 'cyber'] },
  { id: 'finance', name: 'Finance, Banche & Assicurazioni', icon: 'Landmark', recommended: ['cyber', 'rag', 'crm'] },
  { id: 'b2b', name: 'Servizi B2B, Consulenza & Agenzie', icon: 'Briefcase', recommended: ['crm', 'gestionale', 'web'] },
  { id: 'education', name: 'Formazione, Scuole & Corsi', icon: 'GraduationCap', recommended: ['web', 'crm', 'rag'] },
  { id: 'startup', name: 'Startup & Nuove Imprese', icon: 'Rocket', recommended: ['crm', 'web', 'gestionale', 'cyber'] },
  { id: 'other', name: 'Altro Settore / Multi-Attività', icon: 'LayoutGrid', recommended: ['gestionale', 'crm', 'voice', 'cyber'] }
];

export const getSolution = (id) => SOLUTIONS.find((s) => s.id === id);
export const isRecommended = (sector, solutionId) => Boolean(sector?.recommended?.includes(solutionId));
