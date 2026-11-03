const KEY = 'beatbox-trainer-v1';
export type Data = { done: Record<string, boolean>; best: Record<string, { score: number; bpm: number }>; latency: number; sens: number };
const empty = (): Data => ({ done: {}, best: {}, latency: 0, sens: 4 });
function load(): Data {
  try { return { ...empty(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return empty(); }
}
export const store = {
  get: load,
  update(fn: (d: Data) => void) { const d = load(); fn(d); try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} return d; },
};
