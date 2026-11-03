import { useState } from 'react';
import type React from 'react';
import { WEEKS, type Session, type Block } from './plan';
import { PATTERNS, CAT_NAMES, patternById, type Pattern, type Cat } from './patterns';
import { SOUNDS, soundById, type Sound } from './sounds';
import { Groove, MODE_NAMES, starsFor, type Mode } from './components/Groove';
import { playSound } from './audio';
import { store } from './store';
import { TOPICS } from './theory';

const FOLD_KEY = 'beatbox-trainer-fold';
function foldState(): Record<string, boolean> { try { return JSON.parse(localStorage.getItem(FOLD_KEY) || '{}'); } catch { return {}; } }
function Fold({ id, title, extra, defaultOpen = true, children }: { id: string; title: string; extra?: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(foldState()[id] ?? defaultOpen);
  const toggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const o = e.currentTarget.open; setOpen(o);
    try { localStorage.setItem(FOLD_KEY, JSON.stringify({ ...foldState(), [id]: o })); } catch {}
  };
  return (
    <details className="card fold" open={open} onToggle={toggle}>
      <summary><h2>{title}</h2>{extra}<span className="chev" aria-hidden>▾</span></summary>
      <div className="fold-body">{children}</div>
    </details>
  );
}

type View =
  | { kind: 'home' }
  | { kind: 'session'; s: Session }
  | { kind: 'groove'; p: Pattern; bpm?: number; mode?: Mode; back?: View }
  | { kind: 'sound'; s: Sound; back?: View }
  | { kind: 'wissen'; topic?: string };

