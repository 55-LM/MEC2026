import type { FaqItem } from '../types';

/**
 * Example FAQ content for layout only.
 * Do not treat these answers as official competition policy.
 */
export const faqItems: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Who can participate in MEC?',
    answer:
      'Eligibility details will be published with official registration materials. Typically, MEC is open to undergraduate engineering students — confirm requirements when registration opens.',
  },
  {
    id: 'faq-2',
    question: 'How many competition streams are there?',
    answer:
      'MEC features nine competition streams. Stream names and descriptions will be updated on this site once confirmed.',
  },
  {
    id: 'faq-3',
    question: 'Do I need a team to register?',
    answer:
      'Team size and registration rules vary by stream. Official guidance will be linked from each competition card when documents are available.',
  },
  {
    id: 'faq-4',
    question: 'What happens if I win my stream?',
    answer:
      'Winners advance to the Ontario Engineering Competition (OEC). Specific advancement details will be shared by organizers.',
  },
  {
    id: 'faq-5',
    question: 'Where can I find competition rules and packages?',
    answer:
      'Each competition card includes buttons for rules and packages. Links will activate once official PDFs are uploaded.',
  },
  {
    id: 'faq-6',
    question: 'How do I contact the event chairs?',
    answer:
      'Use the question form in the Chairs section. Once a form endpoint is configured, submissions are delivered to the organizing team.',
  },
];
