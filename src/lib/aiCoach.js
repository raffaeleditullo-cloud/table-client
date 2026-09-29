// ─────────────────────────────────────────────────────────────
// SERVIZIO AI COACH & REPORT AUTOMATICO (OPENROUTER FREE / LITE)
// ─────────────────────────────────────────────────────────────

// Le richieste passano dal proxy server-side (/api/chat): la chiave OpenRouter
// non è mai inclusa nel bundle del browser
const CHAT_ENDPOINT = '/api/chat';
const MODEL = 'google/gemini-2.5-flash-lite';

async function requestJson(systemPrompt, userContent) {
  const res = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ]
    })
  });
  if (!res.ok) throw new Error(`AI HTTP ${res.status}`);

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content ?? '';
  let clean = raw.trim();
  if (clean.startsWith('```json')) clean = clean.slice(7);
  if (clean.startsWith('```')) clean = clean.slice(3);
  if (clean.endsWith('```')) clean = clean.slice(0, -3);
  clean = clean.trim();
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  const json = firstBrace !== -1 && lastBrace !== -1 ? clean.slice(firstBrace, lastBrace + 1) : clean;
  return JSON.parse(json);
}

const MIMIT_KNOWLEDGE = `
BANDO VOUCHER CLOUD E CYBERSECURITY MIMIT 2026:
- Ente: Ministero delle Imprese e del Made in Italy (Invitalia). Dotazione: 150 Milioni di Euro (di cui 71M riservati al Mezzogiorno).
- Contributo: 50% a fondo perduto fino a 20.000 € (spesa minima 4.000 € per 2.000 €; spesa massima 40.000 € per 20.000 €). Meccanismo a rimborso.
- Fornitore: Conflavoro Servizi S.r.l. è fornitore formalmente abilitato dal MIMIT.
- Scadenze: 20 Ottobre ore 12:00 Precompilazione e Firma; 10 Novembre ore 12:00 Click-Day Invio prioritario in ordine cronologico; 20 Gennaio chiusura.
- Requisiti: PMI e Liberi Professionisti con P.IVA attiva in Italia, connettività fissa da almeno 30 Mbps, DURC regolare, SPID/CIE, Firma Digitale, capienza De Minimis 300.000 € in 3 anni.
- Spese Ammissibili: Cloud SaaS (ERP, CRM, AI integrata, E-commerce, Workflow), Cybersecurity e Backup UE, Servizi tecnici max 30%.
- Esclusioni: NO PC/fotocamere/hardware generico, NO semplici rinnovi licenze, NO formazione teorica.
`;

const COACH_PROMPT = `Sei il COPILOTA LIVE del consulente tecnico (Raffaele) durante una telefonata in corso con un cliente per il Voucher Cloud & Cybersecurity MIMIT.
Ricevi la trascrizione parziale e la checklist attuale.
Rispondi SOLO con JSON valido, senza markdown, in italiano:
{"ask":["domanda breve e spontanea da fare ORA al cliente", "..."],"propose":["proposta di ampliamento progetto coerente col bando, con il beneficio per il cliente"],"checklist":[{"item":"punto da chiarire","status":"ok"|"todo"|"na","note":"cosa è emerso, breve"}]}
Regole:
- "ask": massimo 2 domande mirate e veloci da leggere.
- "propose": massimo 2 soluzioni ammissibili MIMIT pertinenti al settore.
- "checklist": 6-10 punti chiave (forma giuridica, settore/attività, sede, PEC, firma digitale, SPID, DURC, de minimis, esigenze, budget indicativo, tempistiche).
- Frasi concise e chiare per lettura immediata.`;

export async function fetchLiveCoach(transcriptText, currentChecklist = []) {
  if (!transcriptText || transcriptText.trim().length < 25) return null;

  try {
    return await requestJson(
      `${COACH_PROMPT}\n\n${MIMIT_KNOWLEDGE}`,
      `CHECKLIST ATTUALE:\n${JSON.stringify(currentChecklist)}\n\nTRASCRIZIONE LIVE:\n${transcriptText.slice(-5000)}`
    );
  } catch (err) {
    console.warn('Live coach polling error:', err);
    return null;
  }
}

