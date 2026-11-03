// Synthetische Demo-Klänge für die Beatbox-Grundsounds (Web Audio, keine Samples nötig)
let ctx: AudioContext | null = null;
let noiseBuf: AudioBuffer | null = null;

export function ac(): AudioContext {
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function noise(c: AudioContext) {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = c.createBufferSource(); s.buffer = noiseBuf; return s;
}

function env(c: AudioContext, t: number, peak: number, decay: number, attack = 0.002) {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  return g;
}

function noiseHit(c: AudioContext, out: AudioNode, t: number, type: BiquadFilterType, f: number, q: number, peak: number, decay: number, attack = 0.002) {
  const n = noise(c), fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
  const g = env(c, t, peak, decay, attack);
  n.connect(fl).connect(g).connect(out); n.start(t); n.stop(t + attack + decay + 0.05);
}

function tone(c: AudioContext, out: AudioNode, t: number, type: OscillatorType, f0: number, f1: number, sweep: number, peak: number, decay: number) {
  const o = c.createOscillator(); o.type = type;
  o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + sweep);
  const g = env(c, t, peak, decay); o.connect(g).connect(out); o.start(t); o.stop(t + decay + 0.05);
}

export type SoundId = 'B' | 't' | 'ts' | 'Pf' | 'K' | 'k' | 'Lr' | 'm';

/** Spielt einen Beatbox-Klang zum Zeitpunkt `at` (AudioContext-Zeit). vol 0..1 */
export function playSound(id: SoundId, at?: number, vol = 1) {
  const c = ac(), t = at ?? c.currentTime + 0.01;
  const out = c.createGain(); out.gain.value = vol; out.connect(c.destination);
  switch (id) {
    case 'B': // Kick: Lippen-Plosiv – tiefer Sinus-Sweep + kurzer Luftstoß
      tone(c, out, t, 'sine', 160, 45, 0.12, 0.9, 0.32);
      noiseHit(c, out, t, 'lowpass', 900, 0.7, 0.25, 0.03);
      break;
    case 't': // geschlossene Hi-Hat
      noiseHit(c, out, t, 'highpass', 6500, 0.8, 0.35, 0.045);
      break;
    case 'ts': // offene Hi-Hat
      noiseHit(c, out, t, 'highpass', 5500, 0.8, 0.3, 0.26, 0.004);
      break;
    case 'Pf': // Lippen-Snare: Plosiv + Reibegeräusch
      tone(c, out, t, 'triangle', 260, 180, 0.04, 0.35, 0.09);
      noiseHit(c, out, t, 'bandpass', 2200, 0.8, 0.6, 0.17, 0.003);
      break;
    case 'K': // K-Snare (ausgeatmet), trocken und kurz
      noiseHit(c, out, t, 'bandpass', 3200, 1.6, 0.7, 0.07);
      tone(c, out, t, 'square', 900, 500, 0.02, 0.05, 0.02);
      break;
    case 'k': // Inward K: eingeatmet, schärfer, etwas länger
      noiseHit(c, out, t, 'bandpass', 4200, 2.2, 0.6, 0.11, 0.008);
      noiseHit(c, out, t, 'highpass', 7000, 0.7, 0.15, 0.06);
      break;
    case 'Lr': { // Lip Roll / Lippenbass: tiefer Ton mit schnellem Flattern
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 55;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 400;
      const trem = c.createGain(); trem.gain.value = 0.5;
      const lfo = c.createOscillator(); lfo.frequency.value = 28; const lg = c.createGain(); lg.gain.value = 0.5;
      lfo.connect(lg).connect(trem.gain);
      const g = env(c, t, 0.7, 0.35, 0.02);
      o.connect(lp).connect(trem).connect(g).connect(out);
      o.start(t); lfo.start(t); o.stop(t + 0.42); lfo.stop(t + 0.42);
      break;
    }
    case 'm': // gesummter Bass (A-cappella-Bass „dm“/„bm“)
      tone(c, out, t, 'triangle', 98, 98, 0.01, 0.5, 0.3);
      tone(c, out, t, 'sine', 49, 49, 0.01, 0.4, 0.3);
      break;
  }
}

export function playClick(at: number, accent: boolean, vol = 1) {
  const c = ac(), o = c.createOscillator(), g = c.createGain();
  o.frequency.value = accent ? 1760 : 1180;
  g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime((accent ? 0.28 : 0.16) * vol, at + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
  o.connect(g).connect(c.destination); o.start(at); o.stop(at + 0.06);
}
