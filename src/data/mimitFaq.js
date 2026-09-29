// ─────────────────────────────────────────────────────────────
// CHEAT-SHEET COMPLETA FAQ MIMIT & SPIEGAZIONE SEMPLICE TECNOLOGIE
// Voucher MIMIT Cloud & Cybersecurity 2026 — Conflavoro AI
// Aggiornata con i Decreti Ministeriali e le Guide Ufficiali MIMIT
// ─────────────────────────────────────────────────────────────

export const FAQ_CATEGORIES = [
  { id: 'all', label: 'Tutte le FAQ' },
  { id: 'bando', label: 'Bando & Soldi (50%)' },
  { id: 'date', label: 'Date & Click-Day' },
  { id: 'requisiti', label: 'Requisiti & Documenti' },
  { id: 'ammissibilita', label: 'Cosa si può / NON si può fare' },
  { id: 'tecnica', label: 'Spiegazione Tecnologie in Parole Semplici' },
  { id: 'settori', label: 'Casi Pratici per Settore' }
];

export const MIMIT_FAQ = [
  // ── 1. BANDO & SOLDI ──
  {
    id: 'contributo_misura',
    category: 'bando',
    icon: 'Euro',
    badge: 'Contributo 50%',
    question: 'Quanto copre il Voucher MIMIT e quanto mi danno a fondo perduto?',
    answer: 'Il Voucher copre il 50% a fondo perduto delle spese ammissibili, fino a un massimo di 20.000 € per beneficiario.',
    details: [
      'Spesa minima ammissibile: 4.000 € (ricevi 2.000 € a fondo perduto).',
      'Spesa che satura il contributo: 40.000 € (ricevi 20.000 € a fondo perduto).',
      'Esempio: su un progetto da 30.000 €, ricevi 15.000 € a fondo perduto dal Ministero.',
      'Dotazione finanziaria totale: 150 Milioni di euro (di cui oltre 71 Milioni riservati al Mezzogiorno).'
    ]
  },
  {
    id: 'prestito_restituzione',
    category: 'bando',
    icon: 'BadgeCheck',
    badge: 'Fondo Perduto',
    question: 'È un prestito da restituire o un finanziamento bancario?',
    answer: 'No, è un contributo a FONDO PERDUTO a titolo definitivo. Non va restituito.',
    details: [
      'Non ci sono tassi di interesse né rate bancarie.',
      'L\'importo concesso è a rimborso diretto sul conto corrente dell\'azienda/professionista.'
    ]
  },
  {
    id: 'come_funziona_pagamento',
    category: 'bando',
    icon: 'ArrowRightLeft',
    badge: 'Meccanismo a Rimborso',
    question: 'I soldi arrivano in anticipo o come funziona il pagamento?',
    answer: 'Il bando funziona con la formula a RIMBORSO: il beneficiario sostiene la spesa con bonifico parlante e poi riceve il 50% dal Ministero.',
    details: [
      'Può essere richiesto in 2 tranche (50% a metà progetto + saldo a fine piano) o in un\'unica soluzione finale.',
      'IMPORTANTE: Nessun pagamento o contratto deve essere avviato prima della presentazione formale della domanda (10 Novembre).'
    ]
  },
  {
    id: 'quante_domande',
    category: 'bando',
    icon: 'Building2',
    badge: 'Regola 1 Domanda',
    question: 'Quante domande può presentare la stessa azienda?',
    answer: 'Una sola domanda per ciascun soggetto giuridico (Codice Fiscale / Partita IVA).',
    details: [
      'Il piano può riguardare più unità locali, ma si indica la sede prevalente.',
      'La sede prevalente determina anche l\'accesso alla riserva speciale per il Mezzogiorno.'
    ]
  },

  // ── 2. DATE & SCADENZE ──
  {
    id: 'date_sportello',
    category: 'date',
    icon: 'CalendarDays',
    badge: 'Scadenze Ufficiali',
    question: 'Quali sono le date ufficiali da segnare per non perdere il bando?',
    answer: 'La procedura si articola in 3 date chiave su piattaforma ministeriale Invitalia:',
    details: [
      '20 OTTOBRE 2026 (ore 12:00): Apertura Precompilazione (caricamento dati, offerta tecnica fornitore abilitato, firma digitale e rilascio Codice di Predisposizione).',
      '10 NOVEMBRE 2026 (ore 12:00): Click-Day / Apertura Invio Formale con il Codice di Predisposizione.',
      '20 GENNAIO 2027 (ore 12:00): Chiusura formale dello sportello (salvo chiusura anticipata per esaurimento risorse).'
    ]
  },
  {
    id: 'graduatoria_cronologica',
    category: 'date',
    icon: 'Zap',
    badge: 'Ordine Cronologico',
    question: 'Cosa significa che la procedura è "a sportello valutativo cronologico"?',
    answer: 'Le domande vengono esaminate e accolte in base all\'ordine esatto di invio (data e ora del click-day del 10 Novembre).',
    details: [
      'I fondi da 150 milioni sono limitati: chi prima invia la domanda completa, prima si assicura il contributo.',
      'Per questo è fondamentale precompilare e firmare il progetto già nella finestra del 20 Ottobre.'
    ]
  },
  {
    id: 'chi_invia_domanda',
    category: 'date',
    icon: 'ShieldCheck',
    badge: 'Invio Domanda',
    question: 'Chi invia la domanda su Invitalia? Ci pensa Conflavoro?',
    answer: 'No, l\'invio formale su Invitalia compete esclusivamente al cliente (o al suo commercialista) tramite SPID/CIE.',
    details: [
      'Conflavoro è il Fornitore Tecnologico Abilitato MIMIT: predispone l\'architettura tecnica, il progetto e il preventivo formale con Codice Fornitore MIMIT.',
      'Il cliente o il suo consulente fiscale carica il preventivo il 20 Ottobre e trasmette il codice al Click-Day del 10 Novembre in piena autonomia.'
    ]
  },

  // ── 3. REQUISITI & DOCUMENTI ──
  {
    id: 'chi_puo_partecipare',
    category: 'requisiti',
    icon: 'Briefcase',
    badge: 'Soggetti Ammessi',
    question: 'Chi può partecipare al Voucher? I liberi professionisti sono ammessi?',
    answer: 'SÌ! Possono partecipare Micro, Piccole e Medie Imprese (PMI) e TUTTI i lavoratori autonomi e Liberi Professionisti con Partita IVA attiva.',
    details: [
      'Liberi professionisti ordinistici (Medici, Avvocati, Commercialisti, Ingegneri, ecc.) e non ordinistici.',
      'Società di capitali (S.r.l., S.p.A.), di persone (S.n.c., S.a.s.), ditte individuali e studi associati.',
      'Escluse solo le grandi imprese (oltre 250 dipendenti / oltre 50M€ fatturato).'
    ]
  },
  {
    id: 'requisiti_durc_connessione',
    category: 'requisiti',
    icon: 'ShieldCheck',
    badge: 'Requisiti di Base',
    question: 'Quali requisiti tecnici e amministrativi deve possedere il cliente?',
    answer: 'Sono richiesti 4 requisiti fondamentali facilmente verificabili:',
    details: [
      '1. Connessione internet con velocità minima di 30 Mbps in download attiva.',
      '2. DURC regolare (per le imprese con dipendenti/inps/inail).',
      '3. Identità Digitale (SPID, CIE o CNS del titolare/legale rappresentante) + Firma Digitale (.p7m) + PEC attiva.',
      '4. Capienza nel Regime "De Minimis" (massimo 300.000 € di aiuti ricevuti negli ultimi 3 anni).'
    ]
  },
  {
    id: 'de_minimis_spiegato',
    category: 'requisiti',
    icon: 'Landmark',
    badge: 'De Minimis',
    question: 'Cos\'è il regime "De Minimis" e come si controlla?',
    answer: 'È la regola europea che fissa a 300.000 € il tetto massimo di contributi pubblici a fondo perduto ricevibili da una singola impresa nell\'arco di un triennio.',
    details: [
      'La stragrande maggioranza dei professionisti e delle PMI ha capienza piena e non ha mai raggiunto tale soglia.',
      'Viene verificato automaticamente tramite visura del Registro Nazionale Aiuti di Stato (RNA).'
    ]
  },

  // ── 4. COSA SI PUÒ / NON SI PUÒ FARE (AMMISSIBILITÀ) ──
  {
    id: 'cosa_finanzia',
    category: 'ammissibilita',
    icon: 'CheckCircle2',
    badge: '100% Ammissibile',
    question: 'Cosa si può comprare con il voucher?',
    answer: 'Tutte le soluzioni software in Cloud (SaaS), Intelligenza Artificiale integrata, Centralini virtuali VoIP e Cybersecurity Hardware/Software.',
    details: [
      '1. Cloud SaaS: Gestionali di studio/azienda, CRM, portali clienti, workflow automatici, fatturazione sanitaria/elettronica.',
      '2. Agenti Vocali & VoIP: Centralini cloud con assistente AI che risponde al telefono e fissa appuntamenti.',
      '3. Cybersecurity Software: Antivirus gestiti, sistemi EDR di protezione da ransomware, backup cloud ridondati UE.',
      '4. Cybersecurity Hardware: Apparati fisici di sicurezza di rete come Firewall NGFW (Next Generation Firewall).',
      '5. Servizi Tecnici: Installazione, configurazione e messa in funzione operativa (fino a un massimo del 30% del piano).'
    ]
  },
  {
    id: 'cosa_escluso_vietato',
    category: 'ammissibilita',
    icon: 'Ban',
    badge: 'Cosa è VIETATO',
    question: 'Cosa NON si può assolutamente finanziare (Cose da NON promettere al cliente)?',
    answer: 'Il Ministero esclude categoricamente 5 categorie di spesa:',
    details: [
      '❌ NO Computer, Laptop, Tablet o Smartphone generici (non sono ammessi).',
      '❌ NO Semplici rinnovi di contratti o licenze già esistenti con le stesse identiche funzioni.',
      '❌ NO Corsi di formazione o consulenze teoriche pure prive di implementazione software.',
      '❌ NO Software installati su vecchi CD/chiavette "on-premise" non in cloud.',
      '❌ NO Spese o contratti firmati e pagati prima della domanda del 10 Novembre.'
    ]
  },
  {
    id: 'rinnovo_vs_upgrade',
    category: 'ammissibilita',
    icon: 'Sparkles',
    badge: 'Regola Upgrade',
    question: 'Se il cliente usa già un software, può partecipare al voucher?',
    answer: 'SÌ, purché il progetto rappresenti un UPGRADE SOSTANZIALE con nuove tecnologie (es. aggiunta di AI, automazioni di processo, cloud o sicurezza avanzata).',
    details: [
      'Il semplice rinnovo di canone annuale viene bocciato dal Ministero.',
      'Il passaggio a un gestionale cloud con AI vocale integrata, archiviazione documentale o connettori RENTRI è invece pienamente ammissibile come innovazione tecnologica.'
    ]
  },
  {
    id: 'fornitore_abilitato',
    category: 'ammissibilita',
    icon: 'Building',
    badge: 'Conflavoro Abilitato',
    question: 'Il cliente può scegliere qualsiasi fornitore trovato su internet?',
    answer: 'NO. Il fornitore deve essere presente nell\'Elenco Ufficiale dei Fornitori Abilitati MIMIT.',
    details: [
      'Conflavoro Servizi S.r.l. è fornitore formalmente abilitato dal MIMIT con codice fornitore certificato.',
      'Tutte le soluzioni proposte nel nostro catalogo sono mappate sui codici identificativi di spesa ammissibili ministeriali.'
    ]
  },

  // ── 5. SPIEGAZIONE TECNOLOGIE IN PAROLE SEMPLICI ──
  {
    id: 'spiega_crm',
    category: 'tecnica',
    icon: 'Workflow',
    badge: 'Termine: CRM',
    question: 'Come spiegare cos\'è un "CRM" a un cliente che non sa cosa sia?',
    answer: '«È la rubrica intelligente del tuo lavoro: un archivio digitale che ricorda ogni cliente, le sue richieste, i preventivi e gli appuntamenti, inviando messaggi automatici su WhatsApp.»',
    details: [
      'Sostituisce i fogliettini volanti, le agende cartacee e le chat personali di WhatsApp sparse sui telefoni.',
      'Quando un cliente richiama, sai esattamente chi è, cosa ha acquistato e quale pratica ha in sospeso.'
    ]
  },
  {
    id: 'spiega_gestionale_erp',
    category: 'tecnica',
    icon: 'Boxes',
    badge: 'Termine: ERP / SaaS',
    question: 'Come spiegare cos\'è un "Gestionale Cloud ERP SaaS"?',
    answer: '«È il centro di comando del tuo studio o della tua azienda, accessibile dal computer dell\'ufficio o dal cellulare a casa.»',
    details: [
      'Gestisce fatture elettroniche, scadenze, pagamenti, pratiche e magazzino in un unico posto sicuro.',
      'Non serve installare programmi pesanti: si accede via internet protetto con le proprie credenziali.'
    ]
  },
  {
    id: 'spiega_agente_vocale',
    category: 'tecnica',
    icon: 'Headset',
    badge: 'Termine: Voice AI',
    question: 'Come spiegare l\'"Agente Vocale AI / Centralino VoIP"?',
    answer: '«È la segretaria virtuale infaticabile che risponde al telefono quando sei occupato con un cliente o fuori orario, fissando visite e rispondendo alle domande.»',
    details: [
      'Parla con voce naturale ed educata, conosce gli orari dello studio e i servizi offerti.',
      'Registra l\'appuntamento sull\'agenda e invia subito la conferma su WhatsApp al cliente, azzerando le chiamate perse.'
    ]
  },
  {
    id: 'spiega_cybersecurity',
    category: 'tecnica',
    icon: 'ShieldCheck',
    badge: 'Termine: Cybersecurity',
    question: 'Come spiegare la "Cybersecurity & Backup Cloud"?',
    answer: '«È la cassaforte e la polizza salvavita per i tuoi dati aziendali contro virus, hacker e guasti al computer.»',
    details: [
      'Installa una protezione avanzata (Firewall/Antivirus) che blocca i tentativi di truffa e i ransomware che bloccano i file chiedendo riscatti.',
      'Fa la copia di sicurezza (backup) automatica ogni sera in server protetti europei: se il PC si rompe o viene rubato, recuperi tutto in 5 minuti.'
    ]
  },
  {
    id: 'spiega_rag_kb',
    category: 'tecnica',
    icon: 'BookLock',
    badge: 'Termine: RAG / Knowledge Base',
    question: 'Come spiegare la "Knowledge Base / RAG Documentale"?',
    answer: '«È un motore di ricerca intelligente privato per tutti i documenti e le pratiche del tuo studio/azienda.»',
    details: [
      'Basta fare una domanda in italiano (es. "Quali sono le clausole del contratto Rossi?" o "Mostrami i referti dell\'ultimo mese") e l\'assistente trova la risposta esatta all\'istante.',
      'I documenti rimangono blindati e riservati, nel pieno rispetto della privacy GDPR.'
    ]
  },

  // ── 6. CASI PRATICI PER SETTORE ──
  {
    id: 'settore_medico',
    category: 'settori',
    icon: 'Stethoscope',
    badge: 'Settore Medico',
    question: 'Cosa proporre e come parlarne a uno Studio Medico / Specialista?',
    answer: 'Puntare su: 1) Centralino AI per non rispondere mentre visita, 2) Gestione rifiuti RENTRI rapida in 1-click, 3) Connettore Sistema Tessera Sanitaria (730).',
    details: [
      'Frase commerciale: «Dottore, il bando le finanzia il 50% per avere una segretaria vocale AI che prende appuntamenti durante le visite e le visite strumentali, più il gestionale che invia le spese al Sistema TS e sbriga il RENTRI senza fermare le visite.»',
      'Aree nel configuratore: Centralino Virtuale VoIP & Voice AI + Gestionale Cloud ERP + Cybersecurity.'
    ]
  },
  {
    id: 'settore_legale',
    category: 'settori',
    icon: 'Scale',
    badge: 'Settore Legale',
    question: 'Cosa proporre e come parlarne a uno Studio Legale o Commercialista?',
    answer: 'Puntare su: 1) Fascicoli clienti e scadenze udienze sincronizzati, 2) Knowledge base per trovare sentenze/atti, 3) Cybersecurity blindata per i dati sensibili.',
    details: [
      'Frase commerciale: «Avvocato, il voucher copre la metà della spesa per digitalizzare tutti i fascicoli, gestire le scadenze e avere una ricerca documentale AI riservata per lo studio, con backup certificati GDPR.»',
      'Aree nel configuratore: Knowledge Base RAG + Gestionale Cloud + Cybersecurity.'
    ]
  },
  {
    id: 'settore_benessere',
    category: 'settori',
    icon: 'Scissors',
    badge: 'Settore Benessere',
    question: 'Cosa proporre a Saloni, Parrucchieri, Centri Estetici e SPA?',
    answer: 'Puntare su: 1) Prenotazioni 24/7 su WhatsApp/Voce mentre si lavora coi clienti, 2) Promemoria anti no-show, 3) Scheda trattamenti e storico clienti.',
    details: [
      'Frase commerciale: «Mentre hai le mani impegnate con un cliente, l\'Agente Vocale AI risponde al telefono, prende l\'appuntamento e manda la conferma WhatsApp, così non perdi nessun incasso.»',
      'Aree nel configuratore: Centralino VoIP & Voice AI + CRM & Automazione Workflow + Portale Web Prenotazioni.'
    ]
  },
  {
    id: 'settore_pmi_retail',
    category: 'settori',
    icon: 'ShoppingBag',
    badge: 'Commercio & PMI',
    question: 'Cosa proporre a Negozi, Commercio, Officine e PMI?',
    answer: 'Puntare su: 1) Gestionale magazzino e ordini sincronizzato, 2) CRM per fidelizzazione clienti, 3) Assistente automatico richieste preventivo.',
    details: [
      'Frase commerciale: «Digitalizziamo ordini, fatture e magazzino in un unico sistema cloud, collegato al sito e ai messaggi ai clienti per aumentare le vendite ripetute.»',
      'Aree nel configuratore: Gestionale Cloud ERP + CRM Workflow + Cybersecurity.'
    ]
  }
];

export const MIMIT_DATES = [
  { date: '20 Ottobre 2026', label: 'Precompilazione e firma digitale' },
  { date: '10 Novembre 2026', label: 'Click-day · invio formale' },
  { date: '20 Gennaio 2027', label: 'Chiusura prevista sportello' }
];

export const MIMIT_PROCEDURE_NOTE = 'Procedura cronologica a sportello: conta l\'ordine di invio delle domande.';

export const ECONOMIC_NOTICE =
  'Proposta economica riservata: L\'offerta economica ufficiale e l\'assegnazione dei codici di spesa ammissibili MIMIT (contributo a fondo perduto 50% fino a 20.000€) verranno elaborate dalla Presidenza e dall\'Ufficio Amministrazione di Conflavoro Servizi S.r.l.';

export const INTERNAL_USE_NOTICE =
  'Documento a uso interno per la Presidenza Roberto Capobianco e l\'Ufficio Gare/Amministrazione per la quantificazione dell\'offerta con codici identificativi fornitore abilitato MIMIT';
