window.GameProgress = {
  key: 'puzzle_progress_v1',
  get() {
    const raw = localStorage.getItem(this.key);
    try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
  },
  set(data) { localStorage.setItem(this.key, JSON.stringify(data)); },
  markSolved(puzzleId) {
    const data = this.get();
    data[puzzleId] = true;
    this.set(data);
  },
  isSolved(puzzleId) {
    const data = this.get();
    return !!data[puzzleId];
  }
};

async function sha256Hex(str) {
  const enc = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', enc);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

const PUZZLE_HASHES = {
  'p1': 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5', // هاش لـ "M1-5MAGIC"
  'p2': '',
  'p3': '',
  'p4': ''
};

const DEFAULT_CODES = {
  'p1': 'M1-5MAGIC',
  'p2': 'C2-ALPHA',
  'p3': 'C3-SONIC',
  'p4': 'C4-PATTERN'
};

async function initHashesIfEmpty() {
  const looksPlaceholder = PUZZLE_HASHES['p1'] === '';
  if (!looksPlaceholder) return;
  for (const key of Object.keys(DEFAULT_CODES)) {
    const code = DEFAULT_CODES[key];
    PUZZLE_HASHES[key] = await sha256Hex(code);
  }
}

async function verifyCode(puzzleId, inputStr) {
  const cleaned = (inputStr || '').trim();
  if (!cleaned) return { ok: false, reason: 'empty' };
  const hash = await sha256Hex(cleaned);
  const target = PUZZLE_HASHES[puzzleId];
  const result = { ok: hash === target, hash, target };
  if (result.ok) GameProgress.markSolved(puzzleId);
  return result;
}

function goNext(href) {
  window.location.href = href;
}
