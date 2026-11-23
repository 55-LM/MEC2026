import type { PhotoAlbumContent } from '../types';

/**
 * MEC 2026 photo album page (/photos/).
 * Paste each day's album link into `href` — empty string = not clickable yet.
 */
export const photoAlbum: PhotoAlbumContent = {
  title: 'MEC 2026 Photo Album',
  pendingNote: 'Coming soon',
  backLabel: 'Back to home',
  days: [
    {
      id: 'day-1',
      name: 'Day 1',
      image: '/images/photos/Day 1 Sticker.png',
      imageAlt: 'Day 1 sticker',
      photo: '/images/photos/Day1 Photo.jpg',
      photoAlt: 'Competitors’ workspace on Day 1 with design notes on the whiteboard',
      rotation: -4,
      accentColor: '#e8c547',
      underlineStyle: 'scribble',
      href: 'https://adobe.ly/4AFBqZY',
    },
    {
      id: 'day-2',
      name: 'Day 2',
      image: '/images/photos/Day 2 Sticker.png',
      imageAlt: 'Day 2 sticker',
      photo: '/images/photos/Day2 Photo.jpg',
      photoAlt: 'Participants chatting over dinner at the Day 2 banquet',
      rotation: 4,
      accentColor: '#5b9fd4',
      underlineStyle: 'double',
      href: 'https://adobe.ly/4zBD4uM',
    },
  ],
};
