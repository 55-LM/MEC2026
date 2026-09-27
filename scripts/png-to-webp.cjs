/**
 * Create .webp copies of every PNG under public/images.
 * Leaves original PNGs untouched.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'public', 'images');
const pngs = [];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.png$/i.test(ent.name)) pngs.push(p);
  }
}

async function main() {
  walk(root);
  console.log('Found', pngs.length, 'PNGs');

  let ok = 0;
  let fail = 0;

  for (const png of pngs) {
    const webp = png.replace(/\.png$/i, '.webp');
    try {
      const meta = await sharp(png).metadata();
      await sharp(png)
        .webp({
          quality: 92,
          alphaQuality: 100,
          effort: 4,
          smartSubsample: true,
        })
        .toFile(webp);

      const out = await sharp(webp).metadata();
      if (out.width !== meta.width || out.height !== meta.height) {
        throw new Error(
          `size mismatch ${meta.width}x${meta.height} -> ${out.width}x${out.height}`,
        );
      }
      if (!fs.existsSync(png)) {
        throw new Error('PNG missing after convert');
      }
      ok += 1;
      console.log('OK', path.relative(path.join(__dirname, '..'), webp), `(${out.width}x${out.height})`);
    } catch (e) {
      fail += 1;
      console.error('FAIL', png, e.message);
    }
  }

  console.log(JSON.stringify({ ok, fail, total: pngs.length }));
  if (fail > 0) process.exit(1);
}

main();
