/**
 * Create optimized .webp copies of About Day album JPGs (and other about JPGs).
 * Leaves original .jpg files untouched.
 * Resizes to max edge 800px — polaroids display ~100–150px CSS.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public', 'images', 'about');
const MAX_EDGE = 800;
const QUALITY = 80;

const jpgs = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.jpe?g$/i.test(ent.name)) jpgs.push(p);
  }
}

async function main() {
  walk(ROOT);
  console.log('Found', jpgs.length, 'JPGs under public/images/about');

  let ok = 0;
  let fail = 0;
  let bytesIn = 0;
  let bytesOut = 0;

  for (const jpg of jpgs) {
    const webp = jpg.replace(/\.jpe?g$/i, '.webp');
    try {
      const inputStat = fs.statSync(jpg);
      bytesIn += inputStat.size;

      const meta = await sharp(jpg).metadata();
      const w = meta.width || MAX_EDGE;
      const h = meta.height || MAX_EDGE;
      const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
      const tw = Math.max(1, Math.round(w * scale));
      const th = Math.max(1, Math.round(h * scale));

      await sharp(jpg)
        .rotate() // honor EXIF orientation
        .resize(tw, th, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(webp);

      const outStat = fs.statSync(webp);
      bytesOut += outStat.size;
      if (!fs.existsSync(jpg)) throw new Error('JPG missing after convert');
      ok += 1;
      if (ok % 20 === 0 || ok === jpgs.length) {
        console.log(`… ${ok}/${jpgs.length}`);
      }
    } catch (e) {
      fail += 1;
      console.error('FAIL', jpg, e.message);
    }
  }

  console.log(
    JSON.stringify({
      ok,
      fail,
      total: jpgs.length,
      mbIn: +(bytesIn / 1e6).toFixed(1),
      mbOut: +(bytesOut / 1e6).toFixed(1),
    }),
  );
  if (fail > 0) process.exit(1);
}

main();
