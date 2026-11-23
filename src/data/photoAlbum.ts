import type { PhotoAlbumContent } from '../types';

/**
 * MEC 2026 photo album page (/photos/).
 * Paste each day's album link into `href` — empty string = not clickable yet.
 */
export const photoAlbum: PhotoAlbumContent = {
  title: 'MEC 2026 Photo Album',
  titleImage: '/images/photos/MEC2026 Photo Album Sticker.png',
  intro: 'Pick a day to browse the photos.',
  pendingNote: 'Coming soon',
  backLabel: 'Back to home',
  days: [
    {
      id: 'day-1',
      name: 'Day 1',
      image: '/images/photos/Day 1 Sticker.png',
      imageAlt: 'Day 1 sticker',
      rotation: -4,
      accentColor: '#e8c547',
      underlineStyle: 'scribble',
      href: '',
    },
    {
      id: 'day-2',
      name: 'Day 2',
      image: '/images/photos/Day 2 Sticker.png',
      imageAlt: 'Day 2 sticker',
      rotation: 4,
      accentColor: '#5b9fd4',
      underlineStyle: 'double',
      href: '',
    },
  ],
};
