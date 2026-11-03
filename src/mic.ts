import { ac } from './audio';

// Onset-Erkennung im AudioWorklet: meldet Einsätze mit Zeitstempel und grober Frequenzlage.
const WORKLET = `
class Onset extends AudioWorkletProcessor {
  constructor(){ super(); this.avg=1e-5; this.last=-1; this.lp=0; this.lp2=0; this.sens=4; this.port.onmessage=e=>{this.sens=e.data.sens??this.sens}; }
  process(inputs){
    const ch = inputs[0] && inputs[0][0]; if(!ch) return true;
    let e=0, el=0, eh=0; const a1=0.033, a2=0.43; // ~250 Hz und ~4 kHz bei 48 kHz
    for(let i=0;i<ch.length;i++){ const x=ch[i]; this.lp+=a1*(x-this.lp); this.lp2+=a2*(x-this.lp2); const h=x-this.lp2;
      e+=x*x; el+=this.lp*this.lp; eh+=h*h; }
    e/=ch.length; el/=ch.length; eh/=ch.length;
    const t=currentTime;
    if(e>this.avg*this.sens && e>2e-4 && t-this.last>0.07){ this.last=t; this.port.postMessage({t, rms:Math.sqrt(e), low:el/(e+1e-12), high:eh/(e+1e-12)}); }
    this.avg = this.avg*0.97 + e*0.03;
    return true;
  }
}
registerProcessor('onset', Onset);`;

let stream: MediaStream | null = null;
let node: AudioWorkletNode | null = null;
let loaded = false;
export type Onset = { t: number; rms: number; low: number; high: number };
let listener: ((o: Onset) => void) | null = null;

export async function getStream() {
  stream ??= await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false } });
  return stream;
}

export async function startOnsets(cb: (o: Onset) => void, sens = 4) {
  const c = ac();
  if (!loaded) {
    const url = URL.createObjectURL(new Blob([WORKLET], { type: 'application/javascript' }));
    await c.audioWorklet.addModule(url); loaded = true;
  }
  const s = await getStream();
  if (!node) {
    node = new AudioWorkletNode(c, 'onset');
    c.createMediaStreamSource(s).connect(node);
    node.port.onmessage = e => listener?.(e.data as Onset);
  }
  node.port.postMessage({ sens });
  listener = cb;
}
export function stopOnsets() { listener = null; }

export const micSupported = () => !!navigator.mediaDevices?.getUserMedia && typeof AudioWorkletNode !== 'undefined';

export function classify(o: Onset): 'low' | 'mid' | 'high' {
  if (o.low > 0.45) return 'low';
  if (o.high > 0.35) return 'high';
  return 'mid';
}
