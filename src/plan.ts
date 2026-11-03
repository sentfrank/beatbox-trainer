import type { Mode } from './components/Groove';

export type Kind = 'Aufwärmen' | 'Klang' | 'Groove' | 'Anwenden';
export type Block = { kind: Kind; min: number; text: string; sound?: string; pattern?: string; bpm?: number; mode?: Mode };
export type Session = { id: string; title: string; blocks: Block[] };
export type Week = { n: number; title: string; goal: string; sessions: Session[] };

type O = { sound?: string; pattern?: string; bpm?: number; mode?: Mode };
const A = (text: string, o: O = {}): Block => ({ kind: 'Aufwärmen', min: 5, text, ...o });
const K = (text: string, o: O = {}): Block => ({ kind: 'Klang', min: 10, text, ...o });
const G = (text: string, o: O = {}): Block => ({ kind: 'Groove', min: 10, text, ...o });
const N = (text: string, o: O = {}): Block => ({ kind: 'Anwenden', min: 5, text, ...o });
const W = (n: number, title: string, goal: string, s: [string, Block[]][]): Week =>
  ({ n, title, goal, sessions: s.map(([t, b], k) => ({ id: `w${n}s${k + 1}`, title: `Einheit ${k + 1} – ${t}`, blocks: b })) });

const WARM = 'Lippen flattern lassen („Brrr“) 30 s, Zungenspitze 20× an die Zähne tippen („t-t-t“), 3× tief in den Bauch atmen.';

