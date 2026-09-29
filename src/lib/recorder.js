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

  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
  const chunks = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  mediaRecorder.start(1000);

  return {
    level: () => {
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      return sum / data.length / 255;
    },
    stop: () =>
      new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          ctx.close();
          const blob = new Blob(chunks, { type: 'audio/webm' });
          resolve(blob);
        };
        mediaRecorder.stop();
      }),
    cancel: () => {
      stream.getTracks().forEach((t) => t.stop());
      ctx.close();
    }
  };
}
