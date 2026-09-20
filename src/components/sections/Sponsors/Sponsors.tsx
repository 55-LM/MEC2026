import type { SponsorTierId } from '../../../types';
import { sponsors, sponsorTiers } from '../../../data/sponsors';
import { siteContent } from '../../../data/siteContent';
import { SectionContainer } from '../../layout/SectionContainer';
import { SectionHeading } from '../../ui/SectionHeading';
import { SponsorTierBox } from './SponsorTiers';
import './Sponsors.css';

const prominenceMap: Record<SponsorTierId, 'high' | 'medium' | 'low'> = {
  tier1: 'high',
  tier2: 'medium',
  tier3: 'low',
};

export function Sponsors() {
  return (
    <SectionContainer id="sponsors" className="sponsors">
      <SectionHeading
        eyebrow="Partners"
        title="Sponsors"
        description={siteContent.sponsorsIntro}
      />
      <div className="sponsors__boxes">
        {sponsorTiers.map((tier) => (
          <SponsorTierBox
            key={tier.id}
            tier={tier}
            prominence={prominenceMap[tier.id]}
            sponsors={sponsors.filter((s) => s.tier === tier.id)}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
