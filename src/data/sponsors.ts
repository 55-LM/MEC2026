import type { Sponsor, SponsorTier } from '../types';

/**
 * Sponsorship tier labels are placeholders until official names are confirmed.
 * Move sponsors between tiers by changing the `tier` field only.
 */
export const sponsorTiers: SponsorTier[] = [
  {
    id: 'tier1',
    label: '[PLACEHOLDER: Tier 1]',
    description: 'Premier partners supporting MEC.',
  },
  {
    id: 'tier2',
    label: '[PLACEHOLDER: Tier 2]',
    description: 'Key sponsors powering the competition experience.',
  },
  {
    id: 'tier3',
    label: '[PLACEHOLDER: Tier 3]',
    description: 'Supporting organizations and community partners.',
  },
];

export const sponsors: Sponsor[] = [
  {
    id: 'sp-1',
    name: '[PLACEHOLDER: Sponsor A]',
    logo: '/images/sponsors/sponsor-a.svg',
    websiteUrl: '',
    tier: 'tier1',
    imageAlt: 'Placeholder logo for Sponsor A',
    optionalStickerRotation: -4,
  },
  {
    id: 'sp-2',
    name: '[PLACEHOLDER: Sponsor B]',
    logo: '/images/sponsors/sponsor-b.svg',
    websiteUrl: '',
    tier: 'tier1',
    imageAlt: 'Placeholder logo for Sponsor B',
    optionalStickerRotation: 3,
  },
  {
    id: 'sp-3',
    name: '[PLACEHOLDER: Sponsor C]',
    logo: '/images/sponsors/sponsor-c.svg',
    websiteUrl: '',
    tier: 'tier2',
    imageAlt: 'Placeholder logo for Sponsor C',
    optionalStickerRotation: -2,
  },
  {
    id: 'sp-4',
    name: '[PLACEHOLDER: Sponsor D]',
    logo: '/images/sponsors/sponsor-d.svg',
    websiteUrl: '',
    tier: 'tier2',
    imageAlt: 'Placeholder logo for Sponsor D',
    optionalStickerRotation: 5,
  },
  {
    id: 'sp-5',
    name: '[PLACEHOLDER: Sponsor E]',
    logo: '/images/sponsors/sponsor-e.svg',
    websiteUrl: '',
    tier: 'tier2',
    imageAlt: 'Placeholder logo for Sponsor E',
    optionalStickerRotation: -6,
  },
  {
    id: 'sp-6',
    name: '[PLACEHOLDER: Sponsor F]',
    logo: '/images/sponsors/sponsor-f.svg',
    websiteUrl: '',
    tier: 'tier3',
    imageAlt: 'Placeholder logo for Sponsor F',
    optionalStickerRotation: 2,
  },
  {
    id: 'sp-7',
    name: '[PLACEHOLDER: Sponsor G]',
    logo: '/images/sponsors/sponsor-g.svg',
    websiteUrl: '',
    tier: 'tier3',
    imageAlt: 'Placeholder logo for Sponsor G',
    optionalStickerRotation: -3,
  },
  {
    id: 'sp-8',
    name: '[PLACEHOLDER: Sponsor H]',
    logo: '/images/sponsors/sponsor-h.svg',
    websiteUrl: '',
    tier: 'tier3',
    imageAlt: 'Placeholder logo for Sponsor H',
    optionalStickerRotation: 4,
  },
];
