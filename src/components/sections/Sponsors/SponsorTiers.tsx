import type { Sponsor, SponsorTier } from '../../../types';
import { Sticker } from '../../ui/Sticker';
import './Sponsors.css';

interface SponsorTierProps {
  tier: SponsorTier;
  sponsors: Sponsor[];
  prominence?: 'high' | 'medium' | 'low';
}

export function SponsorTierBox({
  tier,
  sponsors,
  prominence = 'medium',
}: SponsorTierProps) {
  return (
    <article
      className={`sponsor-box sponsor-box--${prominence}`}
      aria-labelledby={`sponsor-tier-${tier.id}`}
    >
      <header className="sponsor-box__header">
        <h3 id={`sponsor-tier-${tier.id}`}>{tier.label}</h3>
        <p className="text-muted">{tier.description}</p>
      </header>
      <div className="sponsor-box__stickers">
        {sponsors.length === 0 ? (
          <p className="sponsor-box__empty text-muted">Sponsors coming soon.</p>
        ) : (
          sponsors.map((sponsor) => (
            <Sticker
              key={sponsor.id}
              name={sponsor.name}
              href={sponsor.websiteUrl}
              rotation={sponsor.optionalStickerRotation}
            >
              <img src={sponsor.logo} alt={sponsor.imageAlt} loading="lazy" />
            </Sticker>
          ))
        )}
      </div>
    </article>
  );
}
