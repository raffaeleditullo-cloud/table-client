// ─────────────────────────────────────────────────────────────
// REGISTRATORE AUDIO CON MISURATORE DI LIVELLO (WEB AUDIO API)
// ─────────────────────────────────────────────────────────────

export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  });

  let ctx;
  let analyser;
  let mediaRecorder;
  const chunks = [];

  // Se qualcosa fallisce dopo getUserMedia il microfono va rilasciato, o resta acceso
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const source = ctx.createMediaStreamSource(stream);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    // Safari non supporta audio/webm: in quel caso si usa il formato predefinito del browser
    const webm = typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported('audio/webm');
    mediaRecorder = new MediaRecorder(stream, webm ? { mimeType: 'audio/webm' } : undefined);
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };
    mediaRecorder.start(1000);
  } catch (err) {
    stream.getTracks().forEach((t) => t.stop());
    ctx?.close().catch(() => {});
    throw err;
  }

  const data = new Uint8Array(analyser.frequencyBinCount);
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    stream.getTracks().forEach((t) => t.stop());
    ctx.close().catch(() => {});
  };

  return {
    level: () => {
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      return sum / data.length / 255;
    },
    stop: () =>
      new Promise((resolve) => {
        const finish = () => {
          release();
          resolve(new Blob(chunks, { type: mediaRecorder.mimeType || 'audio/webm' }));
        };
        // Registratore già fermo (es. microfono scollegato): onstop non arriverebbe mai
        if (mediaRecorder.state === 'inactive') return finish();
        mediaRecorder.onstop = finish;
        try {
          mediaRecorder.stop();
        } catch {
          finish();
        }
      }),
    cancel: release
  };
}
