import type { ChairsNote } from '../types';

/**
 * Co-Chairs' note — a spiral notebook with both chairs' polaroids and a
 * welcome message, shown in Meet the Team above the building.
 */
export const chairsNote: ChairsNote = {
  heading: 'A note from the Co-Chairs',
  notebookImage: '/images/team/chairs/ChairsNotebook-800.webp',
  notebookSources: [
    { src: '/images/team/chairs/ChairsNotebook-800.webp', width: 800 },
    { src: '/images/team/chairs/ChairsNotebook-1400.webp', width: 1400 },
  ],
  notebookWidth: 1400,
  notebookHeight: 1698,
  photos: [
    {
      id: 'steven-zhang',
      name: 'Steven Zhang',
      role: 'Chair',
      image: '/images/team/chairs/steven-zhang.webp',
      imageAlt: 'Steven Zhang, Chair',
      width: 640,
      height: 702,
    },
    {
      id: 'tenzin-zompa',
      name: 'Tenzin Zompa',
      role: 'Chair',
      image: '/images/team/chairs/tenzin-zompa.webp',
      imageAlt: 'Tenzin Zompa, Chair',
      width: 640,
      height: 708,
    },
  ],
  message: [
    'Hey everyone! We are Steven and Tenzin, and we’re excited to be your Co-Chairs for MEC 2026!',
    'We’re proud to be working alongside such a dedicated team to bring you an unforgettable weekend of creativity, teamwork, and engineering challenges. We’ve got so much planned and can’t wait to see your ideas come to life, meet you all, and make some great memories together!',
    'If you have any questions, feel free to reach out to us at',
  ],
  email: 'mec.chair@mues.ca',
};