export async function fetchPostCallAnalysis(transcriptText, checklistNotes = '') {
  const PROMPT = `Sei l'analista tecnico senior di Conflavoro AI. Analizza la trascrizione della chiamata con il cliente per il Voucher MIMIT.
Devi estrarre sia la configurazione tecnica per l'applicativo TABLE CLIENT sia il report strutturato per il Manager (Rocco Di Tolla).

Rispondi SOLO con un JSON valido con questa esatta struttura:
{
  "clientInfo": {
    "company": "Ragione sociale rilevata o Nome Attività",
    "vat": "Partita IVA se menzionata (altrimenti stringa vuota o 'In acquisizione')",
    "name": "Nome e Cognome Referente",
    "role": "Ruolo (es. Titolare, Medico, Amministratore)",
    "email": "Email se menzionata",
    "phone": "Telefono se menzionato"
  },
  "sectorId": "uno tra: sanita, legal, benessere, hospitality, retail, real_estate, automotive, manufacturing, finance, b2b, education, startup, other",
  "solutionIds": ["array con gli ID tra: gestionale, crm, web, voice, rag, cyber"],
  "modules": {
    "gestionale": ["array tra: fatturazione, magazzino, commesse, hr, sito_integrato, portale_clienti"],
    "crm": ["array tra: contatti, automazioni, preventivi, integrazione_wa"],
    "web": ["array tra: corporate, portale_clienti, ecommerce, booking"],
    "voice": ["array tra: appointments, support, routing, tech_support"],
    "rag": ["array tra: archivio, permessi, assistente_interno, dati_ue"],
    "cyber": ["array tra: firewall, edr, antivirus, backup"]
  },
  "voice": {
    "gender": "male" | "female" | "both",
    "roles": ["appointments", "support", "routing", "tech_support"],
    "prompt": "Sintesi istruzioni personalizzate per assistente vocale AI se richiesto"
  },
  "channelIds": ["array tra: whatsapp, voip, web_chat, email, telegram, calendar, erp_existing, crm_existing"],
  "currentState": "Sintesi chiara dello stato iniziale e delle criticità attuali riscontrate",
  "improvement": "Sintesi dell'obiettivo di trasformazione digitale e miglioramento atteso",
  "operatorNotes": "Note interne per la presidenza e Rocco Di Tolla",
  "reportMarkdown": "Report completo e formale in Markdown (Sintesi, Profilo, Requisiti, Progetto Ammissibile MIMIT, Scheda Rocco Di Tolla con Inclusi/Esclusi, Prossimi Passi 20 Ottobre e 10 Novembre)"
}`;

  // Senza trascrizione l'AI inventerebbe tutto: si passa subito al fallback vuoto
  if (!transcriptText || !transcriptText.trim()) {
    return fallbackExtraction('', checklistNotes, 'Nessuna trascrizione disponibile: il riconoscimento vocale non ha rilevato parlato.');
  }

  try {
    const parsed = await requestJson(
      `${PROMPT}\n\n${MIMIT_KNOWLEDGE}`,
      checklistNotes
        ? `${transcriptText}\n\n[NOTE RACCOLTE DURANTE LA CHIAMATA]:\n${checklistNotes}`
        : transcriptText
    );

    if (!parsed.reportMarkdown) {
      parsed.reportMarkdown = generateFallbackMarkdown(parsed, transcriptText);
    }

    return parsed;
  } catch (err) {
    console.error('Post call analysis failed, using heuristic fallback:', err);
    return fallbackExtraction(transcriptText, checklistNotes, 'Analisi AI non disponibile (servizio non raggiungibile o risposta non valida).');
  }
}