export const WEEKS: Week[] = [
  W(1, 'Die drei Grundklänge', 'Kick, Hi-Hat und Pf-Snare einzeln sauber – Grundbeat bei 70 bpm', [
    ['Die Kick', [
      A(WARM),
      K('Die Kick „B“ – Anleitung lesen, Demo anhören, nachmachen. Ohne Vokal!', { sound: 'B' }),
      G('Kick auf jedem Schlag, erst „Vormachen“, dann „Solo“ mit Klick.', { pattern: 'kick4', bpm: 65, mode: 'solo' }),
      N('Nimm dich 20 Sekunden auf und hör die Kick an. Klingt jeder Schlag gleich?', { pattern: 'kick4', bpm: 70, mode: 'solo' })]],
    ['Hi-Hat und Snare', [
      A(WARM),
      K('Hi-Hat „t“ – so kurz und leise wie möglich.', { sound: 't' }),
      K('Pf-Snare: wie die Kick starten, scharfes „f“ dran.', { sound: 'Pf' }),
      G('Kick & Snare im Wechsel.', { pattern: 'kick-snare', bpm: 70, mode: 'along' })]],
    ['Der erste Beat', [
      A(WARM),
      G('Kick & Hi-Hat: die Hi-Hat sitzt genau zwischen den Kicks.', { pattern: 'bt', bpm: 70, mode: 'along' }),
      G('Der Grundbeat „B t Pf t“ – erst Mitmachen, dann Solo.', { pattern: 'grund', bpm: 65, mode: 'along' }),
      N('Wochenziel: Grundbeat Solo mit Mikro-Analyse bei 70 bpm ⭐⭐.', { pattern: 'grund', bpm: 70, mode: 'solo' })]],
  ]),
  W(2, 'Der Grundbeat sitzt', 'Grundbeat 1 Minute ohne Stocken bei 90 bpm', [
    ['Gleichmäßigkeit', [
      A(WARM),
      G('Achtel-Hi-Hat – wie eine Nähmaschine.', { pattern: 'hat8', bpm: 80, mode: 'solo' }),
      G('Grundbeat: 70 → 80 bpm. Erst erhöhen, wenn ⭐⭐⭐.', { pattern: 'grund', bpm: 75, mode: 'solo' }),
      N('Grundbeat zu einem Lied aus dem Radio/Spotify – passe dich dem Tempo an.')]],
    ['Klangbalance', [
      A(WARM),
      K('Kick-Feinschliff: mehr Bass durch lockere Lippen, weniger Luft.', { sound: 'B' }),
      G('Grundbeat: Kick und Snare laut, Hi-Hat leise. Aufnahme machen und vergleichen.', { pattern: 'grund', bpm: 80, mode: 'solo' }),
      N('Den Grundbeat einem Freund/Familienmitglied vorführen.')]],
    ['Tempo', [
      A(WARM),
      G('Grundbeat 85 bpm.', { pattern: 'grund', bpm: 85, mode: 'solo' }),
      G('Grundbeat 90 bpm, 1 Minute am Stück.', { pattern: 'grund', bpm: 90, mode: 'solo' }),
      N('Ballade bei 68 bpm: langsam ist schwerer als schnell! Ruhig bleiben.', { pattern: 'ballade', bpm: 68, mode: 'solo' })]],
  ]),
  W(3, 'K-Snare & Hi-Hat-Varianten', 'K-Snare bei 90 bpm, 16tel-Hi-Hat bei 70 bpm ⭐⭐', [
    ['Die K-Snare', [
      A(WARM),
      K('K-Snare – hart, kurz, ohne Vokal.', { sound: 'K' }),
      G('Grundbeat mit K-Snare.', { pattern: 'grund-k', bpm: 80, mode: 'along' }),
      N('Abwechselnd 2 Takte Pf, 2 Takte K – hörst du den Unterschied?', { pattern: 'grund', bpm: 85, mode: 'solo' })]],
    ['Offene Hi-Hat', [
      A(WARM),
      K('Offene Hi-Hat „ts“ – Länge bewusst steuern.', { sound: 'ts' }),
      G('Grundbeat mit offener Hi-Hat.', { pattern: 'open', bpm: 80, mode: 'along' }),
      N('Disco: Kick auf jeden Schlag, „ts“ dazwischen.', { pattern: 'disco', bpm: 100, mode: 'solo' })]],
    ['16tel', [
      A(WARM),
      G('16tel-Hi-Hat sehr langsam – Hi-Hats fast geflüstert.', { pattern: 'hat16', bpm: 60, mode: 'along' }),
      G('16tel-Hi-Hat bei 70 bpm.', { pattern: 'hat16', bpm: 70, mode: 'solo' }),
      N('Wochenziel: Grundbeat mit K bei 90 bpm ⭐⭐.', { pattern: 'grund-k', bpm: 90, mode: 'solo' })]],
  ]),
  W(4, 'Atmung: Inward K', 'Grundbeat 2 Minuten am Stück ohne Luftnot', [
    ['Einatmen beim Beatboxen', [
      A('Atem-Check: 1 Minute Grundbeat – bist du außer Atem? Dann ist diese Woche wichtig!'),
      K('Inward K: die Snare wird eingeatmet. Zuerst einzeln, nur 5× am Stück.', { sound: 'k' }),
      G('Inward-K-Beat sehr langsam.', { pattern: 'inward', bpm: 60, mode: 'along' }),
      N('Pause und normal atmen. Inward K kann anfangs schwindelig machen.')]],
    ['Ausdauer', [
      A(WARM),
      G('Inward-K-Beat bei 70 bpm.', { pattern: 'inward', bpm: 70, mode: 'solo' }),
      G('Wechsel: 4 Takte mit Pf (aus), 4 Takte mit k (ein).', { pattern: 'grund', bpm: 75, mode: 'solo' }),
      N('Atemplan: Bei welchen Klängen atmest du? Kick und Hi-Hat aus, k ein.')]],
    ['Lange Grooves', [
      A(WARM),
      G('Inward-K-Beat 80 bpm, 2 Minuten.', { pattern: 'inward', bpm: 80, mode: 'solo' }),
      G('Offene Hi-Hat + Inward K: „B ts k ts“.', { pattern: 'open', bpm: 80, mode: 'solo' }),
      N('Wochenziel: Aufnahme von 2 Minuten Groove ohne Pause.', { pattern: 'inward', bpm: 80, mode: 'solo' })]],
  ]),
  W(5, 'Groove-Stile', 'Drei Stile sicher: Rock, Hip-Hop, Shuffle', [
    ['Rock', [
      A(WARM),
      G('Rock: Doppel-Kick auf „3 und“.', { pattern: 'rock', bpm: 85, mode: 'along' }),
      G('Rock bei 100 bpm.', { pattern: 'rock', bpm: 100, mode: 'solo' }),
      N('Wechsel: 4 Takte Grundbeat, 4 Takte Rock.')]],
    ['Hip-Hop', [
      A(WARM),
      G('Boom Bap – lässig, mit leichtem Swing.', { pattern: 'hiphop', bpm: 80, mode: 'along' }),
      G('Hip-Hop bei 88 bpm.', { pattern: 'hiphop', bpm: 88, mode: 'solo' }),
      N('Pop-Groove: der Allrounder für A cappella.', { pattern: 'pop', bpm: 90, mode: 'along' })]],
    ['Swing & Reggae', [
      A(WARM),
      G('Shuffle: lang-kurz, lang-kurz.', { pattern: 'shuffle', bpm: 85, mode: 'along' }),
      G('Reggae One Drop – die 1 bleibt leer!', { pattern: 'reggae', bpm: 72, mode: 'along' }),
      N('Wochenziel: Rock, Hip-Hop und Shuffle je ⭐⭐.', { pattern: 'rock', bpm: 100, mode: 'solo' })]],
  ]),
  W(6, 'Bass & Klangfarbe', 'Kick mit gesummtem Bass auf C – F – G – C', [
    ['Gesummter Bass', [
      A('Summen auf „mm“: tiefster bequemer Ton, 3× 10 Sekunden. Dann Lippen flattern.'),
      K('Gesummter Bass: Kick und direkt weiter summen.', { sound: 'm' }),
      G('Kick mit gesummtem Bass.', { pattern: 'bass-groove', bpm: 70, mode: 'along' }),
      N('Den Bass-Groove auf C – F – G – C singen (je 2 Takte).')]],
    ['Lip Roll', [
      A(WARM),
      K('Lip Roll: Lippenflattern mit Summton.', { sound: 'Lr' }),
      G('Lip-Roll-Groove.', { pattern: 'lipbass', bpm: 70, mode: 'along' }),
      N('Nicht verzweifeln: Der Lip Roll braucht oft Wochen. Täglich 1 Minute reicht.')]],
    ['Bass im Groove', [
      A(WARM),
      G('Kick mit Bass bei 84 bpm.', { pattern: 'bass-groove', bpm: 84, mode: 'solo' }),
      G('Pop-Groove mit gesummter Basslinie eines Songs aus eurem Repertoire.', { pattern: 'pop', bpm: 95, mode: 'solo' }),
      N('Aufnahme: Klingt es wie Schlagzeug + Bass? Was fehlt?')]],
  ]),
  W(7, 'Fills, Dynamik, Mikrofon', 'Formteile mit Fills verbinden, leise/laut gestalten', [
    ['Fills', [
      A(WARM),
      G('Snare-Fill am Ende jedes 2. Takts.', { pattern: 'fill1', bpm: 80, mode: 'along' }),
      G('Break/Stopp – die Stille aushalten!', { pattern: 'stop', bpm: 90, mode: 'solo' }),
      N('Eigenen Fill erfinden: 4 Klänge am Ende eines Takts.')]],
    ['Dynamik', [
      A(WARM),
      G('16tel-Fill.', { pattern: 'fill2', bpm: 75, mode: 'along' }),
      G('Grundbeat: 4 Takte ganz leise (Strophe), 4 Takte voll (Refrain), mit Fill dazwischen.', { pattern: 'grund', bpm: 90, mode: 'solo' }),
      N('Ballade weich und leise – der Chor muss darüber gut hörbar bleiben.', { pattern: 'ballade', bpm: 68, mode: 'solo' })]],
    ['Mikrofontechnik', [
      A(WARM),
      N('Mikro (falls ihr eins nutzt): ca. 2–5 cm Abstand, leicht schräg halten – direkt davor „ploppt“ die Kick. Mit der Hand nicht den Mikrofonkorb umschließen (Rückkopplung).'),
      G('Disco mit Snare – Energie für den Refrain.', { pattern: 'disco-snare', bpm: 105, mode: 'along' }),
      N('Funk langsam probieren – Kür für Fortgeschrittene.', { pattern: 'funk', bpm: 80, mode: 'along' })]],
  ]),
  W(8, 'A-cappella-Praxis', 'Einen Song der Gruppe 3 Minuten im Tempo begleiten', [
    ['Song-Groove finden', [
      A(WARM),
      N('Wähle einen Song aus eurem Repertoire. Tempo (bpm) bestimmen: Tippe im Groove-Trainer auf „Tap“.'),
      G('Passenden Groove auswählen und im Song-Tempo üben (Ballade, Pop oder Uptempo).', { pattern: 'pop', mode: 'solo' }),
      N('Formplan notieren: Intro – Strophe (leise) – Refrain (voll) – wo kommen Fills?')]],
    ['Durchhalten', [
      A(WARM),
      G('Uptempo-Refrain mit Inward K.', { pattern: 'uptempo', bpm: 110, mode: 'along' }),
      G('Den Song-Groove 3 Minuten am Stück, mit Fills an den Formteilen.', { pattern: 'pop', mode: 'solo' }),
      N('Aufnahme zur Original- oder Probenaufnahme: Bleibst du im Tempo?')]],
    ['Probe!', [
      A(WARM),
      G('Letzter Check: Lieblingsgroove ⭐⭐⭐.', { pattern: 'grund', bpm: 95, mode: 'solo' }),
      N('In der Probe: Bitte Bass und Chorleitung um Feedback zu Lautstärke und Tempo. Die Percussion ist das Fundament – lieber stabil als spektakulär.'),
      N('🎉 Geschafft! Weiter geht’s mit den Stilen und Fills, die dir am meisten Spaß machen.')]],
  ]),
];
