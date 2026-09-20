import { chairs } from '../../../data/chairs';
import { siteContent } from '../../../data/siteContent';
import { SectionContainer } from '../../layout/SectionContainer';
import { SectionHeading } from '../../ui/SectionHeading';
import { ChairCard } from './ChairCard';
import { QuestionForm } from './QuestionForm';
import './Chairs.css';

export function Chairs() {
  return (
    <SectionContainer id="chairs" className="chairs">
      <SectionHeading
        eyebrow="Leadership"
        title="Meet the Chairs"
        description={siteContent.chairsIntro}
      />
      <div className="chairs__profiles">
        {chairs.map((chair, index) => (
          <ChairCard key={chair.id} chair={chair} index={index} />
        ))}
      </div>
      <div className="chairs__form-wrap">
        <h3 className="chairs__form-title">Ask the Chairs</h3>
        <p className="text-muted chairs__form-note">
          Questions are delivered once a form endpoint is configured. See README for setup.
        </p>
        <QuestionForm />
      </div>
    </SectionContainer>
  );
}
