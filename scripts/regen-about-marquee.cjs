const fs = require('fs');
const path = require('path');

function list(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.webp'))
    .sort((a, b) => {
      const na = Number((a.match(/\((\d+)of/) || [0, 0])[1]);
      const nb = Number((b.match(/\((\d+)of/) || [0, 0])[1]);
      return na - nb;
    });
}

const day1 = list(path.join('public', 'images', 'about', 'Day_1'));
const day2 = list(path.join('public', 'images', 'about', 'Day_2'));

function entries(files, day, folder) {
  return files
    .map((f) => {
      const id = f
        .replace(/\.[^.]+$/, '')
        .replace(/[^\w]+/g, '-')
        .replace(/^-|-$/g, '');
      const label = day === 'day1' ? 'Day 1' : 'Day 2';
      return [
        '  {',
        `    id: '${day}-${id}',`,
        `    src: '/images/about/${folder}/${f}',`,
        `    alt: 'MEC ${label} moment',`,
        '  },',
      ].join('\n');
    })
    .join('\n');
}

const out = `import type { AboutScrollPhoto } from '../types';

/** About marquee photo paths from Day_1 / Day_2 event albums. */
export interface AboutMarqueePhoto {
  id: string;
  src: string;
  alt: string;
}

export const aboutDay1Photos: AboutMarqueePhoto[] = [
${entries(day1, 'day1', 'Day_1')}
];

export const aboutDay2Photos: AboutMarqueePhoto[] = [
${entries(day2, 'day2', 'Day_2')}
];

const POLAROID_ROTATIONS = [-5, 4, -3, 6, -4, 3, -2, 5] as const;

/** Wrap marquee paths in polaroid frame metadata for the About scroll. */
export function toPolaroidAlbum(photos: AboutMarqueePhoto[]): AboutScrollPhoto[] {
  return photos.map((photo, i) => {
    let frame = (i % 8) + 1;
    if (frame === 5) frame = 1;
    return {
      id: photo.id,
      photo: photo.src,
      photoAlt: photo.alt,
      frame: \`/images/about/polaroid-frame-\${frame}.webp\`,
      rotation: POLAROID_ROTATIONS[i % POLAROID_ROTATIONS.length],
    };
  });
}

export const aboutDay1Album = toPolaroidAlbum(aboutDay1Photos);
export const aboutDay2Album = toPolaroidAlbum(aboutDay2Photos);
`;

fs.writeFileSync(path.join('src', 'data', 'aboutMarquee.ts'), out);
console.log(`Updated aboutMarquee.ts — day1=${day1.length}, day2=${day2.length}`);
