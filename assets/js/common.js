<script>
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
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join('');
}

// مخرجات الهاش للرموز (غير مكشوفة كنص مباشر)
const PUZZLE_HASHES = {
  'p1': '7b80a6b6f3da7b214fcb8f66b2bdf2e4bb701fb3b8a8ad99f1b1a1b1c8b1f5a1', // placeholder
  'p2': '0f3f4a9be1c5a6c77abbb8a0a7d2f1cccd55a5a2ea1b33123b9a2e1b7c5dfe91', // placeholder
  'p3': '6f2c6fda2a4b3f77b8b91a2cd9e0a77a90b2a3c1d4e5f6a7b8c9d0e1f2a3b4c5', // placeholder
  'p4': 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'  // placeholder
};

// للتبسيط: نخلي الرموز الافتراضية التالية، وعدّلها لاحقاً:
const DEFAULT_CODES = {
  'p1': 'C1-9QX7',
  'p2': 'C2-ALPHA',
  'p3': 'C3-SONIC',
  'p4': 'C4-PATTERN'
};

async function initHashesIfEmpty() {
  // لو الهاشات placeholder، نحسبها من DEFAULT_CODES تلقائياً كي تشتغل النسخة الأولية
  const looksPlaceholder = PUZZLE_HASHES['p1'].startsWith('7b80') || PUZZLE_HASHES['p4'].startsWith('deadbeef');
  if (!looksPlaceholder) return;
  for (const key of Object.keys(DEFAULT_CODES)) {
    const code = DEFAULT_CODES[key];
    PUZZLE_HASHES[key] = await sha256Hex(code);
  }
}

async function verifyCode(puzzleId, inputStr) {
  const cleaned = (inputStr || '').trim();
  if (!cleaned) return { ok:false, reason:'empty' };
  const hash = await sha256Hex(cleaned);
  const target = PUZZLE_HASHES[puzzleId];
  return { ok: hash === target, hash, target };
}

function goNext(href) {
  window.location.href = href;
}
</script>
