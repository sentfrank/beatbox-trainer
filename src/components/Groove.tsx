import { useEffect, useMemo, useRef, useState } from 'react';
import { ac, playClick, playSound } from '../audio';
import { parseSteps, type Pattern } from '../patterns';
import { soundById } from '../sounds';
import { classify, getStream, micSupported, startOnsets, stopOnsets, type Onset } from '../mic';
import { store } from '../store';

export type Mode = 'demo' | 'along' | 'solo';
export const MODE_NAMES: Record<Mode, string> = { demo: 'Vormachen', along: 'Mitmachen', solo: 'Solo + Klick' };
export const starsFor = (s: number) => (s >= 85 ? 3 : s >= 70 ? 2 : s >= 50 ? 1 : 0);

type Exp = { n: number; idx: number; t: number; band: 'low' | 'mid' | 'high'; off?: number; cls?: string; done?: boolean };
type Res = 'ok' | 'off' | 'miss';
type Stats = { score: number; hits: number; total: number; mean: number; extra: number; cls: number };

export function Groove({ pattern, bpm: bpm0, mode: mode0, onBack }: { pattern: Pattern; bpm?: number; mode?: Mode; onBack: () => void }) {
  const steps = useMemo(() => parseSteps(pattern.steps), [pattern]);
  const [bpm, setBpm] = useState(bpm0 ?? pattern.bpm);
  const [mode, setMode] = useState<Mode>(mode0 ?? 'demo');
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(-1);
  const [count, setCount] = useState(0);
  const [mic, setMic] = useState(false);
  const [micErr, setMicErr] = useState('');
  const [res, setRes] = useState<Record<number, Res>>({});
  const [stats, setStats] = useState<Stats | null>(null);
  const [cfg, setCfg] = useState(store.get());
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [take, setTake] = useState('');
  const taps = useRef<number[]>([]);

  const r = useRef({ t0: 0, stepDur: 0, nextN: 0, timer: 0, raf: 0, exp: [] as Exp[], extra: 0 });

  const stepTime = (n: number) => {
    const { t0, stepDur } = r.current;
    return t0 + n * stepDur + (n % 2 === 1 ? (pattern.swing ?? 0) * stepDur : 0);
  };

  const computeStats = (now: number): Stats => {
    const win = r.current.stepDur * 0.5;
    const past = r.current.exp.filter(e => e.t < now - win);
    const hit = past.filter(e => e.off !== undefined);
    const score = past.length ? past.reduce((s, e) => s + (e.off === undefined ? 0 : Math.max(0, Math.min(1, 1 - (Math.abs(e.off) - 0.025) / 0.1))), 0) / past.length * 100 : 0;
    const mean = hit.length ? hit.reduce((s, e) => s + e.off!, 0) / hit.length : 0;
    const cls = hit.length ? hit.filter(e => e.cls === e.band).length / hit.length * 100 : 0;
    return { score: Math.round(score), hits: hit.length, total: past.length, mean: Math.round(mean * 1000), extra: r.current.extra, cls: Math.round(cls) };
  };

  const onOnset = (o: Onset) => {
    const R = r.current, t = o.t - store.get().latency / 1000;
    const win = Math.min(R.stepDur * 0.5, 0.15);
    let best: Exp | null = null;
    for (const e of R.exp) if (e.off === undefined && Math.abs(e.t - t) < win && (!best || Math.abs(e.t - t) < Math.abs(best.t - t))) best = e;
    if (!best) { if (t > R.t0 - 0.05) R.extra++; return; }
    best.off = t - best.t; best.cls = classify(o);
    const res: Res = Math.abs(best.off) <= 0.045 ? 'ok' : 'off';
    setRes(p => ({ ...p, [best!.idx]: res }));
  };

  const stop = () => {
    const R = r.current;
    clearInterval(R.timer); cancelAnimationFrame(R.raf); stopOnsets();
    setPlaying(false); setCur(-1); setCount(0);
    if (mic && R.exp.length) {
      const s = computeStats(ac().currentTime + 10); setStats(s);
      if (s.total >= 8) setCfg(store.update(d => {
        const b = d.best[pattern.id];
        if (!b || s.score > b.score || (s.score === b.score && bpm > b.bpm)) d.best[pattern.id] = { score: s.score, bpm };
      }));
    }
  };

  const start = async () => {
    setMicErr(''); setRes({}); setStats(null);
    const c = ac(), R = r.current;
    if (mic) {
      try { await startOnsets(onOnset, cfg.sens); }
      catch (e: any) { setMicErr('Mikrofon nicht verfügbar: ' + (e?.message ?? e)); setMic(false); return; }
    }
    R.stepDur = 60 / bpm / pattern.sub; R.exp = []; R.extra = 0; R.nextN = 0;
    const beat = 60 / bpm;
    const now = c.currentTime + 0.15;
    for (let i = 0; i < 4; i++) playClick(now + i * beat, i === 0);
    R.t0 = now + 4 * beat;
    const vol = mode === 'demo' ? 0.9 : mode === 'along' ? 0.35 : 0;
    const clickVol = mode === 'demo' ? 0.5 : 1;
    const sched = () => {
      while (stepTime(R.nextN) < c.currentTime + 0.15) {
        const n = R.nextN, t = stepTime(n), idx = n % steps.length, s = steps[idx].sound;
        if (n % pattern.sub === 0) playClick(R.t0 + n * R.stepDur, n % (4 * pattern.sub) === 0, clickVol);
        if (s) {
          if (vol) playSound(s, t, vol);
          R.exp.push({ n, idx, t, band: soundById(s)?.band ?? 'mid' });
          if (R.exp.length > 400) R.exp.splice(0, 100);
        }
        R.nextN++;
      }
    };
    sched(); R.timer = window.setInterval(sched, 25);
    let lastLoop = -1;
    const draw = () => {
      const t = c.currentTime;
      if (t < R.t0) { setCount(4 - Math.floor((R.t0 - t) / beat)); }
      else {
        setCount(0);
        const n = Math.floor((t - R.t0) / R.stepDur), loop = Math.floor(n / steps.length);
        setCur(n % steps.length);
        if (mic) {
          if (loop !== lastLoop) { lastLoop = loop; setRes({}); }
          const win = Math.min(R.stepDur * 0.5, 0.15);
          for (const e of R.exp) if (!e.done && e.off === undefined && e.t < t - win) { e.done = true; const i = e.idx; setRes(p => ({ ...p, [i]: 'miss' })); }
          setStats(computeStats(t));
        }
      }
      R.raf = requestAnimationFrame(draw);
    };
    R.raf = requestAnimationFrame(draw);
    setPlaying(true);
  };

  useEffect(() => () => { clearInterval(r.current.timer); cancelAnimationFrame(r.current.raf); stopOnsets(); rec?.state === 'recording' && rec.stop(); }, []);

  const restartWith = (fn: () => void) => { if (playing) stop(); fn(); };

  const tap = () => {
    const now = performance.now(); taps.current = [...taps.current.filter(x => now - x < 2500), now];
    const t = taps.current; if (t.length >= 3) { const d = (t[t.length - 1] - t[0]) / (t.length - 1); restartWith(() => setBpm(Math.round(Math.min(160, Math.max(40, 60000 / d))))); }
  };

  const toggleRec = async () => {
    if (rec) { rec.stop(); return; }
    try {
      const s = await getStream(); const chunks: Blob[] = []; const m = new MediaRecorder(s);
      m.ondataavailable = e => chunks.push(e.data);
      m.onstop = () => { setTake(URL.createObjectURL(new Blob(chunks, { type: m.mimeType }))); setRec(null); };
      m.start(); setRec(m); setTake('');
    } catch (e: any) { setMicErr('Aufnahme nicht möglich: ' + (e?.message ?? e)); }
  };

  const calibrate = () => { if (stats && stats.hits >= 6) setCfg(store.update(d => { d.latency = Math.round(d.latency + stats.mean); })); };

  const best = cfg.best[pattern.id];
  const perBar = 4 * pattern.sub;

  return (
    <section className="practice">
      <div className="row between">
        <button className="ghost" onClick={() => { stop(); onBack(); }}>← Zurück</button>
        {best && <span className="muted small">Bestwert: {'★'.repeat(starsFor(best.score))}{'☆'.repeat(3 - starsFor(best.score))} {best.score} % bei {best.bpm} bpm</span>}
      </div>
      <h2>{pattern.title}</h2>
      <p className="muted">{pattern.hint}</p>

      <div className="gv">
      <div className="gv-main">
      <div className="grid" style={{ ['--cols' as any]: Math.min(perBar, 8) }}>
        {steps.map((s, i) => (
          <div key={i} className={['cell', i % pattern.sub === 0 ? 'beat' : '', i === cur ? 'now' : '', res[i] ?? '', s.sound ? '' : 'rest', i % perBar === 0 && i ? 'newbar' : ''].join(' ')}>
            <span className="tok">{s.sound ?? '·'}</span>
            {i % pattern.sub === 0 && <span className="cnt">{(i % perBar) / pattern.sub + 1}</span>}
          </div>
        ))}
      </div>
      <div className="countin">{count > 0 ? `Einzähler: ${count}` : playing ? '' : ' '}</div>
      </div>
      <div className="gv-side">

      <div className="controls">
        <div className="seg small">
          {(Object.keys(MODE_NAMES) as Mode[]).map(m => <button key={m} className={mode === m ? 'active' : ''} onClick={() => restartWith(() => setMode(m))}>{MODE_NAMES[m]}</button>)}
        </div>
        <label>Tempo <strong>{bpm}</strong> bpm
          <input type="range" min={40} max={160} value={bpm} onChange={e => restartWith(() => setBpm(+e.target.value))} />
        </label>
        <button className="ghost mini" onClick={tap}>Tap</button>
      </div>

      <div className="row">
        <button className="big" onClick={playing ? stop : start}>{playing ? '■ Stopp' : '▶ Start'}</button>
        {micSupported() && <label className="check"><input type="checkbox" checked={mic} disabled={playing} onChange={e => setMic(e.target.checked)} /> Mikro-Analyse (Timing)</label>}
        {micSupported() && <button className="ghost" onClick={toggleRec}>{rec ? '● Aufnahme stoppen' : '🎙 Aufnehmen'}</button>}
      </div>
      {mic && <p className="muted small">Tipp: Kopfhörer benutzen, damit das Mikro nur dich hört und nicht den Klick.</p>}
      {micErr && <p className="warn">{micErr}</p>}
      {take && <p><audio controls src={take} /> <a href={take} download={`beatbox-${pattern.id}.webm`}>speichern</a></p>}

      {stats && stats.total > 0 && (
        <div className="result">
          <div className="stars">{[0, 1, 2].map(i => <span key={i} className={i < starsFor(stats.score) ? 'on' : ''}>★</span>)}</div>
          <strong>{stats.score} %</strong>
          <p className="muted">{stats.hits} von {stats.total} Schlägen getroffen
            {stats.hits >= 4 && <> · im Schnitt {Math.abs(stats.mean)} ms {stats.mean > 8 ? 'zu spät (schleppt)' : stats.mean < -8 ? 'zu früh (eilt)' : '– genau im Takt'}</>}
            {stats.extra > 2 && <> · {stats.extra} Extra-Geräusche</>}
            {stats.hits >= 4 && <> · Klanglage passt bei {stats.cls} % <span className="small">(experimentell)</span></>}</p>
          {!playing && stats.hits >= 6 && pattern.id === 'kick4' && (
            <button className="ghost mini" onClick={calibrate}>Als Latenz übernehmen ({cfg.latency + stats.mean} ms)</button>
          )}
        </div>
      )}

      <details className="settings sub">
        <summary>Einstellungen Mikro</summary>
        <label className="block">Empfindlichkeit
          <input type="range" min={2} max={10} step={0.5} value={11 - cfg.sens} onChange={e => setCfg(store.update(d => { d.sens = 11 - +e.target.value; }))} />
        </label>
        <label className="block">Latenz-Ausgleich <strong>{cfg.latency} ms</strong>
          <input type="range" min={-50} max={250} value={cfg.latency} onChange={e => setCfg(store.update(d => { d.latency = +e.target.value; }))} />
        </label>
        <p className="muted small">Kalibrieren: Öffne „Kick auf jedem Schlag“, Modus „Solo + Klick“, Mikro-Analyse an, 16 Kicks exakt auf den Klick, Stopp → „Als Latenz übernehmen“.</p>
      </details>
      </div>
      </div>
    </section>
  );
}
