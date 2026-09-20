import { teamMembers } from '../../../data/team';
import { siteContent } from '../../../data/siteContent';
import { SectionContainer } from '../../layout/SectionContainer';
import { SectionHeading } from '../../ui/SectionHeading';
import { TeamCarousel } from './TeamCarousel';
import './Team.css';

export function Team() {
  return (
    <SectionContainer id="team" className="team">
      <div className="team__layout">
        <div className="team__intro">
          <SectionHeading
            eyebrow="Organizing committee"
            title="Meet the Team"
            description={siteContent.teamIntro}
          />
        </div>
        <div className="team__carousel-wrap">
          <TeamCarousel members={teamMembers} />
        </div>
      </div>
    </SectionContainer>
  );
}