// Fallback se l'AI non risponde: NON inventa dati. Anagrafica, moduli, voce e
// canali restano vuoti; settore e soluzioni sono solo suggerimenti da parole
// chiave della trascrizione. `isFallback` permette alla UI di avvisare l'operatore.
export function fallbackExtraction(transcriptText, checklistNotes = '', reason = 'Analisi AI non disponibile.') {
  const text = (transcriptText || '').toLowerCase();

  // Detect sector (nessun default: se non emerge resta vuoto)
  let sectorId = null;
  if (/medico|dott|pazient|clinica|sanit|eeg|emg|visita|sanitario/.test(text)) sectorId = 'sanita';
  else if (/avvocat|studio legale|giurid|tribunal|commercialist/.test(text)) sectorId = 'legal';
  else if (/parrucchier|salone|capell|estetic|bellezza|trattament|barbier|spa/.test(text)) sectorId = 'benessere';
  else if (/ristor|pizz|tavol|prenotazion|food|bar/.test(text)) sectorId = 'hospitality';
  else if (/negozi|retail|prodott|vendit|e-commerce|shop/.test(text)) sectorId = 'retail';
  else if (/immobiliar|agenzia|case|appartament/.test(text)) sectorId = 'real_estate';
  else if (/auto|officin|meccanic|concessionar/.test(text)) sectorId = 'automotive';

  // Detect solutions (nessun default: "chiamata" compare in ogni telefonata, quindi non conta)
  const solutionIds = [];
  if (/gestionale|fattur|contabil|magazzin|pratich/.test(text)) solutionIds.push('gestionale');
  if (/crm|clienti|rubrica|lead|whatsapp/.test(text)) solutionIds.push('crm');
  if (/sito|web|portale|online/.test(text)) solutionIds.push('web');
  if (/voce|vocale|telefon|centralin/.test(text)) solutionIds.push('voice');
  if (/document|archiv|ricerca|rag|faldon/.test(text)) solutionIds.push('rag');
  if (/cyber|sicurezza|firewall|antivirus|backup|protezion/.test(text)) solutionIds.push('cyber');

  const hints = [
    sectorId ? `settore suggerito: ${sectorId}` : null,
    solutionIds.length ? `soluzioni suggerite: ${solutionIds.join(', ')}` : null
  ].filter(Boolean);

  return {
    isFallback: true,
    fallbackReason: reason,
    clientInfo: { company: '', vat: '', name: '', role: '', email: '', phone: '' },
    sectorId,
    solutionIds,
    modules: {},
    voice: { gender: null, roles: [], prompt: '' },
    channelIds: [],
    currentState: '',
    improvement: '',
    operatorNotes: checklistNotes || '',
    reportMarkdown: `## Sintesi Chiamata Bando MIMIT 2026 — DA COMPLETARE MANUALMENTE

> ${reason}
> I dati del cliente non sono stati estratti automaticamente: verificali e inseriscili nella scheda.

- **Suggerimenti da parole chiave (da verificare):** ${hints.length ? hints.join(' · ') : 'nessuno'}
${checklistNotes ? `\n### Note raccolte durante la chiamata\n${checklistNotes}\n` : ''}
### Trascrizione registrata
${transcriptText || '(nessuna trascrizione disponibile)'}`
  };
}

function generateFallbackMarkdown(parsed, transcriptText) {
  return `## Dossier Sintesi Chiamata Bando MIMIT 2026

### Profilo Cliente
- **Ragione Sociale:** ${parsed.clientInfo?.company || 'Non rilevata'}
- **Referente:** ${parsed.clientInfo?.name || 'Non rilevato'}${parsed.clientInfo?.role ? ` (${parsed.clientInfo.role})` : ''}
- **Settore:** ${parsed.sectorId || 'Non rilevato'}

### Soluzioni Ammissibili Identificate
${(parsed.solutionIds || []).map((s) => `- **${s.toUpperCase()}**: Moduli ammissibili configurati per il bando.`).join('\n')}

### Stato Iniziale & Obiettivi
- **Stato Iniziale:** ${parsed.currentState || 'Non rilevato'}
- **Miglioramento Atteso:** ${parsed.improvement || 'Non rilevato'}

### Scheda per Rocco Di Tolla (Manager)
- **Moduli Inclusi:** ${JSON.stringify(parsed.modules)}
- **Canali Attivi:** ${(parsed.channelIds || []).join(', ')}
- **Note Tecniche:** ${parsed.operatorNotes || 'Nessuna nota.'}

### Prossimi Passi
1. Entro 15 Ottobre: Emissione preventivo formale con Codice Fornitore MIMIT Conflavoro.
2. 20 Ottobre ore 12:00: Precompilazione Invitalia e firma digitale (.p7m).
3. 10 Novembre ore 12:00: Invio telematico prioritario Click-Day.`;
}
