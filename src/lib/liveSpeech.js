// ─────────────────────────────────────────────────────────────
// RECONOSCIMENTO VOCALE LIVE GRATUITO (CHROME / EDGE / ANDROID)
// Web Speech API nativa (0€)
// ─────────────────────────────────────────────────────────────

export function liveSpeechSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function startLiveSpeech(onFinal, onInterim) {
  const SpeechCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechCtor) return () => {};

  let active = true;
  let recognition;

  try {
    recognition = new SpeechCtor();
  } catch (err) {
    console.error('Inizializzazione SpeechRecognition fallita:', err);
    return () => {};
  }

  recognition.lang = 'it-IT';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    try {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        const transcript = item[0]?.transcript?.trim();
        if (!transcript) continue;

        if (item.isFinal) {
          onFinal(transcript);
        } else {
          interim += `${transcript} `;
        }
      }
      onInterim(interim.trim());
    } catch (err) {
      console.warn('Errore parsing live speech:', err);
    }
  };

  recognition.onerror = (event) => {
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      active = false;
    }
  };

  recognition.onend = () => {
    if (active) {
      try {
        recognition.start();
      } catch {
        // Già in esecuzione
      }
    }
  };

  try {
    recognition.start();
  } catch (err) {
    console.warn('Avvio SpeechRecognition non riuscito:', err);
  }

  return () => {
    active = false;
    try {
      recognition.stop();
    } catch {
      // Ignora errori di arresto
    }
  };
}
