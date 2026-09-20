import { faqItems } from '../../../data/faq';
import { siteContent } from '../../../data/siteContent';
import { SectionContainer } from '../../layout/SectionContainer';
import { Accordion } from '../../ui/Accordion';
import { SectionHeading } from '../../ui/SectionHeading';
import { FAQItem } from './FAQItem';
import './FAQ.css';

/**
 * FAQ accordion — single-open by default.
 * Pass allowMultiple to Accordion for multi-open mode.
 */
export function FAQ() {
  return (
    <SectionContainer id="faq" className="faq">
      <SectionHeading
        eyebrow="Help"
        title="FAQ"
        description={siteContent.faqIntro}
      />
      <Accordion className="faq__list" allowMultiple={false}>
        {faqItems.map((item) => (
          <FAQItem key={item.id} item={item} />
        ))}
      </Accordion>
    </SectionContainer>
  );
}
