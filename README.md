# CONFLAVORO TABLE CLIENT STUDIO · Scheda Tecnica di Fabbisogno

Dashboard tecnica operativa per la gestione dei lead del bando **Voucher MIMIT Cloud e Cybersecurity 2026**.
L'operatore la usa **al telefono durante la chiamata** per compilare la Scheda Tecnica di Fabbisogno e generare il PDF da inviare alla Presidenza.

> **Nessun prezzo.** Offerta economica e codici ministeriali sono decisi esclusivamente dalla Presidenza e dall'Ufficio Amministrazione di Conflavoro Servizi S.r.l.

## Percorso guidato

| Fase | Passi |
|---|---|
| 1 · Azienda | Dati azienda & referente (ragione sociale, P.IVA, referente, ruolo, email, telefono) · Settore |
| 2 · Fabbisogno | Soluzioni MIMIT (selezione multipla) · Funzioni per soluzione · Agente vocale* · Canali & sistemi |
| 3 · Miglioramento | Stato iniziale dell'azienda → Miglioramento sostanziale atteso |
| 4 · Look & Feel | Colore brand, stile interfaccia, font aziendale |
| 5 · Scheda | Riepilogo, note operative, generazione PDF |

\* solo se è selezionato "Centralino Virtuale VoIP & Agente Vocale AI": tipologia voce (maschile / femminile / entrambe), ruolo e compiti, istruzioni di prompting. Nessun audio o sintesi vocale.

## Uso rapido in chiamata
- **FAQ MIMIT** (pulsante in alto o tasto **F**): contributo, rimborso, date chiave, fornitore abilitato. **Esc** per chiudere.
- **Frecce ← →**: indietro / avanti (quando non si sta scrivendo).
- Campi di testo con voci **"Aggiungi con un clic"** per compilare velocemente.
- **Nuova scheda** azzera tutto per la chiamata successiva.

## Dove modificare i contenuti
- `src/data/catalog.js` — aree ammissibili, funzioni, miglioramenti suggeriti, settori.
- `src/data/configOptions.js` — canali, voci agente vocale, stato iniziale, colori e stili.
- `src/data/mimitFaq.js` — cheat-sheet, date del bando, diciture istituzionali.
- `src/utils/dossier.js` — struttura dati condivisa da riepilogo e PDF.
- `src/utils/pdfGenerator.js` — impaginazione del PDF.

## Avvio
```bash
npm run dev      # http://localhost:5173/
npm run build    # build di produzione
```
