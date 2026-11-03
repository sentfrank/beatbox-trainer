import type { SoundId } from './audio';

export type Sound = {
  id: SoundId; name: string; symbol: string; role: string; level: number;
  how: string[]; mistakes: string[]; drill: string;
  band: 'low' | 'mid' | 'high'; // grobe Frequenzlage für die Mikro-Erkennung
};

export const SOUNDS: Sound[] = [
  { id: 'B', name: 'Kick Drum', symbol: 'B', role: 'Bassdrum', level: 1, band: 'low',
    how: [
      'Sag ein normales „B“ – und lass dann den Vokal weg. Nur der Lippenknall bleibt.',
      'Lippen locker aufeinander, Luft im Mund stauen, Lippen ruckartig nach vorn öffnen.',
      'Kaum Luft benutzen: die Kick kommt aus dem Druck im Mund, nicht aus der Lunge.',
      'Für mehr Bauch: Lippen leicht nach innen rollen und einen kurzen „Pf“-Stoß ohne das F.',
    ],
    mistakes: ['„Be“ oder „Bu“ – ein Vokal hängt hinten dran.', 'Zu viel Luft: klingt nach Pusten statt Bass.', 'Lippen verkrampft – dann wird der Klang spitz und dünn.'],
    drill: 'Viertel-Kicks bei 70 bpm, 1 Minute ohne Pause. Halte den Klang bei jedem Schlag gleich.' },
  { id: 't', name: 'Hi-Hat (geschlossen)', symbol: 't', role: 'Becken', level: 1, band: 'high',
    how: [
      'Ein kurzes, scharfes „t“ – Zungenspitze hinter den oberen Schneidezähnen.',
      'Zähne fast geschlossen lassen, die Luft zischt durch den Spalt.',
      'So leise und kurz wie möglich – die Hi-Hat ist Gewürz, nicht Hauptgericht.',
    ],
    mistakes: ['„te“ – ein Schwa-Vokal hinterher.', 'Zu laut: die Hi-Hat übertönt Kick und Snare.'],
    drill: 'Achtel „t t t t t t t t“ bei 80 bpm, dann 16tel bei 60 bpm. Gleichmäßig wie eine Nähmaschine.' },
  { id: 'ts', name: 'Offene Hi-Hat', symbol: 'ts', role: 'Becken offen', level: 2, band: 'high',
    how: [
      'Ein „t“, das in ein langes „sss“ übergeht: „tsss“.',
      'Die Länge kannst du gestalten – kurz für Funk, lang für Disco und Refrains.',
      'Mit der Zunge abstoppen („tst“), um die Hi-Hat wieder zu „schließen“.',
    ],
    mistakes: ['Das „s“ wird pfeifend – Zähne etwas weiter auseinander.', 'Länge schwankt von Schlag zu Schlag.'],
    drill: '„B ts B ts“ – das „ts“ genau bis zur nächsten Kick klingen lassen.' },
  { id: 'Pf', name: 'Lippen-Snare (Pf)', symbol: 'Pf', role: 'Snare', level: 1, band: 'mid',
    how: [
      'Wie die Kick starten (Lippen stauen Luft), aber beim Öffnen ein scharfes „f“ dranhängen: „Pf“.',
      'Die Lippen öffnen nur einen Spalt, die Luft reibt an Lippen und oberen Zähnen.',
      'Knackig und kurz – sie markiert Schlag 2 und 4, den Backbeat.',
    ],
    mistakes: ['„Pff“ zu lang – klingt nach Luftmatratze.', 'Zu leise im Vergleich zur Kick.'],
    drill: '„B . Pf .“ bei 80 bpm. Kick und Snare im Wechsel, beide gleich laut.' },
  { id: 'K', name: 'K-Snare', symbol: 'K', role: 'Snare', level: 2, band: 'mid',
    how: [
      'Ein hartes, kurzes „K“ ohne Vokal, Zungenrücken drückt gegen den weichen Gaumen.',
      'Trockener und „tighter“ als die Pf-Snare – gut für schnelle Tempi.',
    ],
    mistakes: ['„Ka“ oder „Ke“ – Vokal weglassen!', 'Aus dem Hals statt aus dem Mund – dann kratzt es.'],
    drill: '„B t K t“ bei 90 bpm. Wechsel zwischen Pf- und K-Snare im Takt.' },
  { id: 'k', name: 'Inward K (eingeatmet)', symbol: 'k', role: 'Snare + Atmung', level: 3, band: 'mid',
    how: [
      'Das Atem-Geheimnis: Die Snare wird EINGEATMET. So kannst du minutenlang beatboxen.',
      'Mundwinkel leicht zusammen, Zunge locker; beim Einatmen ein scharfes „k“ erzeugen.',
      'Fühlt sich an wie ein überraschtes Luftholen mit „k“ – kurz und hart.',
      'Erst langsam: „B (aus) – t (aus) – k (ein) – t (aus)“.',
    ],
    mistakes: ['Zu viel Luft auf einmal – nur ein kleiner Schluck.', 'Das k wird zu leise – mit Zungenspannung schärfen.', 'Schwindelig? Pause machen und normal atmen.'],
    drill: '„B t k t“ bei 70 bpm über 1 Minute. Du solltest danach nicht außer Atem sein.' },
  { id: 'm', name: 'Gesummter Bass', symbol: 'm', role: 'Bass (A cappella)', level: 2, band: 'low',
    how: [
      'Die A-cappella-Brücke: Du summst die Basslinie und setzt Kicks darauf („B-mm“).',
      'Kick spielen und direkt mit geschlossenen Lippen weiter summen – die Tonhöhe hält.',
      'In der Gruppe singst du so die Bass-Silben (dm, bm) mit Groove-Charakter.',
    ],
    mistakes: ['Summen und Kick haben unterschiedliche Lautstärke.', 'Tonhöhe sackt beim Kick ab.'],
    drill: '„B-mm . Pf . B-mm B Pf .“ auf einem Ton, dann auf C – F – G – C.' },
  { id: 'Lr', name: 'Lip Roll (Lippenbass)', symbol: 'Lr', role: 'Bass-Effekt', level: 3, band: 'low',
    how: [
      'Lippen locker wie beim „Brrr“ (Kälte-Lippenflattern), aber nur mit wenig Luft.',
      'Mit einem tiefen Summton dazu klingt es wie ein synthetischer Bass.',
      'Erst lange Rolls üben, dann kurze Stöße im Rhythmus.',
    ],
    mistakes: ['Lippen zu fest – sie flattern nicht.', 'Zu viel Luft – geht schnell die Puste aus.'],
    drill: '4 Schläge Lip Roll, 4 Schläge Pause – im Wechsel 2 Minuten.' },
];

export const soundById = (id: string) => SOUNDS.find(s => s.id === id);
