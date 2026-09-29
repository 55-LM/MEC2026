import type { Sponsor, SponsorTier } from '../types';

/** Stacked title stickers above the sponsor boxes. */
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

/**
 * Tier boxes only for now — add sponsors as stickers later via `sponsors`.
 * Order: Principle (top) → Impact → Network (lowest).
 */
export const sponsorTiers: SponsorTier[] = [
  {
    id: 'tier1',
    label: 'Principle Partners',
    boxImage: '/images/sponsors/PrinciplePartnerBox.webp',
    boxImageAlt: 'Principle Partners open box',
  },
  {
    id: 'tier2',
    label: 'Impact Partners',
    boxImage: '/images/sponsors/ImpactPartnerBox.webp',
    boxImageAlt: 'Impact Partners open box',
  },
  {
    id: 'tier3',
    label: 'Network Partners',
    boxImage: '/images/sponsors/NetworkPartnerBox.webp',
    boxImageAlt: 'Network Partners open box',
  },
];

/** Empty until sponsor stickers are placed on the boxes. */
export const sponsors: Sponsor[] = [];
