import { sponsorTiers, sponsorTitleStickers } from '../../../data/sponsors';
import { siteContent } from '../../../data/siteContent';
import { SectionContainer } from '../../layout/SectionContainer';
import { SponsorTierBox } from './SponsorTiers';
import './Sponsors.css';

/** Principle + Network left; Impact right (near page edges). */
const tierAlign: Record<string, 'left' | 'right'> = {
  tier1: 'left',
  tier2: 'right',
  tier3: 'left',
};

export function Sponsors() {
  return (
    <SectionContainer id="sponsors" className="sponsors">
      <header className="sponsors__title">
        <h2 className="sponsors__title-sr">Our Sponsors</h2>
        <div className="sponsors__title-stickers" aria-hidden="true">
          {sponsorTitleStickers.map((sticker, index) => (
            <img
              key={sticker.id}
              className={`sponsors__title-sticker sponsors__title-sticker--${index + 1}`}
              src={sticker.src}
              alt=""
              draggable={false}
            />
          ))}
        </div>
        <div className="sponsors__intro">
          {siteContent.sponsorsIntro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="sponsors__intro-text">
              {paragraph}
            </p>
          ))}
        </div>
      </header>

      <div className="sponsors__stage">
        <div className="sponsors__boxes">
          {sponsorTiers.map((tier) => (
            <SponsorTierBox
              key={tier.id}
              tier={tier}
              align={tierAlign[tier.id] ?? 'left'}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
