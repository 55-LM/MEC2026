import type { SponsorTier } from '../../../types';
import './Sponsors.css';

interface SponsorTierProps {
  tier: SponsorTier;
  align?: 'left' | 'right';
}

export function SponsorTierBox({ tier, align = 'left' }: SponsorTierProps) {
  return (
    <figure
      className={`sponsor-box sponsor-box--${align} sponsor-box--${tier.id}`}
      aria-label={tier.label}
    >
      <img
        className="sponsor-box__image"
        src={tier.boxImage}
        alt={tier.boxImageAlt}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}
