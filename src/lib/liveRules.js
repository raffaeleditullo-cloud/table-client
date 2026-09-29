// ─────────────────────────────────────────────────────────────
// REGOLE DI TRIGGER ISTANTANEO COPILOTA LIVE (0 MILLISECONDI)
// Voucher MIMIT Cloud & Cybersecurity 2026 — Conflavoro AI
// ─────────────────────────────────────────────────────────────

export const LIVE_RULES = [
  {
    id: 'passaggi_procedura',
    tone: 'blue',
    badge: '🚀 I 4 PASSAGGI DEL BANDO',
    title: 'Il cliente chiede cosa fare o come funziona',
    hint: 'Spiega i 4 passaggi (l\'invio compete al cliente/commercialista):',
    say: "1) Entro il 15 Ottobre le inviamo il progetto e il preventivo formale con il Codice Fornitore MIMIT Conflavoro; 2) Dal 20 Ottobre accede su Invitalia con SPID/CIE, carica il preventivo e ottiene il Codice Domanda; 3) Il 10 Novembre alle ore 12:00 inoltra Lei o il Suo commercialista la domanda al Click-Day; 4) A collaudo ultimato riceve il bonifico del 50% a fondo perduto dal Ministero.",
    match: /\b(procedur\w*|passagg\w*|cosa devo fare|come funziona|codice fornitore|fornitore abilitato|20 ottobre|10 novembre|invitalia|come si fa|passi|fasi)\b/i
  },
  {
    id: 'chi_invia',
    tone: 'purple',
    badge: '🔒 CHI INVIA LA DOMANDA?',
    title: 'Chiede se inviamo noi la domanda su Invitalia',
    hint: 'L\'invio formale è a carico del cliente/commercialista.',
    say: "L'invio formale su Invitalia richiede il Suo SPID aziendale e compete a Lei o al Suo commercialista. Noi siamo il fornitore abilitato: Le forniamo il progetto tecnico, il preventivo ufficiale e il Codice MIMIT da allegare.",
    match: /\b(la inviate voi|inviate voi|fate voi l'invio|ci pensate voi all'invio|fate voi la domanda|chi (invia|presenta|fa) la domanda|caricate voi|devo farlo io)\b/i
  },
  {
    id: 'prezzi',
    tone: 'yellow',
    badge: '💰 REGOLA PREZZI',
    title: 'Il cliente chiede prezzi o quanto costa',
    hint: 'Non comunicare cifre al telefono.',
    say: 'La quantificazione ufficiale la elabora la nostra Presidenza con i codici ministeriali per garantire il 50% a fondo perduto fino a 20.000 €.',
    match: /\b(prezz\w*|cost\w*|quanto (viene|costa|si paga|pago|spendo)|tariff\w*|preventiv\w*|cifra)\b/i
  },
  {
    id: 'hardware',
    tone: 'orange',
    badge: '⚠️ ATTENZIONE HARDWARE',
    title: 'Si parla di acquisto hardware / fotocamere / PC',
    hint: 'Il voucher MIMIT non copre hardware generico.',
    say: "Il bando copre al 50% il software, l'AI e i connettori; l'hardware nuovo lo scarica al 100% fiscalmente lo studio come spesa aziendale.",
    match: /\b(hardware|pc|computer|portatil\w*|notebook|fotocamer\w*|telecamer\w*|macchinar\w*|stampant\w*|server fisic\w*|tablet|motor\w*)\b/i
  },
  {
    id: 'cumulo',
    tone: 'blue',
    badge: '💡 CUMULABILITÀ BANDO',
    title: 'Ha già fatto bandi Camera di Commercio / altri aiuti',
    hint: 'I bandi sono pienamente cumulabili.',
    say: 'Ottimo! Il MIMIT è cumulabile fino a 300.000 € nel triennio (De Minimis) e copre questo nuovo progetto senza sovrapposizioni.',
    match: /\b(camera di commercio|altr[io] (bando|bandi|voucher|contribut\w*)|già (fatto|preso|avuto) (un |il )?(bando|voucher|contribut\w*)|voucher digitali|de minimis)\b/i
  },
  {
    id: 'rimborso',
    tone: 'green',
    badge: '💶 MECCANISMO RIMBORSO',
    title: 'Chiede se i soldi arrivano subito o se c\'è sconto',
    hint: 'Non è sconto in fattura.',
    say: 'Funziona a rimborso: sostiene la spesa con bonifico e il Ministero rimborsa il 50% a fondo perduto direttamente sul conto aziendale.',
    match: /\b(sconto in fattura|sconto|arrivano subito|subito i soldi|anticip\w*|quando (arrivano|pagano|rimborsano)|soldi)\b/i
  },
  {
    id: 'requisiti',
    tone: 'purple',
    badge: '📋 REQUISITI MINISTERIALI',
    title: 'Requisiti / DURC / Connessione 30 Mbps',
    hint: 'Ricordagli i requisiti tecnici di base.',
    say: 'Servono almeno 30 Mbps di linea fissa, DURC regolare, SPID/CIE e Firma Digitale (.p7m) per la domanda del 20 Ottobre.',
    match: /\b(durc|requisit\w*|velocità|internet|connession\w*|fibra|mega|mbps|spid|firma digitale)\b/i
  }
];

export const TONE_STYLES = {
  yellow: {
    border: 'border-amber-400 bg-amber-500/10 text-amber-950',
    badge: 'bg-amber-500 text-black',
    accent: '#f59e0b'
  },
  orange: {
    border: 'border-orange-500 bg-orange-500/10 text-orange-950',
    badge: 'bg-orange-600 text-white',
    accent: '#ea580c'
  },
  blue: {
    border: 'border-blue-500 bg-blue-500/10 text-blue-950',
    badge: 'bg-blue-600 text-white',
    accent: '#2563eb'
  },
  green: {
    border: 'border-emerald-500 bg-emerald-500/10 text-emerald-950',
    badge: 'bg-emerald-600 text-white',
    accent: '#059669'
  },
  purple: {
    border: 'border-purple-500 bg-purple-500/10 text-purple-950',
    badge: 'bg-purple-600 text-white',
    accent: '#9333ea'
  }
};