function Wissen({ topic, onBack }: { topic?: string; onBack: () => void }) {
  return (
    <section className="card">
      <button className="ghost" onClick={onBack}>← Zurück</button>
      <h2>Wissen & Tipps</h2>
      <p className="muted">Theorie zu Klängen, Rhythmus und Atmung – und Praxistipps für Gruppe, Bühne und Üben.</p>
      {([['theorie', 'Theorie'], ['tipps', 'Tipps & Tricks']] as const).map(([k, t]) => (
        <div key={k}>
          <h3>{t}</h3>
          <div className="topics">
            {TOPICS.filter(x => x.kind === k).map(x => (
              <details key={x.id} id={'t-' + x.id} className="sub topic" open={topic === x.id}>
                <summary>{x.icon} {x.title}</summary>
                <p className="intro">{x.intro}</p>
                <dl>{x.points.map(([h, b]) => <div key={h}><dt>{h}</dt><dd>{b}</dd></div>)}</dl>
              </details>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function SoundView({ s, onBack, onDrill }: { s: Sound; onBack: () => void; onDrill: () => void }) {
  const [n, setN] = useState(0);
  return (
    <section className="card">
      <button className="ghost" onClick={onBack}>← Zurück</button>
      <div className="row between"><h2>{s.name}</h2><span className="sym">{s.symbol}</span></div>
      <p className="muted">{s.role}</p>
      <div className="row">
        <button className="big" onClick={() => { playSound(s.id); setN(n + 1); }}>🔊 Anhören</button>
        <button className="ghost" onClick={() => [0, 1, 2, 3].forEach(i => setTimeout(() => playSound(s.id), i * 600))}>4× im Abstand</button>
      </div>
      <p className="muted small">Der Demo-Klang ist synthetisch erzeugt – er zeigt Charakter und Länge. Dein Mund-Klang darf natürlicher klingen.</p>
      <div className="two">
        <details className="sub" open><summary>So geht’s</summary><ol className="steps">{s.how.map((h, i) => <li key={i}>{h}</li>)}</ol></details>
        <div>
          <details className="sub" open><summary>Typische Fehler</summary><ul className="steps">{s.mistakes.map((h, i) => <li key={i}>{h}</li>)}</ul></details>
          <details className="sub" open><summary>Übung</summary><p>{s.drill}</p><button onClick={onDrill}>▶ Im Groove-Trainer üben</button></details>
        </div>
      </div>
    </section>
  );
}

const drillFor: Record<string, string> = { B: 'kick4', t: 'hat8', ts: 'open', Pf: 'kick-snare', K: 'grund-k', k: 'inward', m: 'bass-groove', Lr: 'lipbass' };

export default function App() {
  const [view, setView] = useState<View>({ kind: 'home' });
  const [data, setData] = useState(store.get());
  const go = (v: View) => { setData(store.get()); setView(v); window.scrollTo(0, 0); };

  const all = WEEKS.flatMap(w => w.sessions);
  const doneCount = all.filter(x => data.done[x.id]).length;
  const next = all.find(x => !data.done[x.id]);
  const toggle = (id: string) => setData(store.update(d => { d.done[id] = !d.done[id]; }));

  const blockButtons = (b: Block, back: View) => {
    const p = b.pattern ? patternById(b.pattern) : undefined;
    const s = b.sound ? soundById(b.sound) : undefined;
    return <>
      {s && <button className="ghost" onClick={() => go({ kind: 'sound', s, back })}>🎓 {s.name}</button>}
      {p && <button onClick={() => go({ kind: 'groove', p, bpm: b.bpm, mode: b.mode, back })}>▶ {p.title} · {b.bpm ?? p.bpm} bpm · {MODE_NAMES[b.mode ?? 'demo']}</button>}
    </>;
  };

  return (
    <div className="app">
      <header><h1 onClick={() => go({ kind: 'home' })}>🥁 Beatbox-Trainer</h1>
        <button className={'pill ' + (view.kind === 'wissen' ? 'on' : '')} onClick={() => go({ kind: 'wissen' })}>📖 Wissen & Tipps</button></header>
      <main>
        {view.kind === 'groove' && <Groove key={view.p.id} pattern={view.p} bpm={view.bpm} mode={view.mode} onBack={() => go(view.back ?? { kind: 'home' })} />}
        {view.kind === 'sound' && <SoundView s={view.s} onBack={() => go(view.back ?? { kind: 'home' })}
          onDrill={() => go({ kind: 'groove', p: patternById(drillFor[view.s.id])!, mode: 'along', back: view })} />}

        {view.kind === 'wissen' && <Wissen key={view.topic} topic={view.topic} onBack={() => go({ kind: 'home' })} />}
        {view.kind === 'session' && (() => { const sv = view; return (
          <section className="card">
            <button className="ghost" onClick={() => go({ kind: 'home' })}>← Zurück</button>
            <h2>{sv.s.title}</h2>
            <p className="muted">{sv.s.blocks.reduce((a, b) => a + b.min, 0)} Minuten · Aufwärmen → Klang → Groove → Anwenden</p>
            <div className="blocks">{sv.s.blocks.map((b, k) => (
              <div className="block-item" key={k}>
                <span className="kind">{b.kind}<br /><small>{b.min} Min</small></span>
                <div><p>{b.text}</p><div className="row">{blockButtons(b, sv)}</div></div>
              </div>
            ))}</div>
            <button className={data.done[sv.s.id] ? 'ghost' : ''} onClick={() => toggle(sv.s.id)}>
              {data.done[sv.s.id] ? '✓ Erledigt (rückgängig)' : 'Einheit als erledigt markieren'}
            </button>
          </section>); })()}

        {view.kind === 'home' && <>
          <section className="card hero">
            <div>
              <h2>Weiter üben</h2>
              <p className="muted">{doneCount} von {all.length} Einheiten · 8 Wochen · 3 × 30 Min pro Woche</p>
              <div className="bar"><span style={{ width: `${doneCount / all.length * 100}%` }} /></div>
            </div>
            {next ? <button onClick={() => go({ kind: 'session', s: next })}>▶ Woche {WEEKS.find(w => w.sessions.includes(next))!.n}: {next.title.replace(/^Einheit \d – /, '')}</button> : <strong>🎉 Plan abgeschlossen!</strong>}
          </section>

          <div className="home-grid"><div>
            <Fold id="plan" title="Dein 8-Wochen-Plan">
              <p className="muted">Kurze, regelmäßige Einheiten sind beim Beatboxen besser als lange – Lippen und Atmung ermüden schnell. Zwischendurch täglich 2 Minuten Grundbeat (im Auto, unter der Dusche) wirkt Wunder.</p>
              {WEEKS.map(w => {
                const d = w.sessions.filter(x => data.done[x.id]).length;
                return (
                  <details key={w.n} open={next?.id.startsWith(`w${w.n}s`)} className="week">
                    <summary><span>Woche {w.n}: {w.title}</span><span className={'badge ' + (d === 3 ? 'full' : '')}>{d}/3</span></summary>
                    <p className="muted">🎯 Wochenziel: {w.goal}</p>
                    {w.sessions.map(x => (
                      <button key={x.id} className={'session ' + (data.done[x.id] ? 'done' : '')} onClick={() => go({ kind: 'session', s: x })}>
                        {data.done[x.id] ? '✓ ' : ''}{x.title}
                      </button>
                    ))}
                  </details>
                );
              })}
            </Fold>
          </div><div>
            <Fold id="wissen" title="Wissen & Tipps" extra={<span className="badge">{TOPICS.length}</span>}>
              <div className="songs">
                {TOPICS.map(t => (
                  <button key={t.id} className="song" onClick={() => go({ kind: 'wissen', topic: t.id })}>
                    <strong>{t.icon} {t.title}</strong>
                    <span className="muted small">{t.kind === 'theorie' ? 'Theorie' : 'Tipps & Tricks'}</span>
                  </button>
                ))}
              </div>
            </Fold>
            <Fold id="sounds" title="Klänge" extra={<span className="badge">{SOUNDS.length}</span>}>
              <div className="songs">
                {SOUNDS.map(s => (
                  <button key={s.id} className="song" onClick={() => go({ kind: 'sound', s })}>
                    <strong><span className="sym small">{s.symbol}</span> {s.name}</strong>
                    <span className="muted small">{s.role} · Stufe {s.level}</span>
                  </button>
                ))}
              </div>
            </Fold>
            {(Object.keys(CAT_NAMES) as Cat[]).map(cat => (
              <Fold key={cat} id={'cat-' + cat} title={CAT_NAMES[cat]} defaultOpen={cat === 'basis'}
                extra={<span className="badge">{PATTERNS.filter(p => p.cat === cat && data.best[p.id]).length}/{PATTERNS.filter(p => p.cat === cat).length} ★</span>}>
                <div className="songs">
                  {PATTERNS.filter(p => p.cat === cat).map(p => {
                    const b = data.best[p.id];
                    return (
                      <button key={p.id} className="song" onClick={() => go({ kind: 'groove', p })}>
                        <strong>{p.title}</strong>
                        <span className="muted small mono">{p.steps.replace(/ \| .*/, ' …')}</span>
                        <span className="muted small">{p.bpm} bpm{b ? ` · ${'★'.repeat(starsFor(b.score))}${'☆'.repeat(3 - starsFor(b.score))} ${b.score} %` : ''}</span>
                      </button>
                    );
                  })}
                </div>
              </Fold>
            ))}
            <Fold id="notation" title="Notation" defaultOpen={false}>
              <p className="muted small">Jedes Kästchen ist ein Schritt (Achtel oder Sechzehntel). Die Zahlen sind die Schläge, bei denen der Klick kommt. <strong>·</strong> = Pause. Kleines <strong>k</strong> = eingeatmet.</p>
            </Fold>
          </div></div>
        </>}
      </main>
    </div>
  );
}
