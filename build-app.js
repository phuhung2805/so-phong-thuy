// Đóng gói Sổ Phong Thủy thành PWA trong thư mục docs/ (GitHub Pages phục vụ thư mục này).
// Chạy lại mỗi khi sửa so-phong-thuy.html hoặc phongthuy-core.js:  node build-app.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT = path.join(__dirname, 'docs');
fs.mkdirSync(path.join(OUT, 'icons'), { recursive: true });
const VERSION = new Date().toISOString().replace(/\D/g, '').slice(0, 12);

/* ---------- index.html ---------- */
const page = fs.readFileSync(path.join(__dirname, 'so-phong-thuy.html'), 'utf8');
const head = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#B42318">
<meta name="description" content="Lịch âm, lá số, xem nhà, chọn ngày cưới hỏi và tang lễ.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="icons/icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Phong Thủy">
<style>
  :root { padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
  body { margin: 0; -webkit-text-size-adjust: 100%; }
  [hidden] { display: none !important; }
  img { max-width: 100%; }
</style>
`;
const register = `
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
</script>
</body>
</html>
`;
// Tách <title>, <meta>, <link>, <style> đầu trang vào <head>, phần còn lại vào <body>
const bodyStart = page.indexOf('<div class="wrap">');
const html = head + page.slice(0, bodyStart) + '</head>\n<body>\n' + page.slice(bodyStart) + register;
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.copyFileSync(path.join(__dirname, 'phongthuy-core.js'), path.join(OUT, 'phongthuy-core.js'));

/* ---------- manifest ---------- */
fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), JSON.stringify({
  name: 'Sổ Phong Thủy',
  short_name: 'Phong Thủy',
  description: 'Lịch âm, lá số, xem nhà, chọn ngày cưới hỏi và tang lễ.',
  lang: 'vi',
  start_url: './',
  scope: './',
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#EDEFE8',
  theme_color: '#B42318',
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  shortcuts: [
    { name: 'Lịch hôm nay', url: './#hom-nay' },
    { name: 'Chọn ngày cưới', url: './#cuoi-hoi' },
    { name: 'Xem nhà', url: './#xem-nha' },
  ],
}, null, 2));

/* ---------- service worker: chạy được khi mất mạng ---------- */
fs.writeFileSync(path.join(OUT, 'sw.js'), `// Phiên bản ${VERSION}
const CACHE = 'phong-thuy-${VERSION}';
const CORE = ['./', 'index.html', 'phongthuy-core.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isFont = url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com';
  if (url.origin !== location.origin && !isFont) return;
  // Mạng trước, lỗi mạng thì lấy bản đã lưu
  e.respondWith(fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
});
`);

/* ---------- icon PNG: ấn son đỏ với la bàn vàng ---------- */
function crcTable() { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; }
const CRC = crcTable();
const crc32 = buf => { let c = 0xFFFFFFFF; for (const b of buf) c = CRC[(c ^ b) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, maskable) {
  const RED = [180, 35, 24], GOLD = [222, 182, 92], DARK = [120, 20, 14];
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const c = size / 2, S = 4; // khử răng cưa 4x4
  const pad = maskable ? 0 : size * 0.06, rad = maskable ? 0 : size * 0.2;
  const scale = maskable ? 0.72 : 1; // vùng an toàn cho icon maskable
  function colorAt(x, y) {
    // nền: hình vuông bo góc
    const qx = Math.max(Math.abs(x - c) - (c - pad - rad), 0), qy = Math.max(Math.abs(y - c) - (c - pad - rad), 0);
    if (Math.hypot(qx, qy) > rad) return null;
    const dx = (x - c) / scale, dy = (y - c) / scale, r = Math.hypot(dx, dy), u = size / 512;
    const ring = (r0, w) => Math.abs(r - r0) < w * u;
    if (ring(170, 14) || ring(118, 6)) return GOLD;
    // kim la bàn: hình thoi dọc và ngang
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (ax / 34 + ay / 150 <= u) return dy < 0 ? GOLD : [245, 225, 180];
    if (ay / 34 + ax / 150 <= u) return GOLD;
    // 8 vạch hướng
    const ang = Math.atan2(dy, dx), k = Math.round(ang / (Math.PI / 4)) * (Math.PI / 4);
    if (r > 196 * u && r < 222 * u && Math.abs(ang - k) * r < 7 * u) return GOLD;
    if (r < 18 * u) return DARK;
    return RED;
  }
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let rr = 0, gg = 0, bb = 0, aa = 0;
      for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
        const col = colorAt(x + (sx + 0.5) / S, y + (sy + 0.5) / S);
        if (col) { rr += col[0]; gg += col[1]; bb += col[2]; aa++; }
      }
      const o = y * (size * 4 + 1) + 1 + x * 4;
      if (aa) { raw[o] = rr / aa; raw[o + 1] = gg / aa; raw[o + 2] = bb / aa; }
      raw[o + 3] = Math.round(aa / (S * S) * 255);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
fs.writeFileSync(path.join(OUT, 'icons/icon-192.png'), png(192, false));
fs.writeFileSync(path.join(OUT, 'icons/icon-512.png'), png(512, false));
fs.writeFileSync(path.join(OUT, 'icons/icon-180.png'), png(180, true));
fs.writeFileSync(path.join(OUT, 'icons/icon-maskable-512.png'), png(512, true));
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log('Đã đóng gói vào docs/ (phiên bản ' + VERSION + ')');
