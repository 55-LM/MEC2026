import { competitions } from '../../../data/competitions';
import { siteContent } from '../../../data/siteContent';
import { SectionContainer } from '../../layout/SectionContainer';
import { SectionHeading } from '../../ui/SectionHeading';
import { CompetitionCard } from './CompetitionCard';
import './Competitions.css';

export function Competitions() {
  return (
    <SectionContainer id="competitions" className="competitions">
      <SectionHeading
        eyebrow="Nine streams"
        title="Competitions"
        description={siteContent.competitionsIntro}
      />
      <div className="competitions__grid">
        {competitions.map((competition) => (
          <CompetitionCard key={competition.id} competition={competition} />
        ))}
      </div>
    </SectionContainer>
  );
}
