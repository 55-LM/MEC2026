import type { Competition, CompetitionDocStickers } from '../types';

/**
 * Competition streams — order matches when card art was added to
 * `public/images/competitions/`.
 * `imageScale` is locked relative fill inside the shared 6/7 frame;
 * the frame itself scales with the grid so proportions stay constant.
 * Leave document URLs empty to keep stickers non-linked.
 */
export const competitionDocStickers: CompetitionDocStickers = {
  abstractSrc: '/images/competitions/AbstractSticker.webp',
  abstractAlt: 'Abstract sticker',
  rubricSrc: '/images/competitions/RubricSticker.webp',
  rubricAlt: 'Rubric sticker',
};

export const competitions: Competition[] = [
  {
    id: 'junior-design',
    name: 'Junior Design',
    shortDescription:
      'Official description pending. This stream will highlight a distinct engineering challenge.',
    image: '/images/competitions/JuniorDesignCard.webp',
    imageAlt: 'Junior Design competition card',
    imageScale: 1.025,
    icon: 'wrench',
    accentColor: '#d4a24a',
    documentOneLabel: 'Abstract',
    documentOneUrl: '',
    documentTwoLabel: 'Rubric',
    documentTwoUrl: '',
  },
  {
    id: 'senior-design',
    name: 'Senior Design',
    shortDescription:
      'Official description pending. Participants will collaborate to solve a focused design problem.',
    image: '/images/competitions/SeniorDesignCard.webp',
    imageAlt: 'Senior Design competition card',
    imageScale: 1.025,
    icon: 'cog',
    accentColor: '#7aa2c4',
    documentOneLabel: 'Abstract',
    documentOneUrl: '',
    documentTwoLabel: 'Rubric',
    documentTwoUrl: '',
  },
  {
    id: 'consulting',
    name: 'Consulting',
    shortDescription:
      'Official description pending. Expect a challenge that balances creativity and technical rigor.',
    image: '/images/competitions/ConsultingCard.webp',
    imageAlt: 'Consulting competition card',
    imageScale: 1.025,
    icon: 'clipboard-list',
    accentColor: '#8fbf7a',
    documentOneLabel: 'Abstract',
    documentOneUrl: '',
    documentTwoLabel: 'Rubric',
    documentTwoUrl: '',
  },
  {
    id: 'programming',
    name: 'Programming',
    shortDescription:
      'Official description pending. Teams will demonstrate clear communication and engineering judgment.',
    image: '/images/competitions/ProgrammingCard.webp',
    imageAlt: 'Programming competition card',
    imageScale: 1,
    icon: 'circuit-board',
    accentColor: '#c47a8f',
    documentOneLabel: 'Abstract',
    documentOneUrl: '',
    documentTwoLabel: 'Rubric',
    documentTwoUrl: '',
  },
  {
    id: 'communication',
    name: 'Communication',
    shortDescription:
      'Official description pending. A stream oriented around iterative prototyping and testing.',
    image: '/images/competitions/CommunicationCard.webp',
    imageAlt: 'Communication competition card',
    imageScale: 1.09,
    icon: 'megaphone',
    accentColor: '#bfa06a',
    documentOneLabel: 'Abstract',
    documentOneUrl: '',
    documentTwoLabel: 'Rubric',
    documentTwoUrl: '',
  },
  {
    id: 'debate',
    name: 'Debate',
    shortDescription:
      'Official description pending. Competitors will apply fundamentals under time pressure.',
    image: '/images/competitions/DebateCard.webp',
    imageAlt: 'Debate competition card',
    imageScale: 1.06,
    icon: 'megaphone',
    accentColor: '#6ab0bf',
    documentOneLabel: 'Abstract',
    documentOneUrl: '',
    documentTwoLabel: 'Rubric',
    documentTwoUrl: '',
  },
  {
    id: 'innovative-design',
    name: 'Innovative Design',
    shortDescription:
      'Official description pending. Focus on structured analysis and defendable recommendations.',
    image: '/images/competitions/InnovativeDesignCard.webp',
    imageAlt: 'Innovative Design competition card',
    imageScale: 1.06,
    icon: 'lightbulb',
    accentColor: '#a08fc4',
    documentOneLabel: 'Abstract',
    documentOneUrl: '',
    documentTwoLabel: 'Rubric',
    documentTwoUrl: '',
  },
  {
    id: 're-engineering',
    name: 'Re-Engineering',
    shortDescription:
      'Official description pending. An opportunity to showcase innovative thinking and practical delivery.',
    image: '/images/competitions/ReEngineeringCard.webp',
    imageAlt: 'Re-Engineering competition card',
    imageScale: 1,
    icon: 'rocket',
    accentColor: '#c49a6a',
    documentOneLabel: 'Abstract',
    documentOneUrl: '',
    documentTwoLabel: 'Rubric',
    documentTwoUrl: '',
  },
  {
    id: 'bioengineering',
    name: 'Bioengineering',
    shortDescription:
      'Official description pending. The final stream completes MEC’s nine-competition lineup.',
    image: '/images/competitions/BioEngineeringCard.webp',
    imageAlt: 'Bioengineering competition card',
    imageScale: 1,
    icon: 'trophy',
    accentColor: '#e07a5f',
    documentOneLabel: 'Abstract',
    documentOneUrl: '',
    documentTwoLabel: 'Rubric',
    documentTwoUrl: '',
  },
];
