import type { SoundId } from './audio';

export type Cat = 'basis' | 'stil' | 'fill' | 'acappella';
export type Pattern = {
  id: string; title: string; cat: Cat; level: number; bpm: number;
  sub: 2 | 4;          // Schritte pro Schlag: 2 = Achtel, 4 = Sechzehntel
  steps: string;       // Tokens mit Leerzeichen, „.“ = Pause, „|“ = Taktstrich (optisch)
  swing?: number;      // 0..0.33 – verschiebt jeden zweiten Schritt
  hint: string;
};

export const CAT_NAMES: Record<Cat, string> = {
  basis: 'Grundbeats', stil: 'Groove-Stile', fill: 'Fills & Übergänge', acappella: 'A-cappella-Grooves',
};

export const PATTERNS: Pattern[] = [
  // Grundbeats
  { id: 'kick4', title: 'Kick auf jedem Schlag', cat: 'basis', level: 1, bpm: 70, sub: 2, steps: 'B . B . B . B .', hint: 'Ein Kick pro Klick. Gleiche Lautstärke, gleiche Länge.' },
  { id: 'hat8', title: 'Achtel-Hi-Hat', cat: 'basis', level: 1, bpm: 80, sub: 2, steps: 't t t t t t t t', hint: 'Leicht und kurz – die Hi-Hat ist das Uhrwerk.' },
  { id: 'kick-snare', title: 'Kick & Snare', cat: 'basis', level: 1, bpm: 75, sub: 2, steps: 'B . Pf . B . Pf .', hint: 'Snare auf 2 und 4 – das ist der Backbeat.' },
  { id: 'bt', title: 'Kick & Hi-Hat', cat: 'basis', level: 1, bpm: 75, sub: 2, steps: 'B t B t B t B t', hint: 'Erst die Kick, die Hi-Hat sitzt genau dazwischen.' },
  { id: 'grund', title: 'Der Grundbeat', cat: 'basis', level: 1, bpm: 80, sub: 2, steps: 'B t Pf t B t Pf t', hint: 'DER Beatbox-Beat. Alles andere baut darauf auf.' },
  { id: 'grund-k', title: 'Grundbeat mit K-Snare', cat: 'basis', level: 2, bpm: 90, sub: 2, steps: 'B t K t B t K t', hint: 'Wie der Grundbeat, nur trockener – gut für schnellere Songs.' },
  { id: 'inward', title: 'Grundbeat mit Inward K', cat: 'basis', level: 3, bpm: 80, sub: 2, steps: 'B t k t B t k t', hint: 'Auf dem k einatmen. So hältst du den Beat beliebig lange.' },
  { id: 'hat16', title: '16tel-Hi-Hat', cat: 'basis', level: 2, bpm: 70, sub: 4, steps: 'B t t t Pf t t t B t t t Pf t t t', hint: 'Hi-Hats ganz leise, Kick und Snare betont.' },
  { id: 'open', title: 'Offene Hi-Hat', cat: 'basis', level: 2, bpm: 85, sub: 2, steps: 'B ts Pf ts B ts Pf ts', hint: 'Jedes „ts“ klingt bis zum nächsten Schlag.' },
  // Stile
  { id: 'rock', title: 'Rock', cat: 'stil', level: 2, bpm: 100, sub: 2, steps: 'B t Pf t B B Pf t', hint: 'Doppel-Kick auf „3 und“. Kräftig, gerade, ohne Swing.' },
  { id: 'hiphop', title: 'Hip-Hop (Boom Bap)', cat: 'stil', level: 2, bpm: 88, sub: 4, steps: 'B . t . Pf . t B . B t . Pf . t .', hint: 'Lässig, die Kick auf „2-e“ kommt leicht verzögert.', swing: 0.12 },
  { id: 'disco', title: 'Disco / Four on the Floor', cat: 'stil', level: 2, bpm: 118, sub: 2, steps: 'B ts B ts B ts B ts', hint: 'Kick auf jedem Schlag, offene Hi-Hat dazwischen. Tanzbar!' },
  { id: 'disco-snare', title: 'Disco mit Snare', cat: 'stil', level: 3, bpm: 112, sub: 4, steps: 'B . ts . Pf . ts . B . ts . Pf . ts .', hint: 'Kick und Snare im Wechsel, Hi-Hat offen.' },
  { id: 'funk', title: 'Funk', cat: 'stil', level: 3, bpm: 95, sub: 4, steps: 'B t t B Pf t t B t B t t Pf t B t', hint: 'Synkopen! Langsam beginnen, jede Kick bewusst setzen.' },
  { id: 'shuffle', title: 'Shuffle / Swing', cat: 'stil', level: 2, bpm: 90, sub: 2, steps: 'B t Pf t B t Pf t', swing: 0.3, hint: 'Grundbeat mit „Ternär-Feeling“: lang-kurz, lang-kurz.' },
  { id: 'reggae', title: 'Reggae (One Drop)', cat: 'stil', level: 3, bpm: 76, sub: 2, steps: 't t t t B t t t', hint: 'Kick und Snare zusammen auf der 3 – die 1 bleibt leer!' },
  // Fills
  { id: 'fill1', title: 'Snare-Fill', cat: 'fill', level: 2, bpm: 80, sub: 2, steps: 'B t Pf t B t Pf t | B t Pf t Pf Pf Pf Pf', hint: 'Takt 2 endet mit vier Snares – kündigt den nächsten Teil an.' },
  { id: 'fill2', title: '16tel-Fill', cat: 'fill', level: 3, bpm: 80, sub: 4, steps: 'B . t . Pf . t . B . t . Pf . t . | B . t . Pf . t . K K K K Pf Pf Pf Pf', hint: 'Erst K-Snares, dann Pf-Snares – Spannung steigt.' },
  { id: 'stop', title: 'Break / Stopp', cat: 'fill', level: 2, bpm: 90, sub: 2, steps: 'B t Pf t B t Pf t | B . . . . . . .', hint: 'Ein Takt Groove, dann EIN Kick und Stille. Stille ist auch Musik!' },
  // A cappella
  { id: 'ballade', title: 'Ballade (Halftime)', cat: 'acappella', level: 1, bpm: 68, sub: 2, steps: 'B . t . Pf . t .', hint: 'Ruhig und weich, mit wenig Lautstärke – der Chor steht im Vordergrund.' },
  { id: 'pop', title: 'Pop-Groove', cat: 'acappella', level: 2, bpm: 100, sub: 4, steps: 'B . t . Pf . t B . B t . Pf . t .', hint: 'Der Allround-Groove für die meisten A-cappella-Pop-Arrangements.' },
  { id: 'bass-groove', title: 'Kick mit gesummtem Bass', cat: 'acappella', level: 3, bpm: 84, sub: 2, steps: 'B m Pf . B m Pf t', hint: 'Kick und direkt summen – die Brücke zur Bass-Stimme.' },
  { id: 'lipbass', title: 'Lip-Roll-Groove', cat: 'acappella', level: 3, bpm: 84, sub: 2, steps: 'Lr t Pf t Lr t Pf t', hint: 'Lip Roll ersetzt die Kick – fetter Synthbass-Sound.' },
  { id: 'uptempo', title: 'Uptempo-Refrain', cat: 'acappella', level: 3, bpm: 124, sub: 2, steps: 'B ts K ts B ts K ts', hint: 'Für Refrains: viel Energie, aber Atmung mit Inward K vorbereiten.' },
];

export const patternById = (id: string) => PATTERNS.find(p => p.id === id);

export type Step = { sound: SoundId | null; bar: boolean };
const VALID = new Set(['B', 't', 'ts', 'Pf', 'K', 'k', 'Lr', 'm']);
export function parseSteps(s: string): Step[] {
  const out: Step[] = []; let bar = false;
  for (const tok of s.trim().split(/\s+/)) {
    if (tok === '|') { bar = true; continue; }
    out.push({ sound: VALID.has(tok) ? (tok as SoundId) : null, bar }); bar = false;
  }
  return out;
}
