import type { FaqItem } from '../types';

/** Stacked title stickers that spell "Frequently Asked Questions". */
export const faqTitleStickers = [
  {
    id: 'frequently',
    src: '/images/faq/FrequentlySticker.webp',
    alt: 'Frequently',
    width: 928,
    height: 297,
  },
  {
    id: 'asked',
    src: '/images/faq/AskedSticker.webp',
    alt: 'Asked',
    width: 600,
    height: 288,
  },
  {
    id: 'questions',
    src: '/images/faq/QuestionsSticker.webp',
    alt: 'Questions',
    width: 861,
    height: 297,
  },
] as const;

/** FAQ answers carried over from the MEC 2025 website (metengcomp.ca). */
export const faqItems: FaqItem[] = [
  {
    id: 'faq-what-is-mec',
    question: 'What is the Metropolitan Engineering Competition?',
    answer:
      'MEC is TMU’s annual, two-day engineering competition run by MUES where 400+ students tackle real engineering challenges across nine categories, with judging, networking, and an awards ceremony.',
  },
  {
    id: 'faq-who-can-participate',
    question: 'Who can participate?',
    answer:
      'All TMU undergraduate engineering students are eligible to participate. However, some categories have specific eligibility requirements, such as Junior Design and Senior Design.',
  },
  {
    id: 'faq-team-size',
    question: 'How many people are on a team?',
    answer:
      'Most categories are team-based (typically 2–4 students). Exact team sizes and any exceptions will be listed in each competition category rulebook.',
  },
  {
    id: 'faq-experience',
    question: 'Do I need prior competition experience?',
    answer:
      'No. MEC is designed for first-timers and veterans alike. We provide clear problem statements and rubrics so everyone can compete confidently.',
  },
  {
    id: 'faq-categories',
    question: 'What are the competition categories?',
    answer:
      'The nine categories are: Bio-Engineering, Junior Design, Senior Design, Consulting Engineering, Programming, Engineering Communication, Parliamentary Debate, Innovative Design, and Re-engineering. More information about each category can be found in the Competitions section.',
  },
  {
    id: 'faq-format',
    question: 'What’s the format and schedule?',
    answer:
      'MEC runs in person over two days: Day 1 focuses on category briefings and hands-on build phases with submissions by day end, plus a sponsor career fair and provided meals. Day 2 features presentations to judges, Parliamentary Debate, optional workshops, and the awards and closing ceremony, with meals and dinner served.',
  },
  {
    id: 'faq-judging',
    question: 'How is each competition category judged?',
    answer:
      'Industry professionals, faculty, and alumni evaluate teams using standardized rubrics, and the rubrics and judging criteria are available in each category’s abstract PDF. The top three teams in every category earn the opportunity to represent TMU at the Ontario Engineering Competition (OEC).',
  },
  {
    id: 'faq-register',
    question: 'How do I register and what’s the deadline?',
    // Add this year's form deadline once confirmed (the 2025 form closed at 11:59 pm on November 1, 2025).
    answer:
      'Register through the official MEC team Google Form, which can be found on our Instagram or in the Competitions section of our website, and check the Competitions section for current availability and category-specific eligibility. NOTE: Only one submission per team is allowed per category.',
  },
  {
    id: 'faq-cost',
    question: 'Is there a cost to compete?',
    answer:
      'There is no cost to compete. All required tools and equipment are provided by us.',
  },
  {
    id: 'faq-bring',
    question: 'What should I bring?',
    answer:
      'Your TMU student ID, laptop, chargers, and any personal tools you prefer. MEC provides problem statements, submission templates, and any required shared materials listed in the competition abstracts.',
  },
  {
    id: 'faq-accommodations',
    question: 'Are there accessibility or academic accommodations?',
    answer:
      'Yes. MEC is committed to equal opportunity. Tell us your accommodation needs during registration and we’ll coordinate arrangements with you.',
  },
  {
    id: 'faq-sponsors',
    question: 'How can I connect with sponsors or get involved beyond competing?',
    answer:
      'Meet sponsors at the career fair and during judging sessions. For future MECs, keep an eye on our Instagram page for opportunities and how to get involved.',
  },
];
