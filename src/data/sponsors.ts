import type { Sponsor, SponsorBoard } from '../types';

/** Stacked title stickers above the sponsor boards. */
export const sponsorTitleStickers = [
  {
    id: 'our',
    src: '/images/sponsors/OurSticker.webp',
    alt: 'Our',
  },
  {
    id: 'sponsors',
    src: '/images/sponsors/SponsorsSticker.webp',
    alt: 'Sponsors',
  },
];

/** Two cardboard boards with sponsor stickers — first sits top-left, second lower-right. */
export const sponsorBoards: SponsorBoard[] = [
  {
    id: 'board1',
    label: 'Sponsors board one',
    imageSmall: '/images/sponsors/SponsorBoard1-900.webp',
    imageLarge: '/images/sponsors/SponsorBoard1-1600.webp',
    imageAlt:
      'Cardboard board with sponsor stickers: Toronto Metropolitan University Faculty of Engineering & Architectural Science, DMZ, Metropolitan Undergraduate Engineering Society, Innovation Boost Zone, Fujifilm, Salad King Thai Food',
    imageWidth: 1600,
    imageHeight: 1594,
  },
  {
    id: 'board2',
    label: 'Sponsors board two',
    imageSmall: '/images/sponsors/SponsorBoard2-900.webp',
    imageLarge: '/images/sponsors/SponsorBoard2-1600.webp',
    imageAlt:
      'Cardboard board with sponsor stickers: Souvenir Plus Print, Pita & Hummus, Quest Awards, Pastable, Egg Club, Professional Engineers Ontario, ThinkOn',
    imageWidth: 1600,
    imageHeight: 1594,
  },
];

/** Individual sponsor entries (logos currently live on the board photos). */
export const sponsors: Sponsor[] = [];
