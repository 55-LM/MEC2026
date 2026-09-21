import type { AboutChapter, AboutScrollPhoto, SiteContent } from '../types';

/**
 * Central site copy and configuration.
 * Update placeholders with official event details as they become available.
 * Leave registrationUrl / social hrefs empty to hide those links.
 */

/** Full About polaroid album (event photos in `public/images/about`). */
const ABOUT_ALBUM = [
  '_MG_8334.jpg',
  '_MG_8339.jpg',
  '_MG_8347.jpg',
  '_MG_8350.jpg',
  '_MG_8352.jpg',
  '_MG_8368.jpg',
  '_MG_8376.jpg',
  '_MG_8380.jpg',
  '_MG_8394.jpg',
  '_MG_8414.jpg',
  '_MG_8487.jpg',
  '_MG_8488.jpg',
  '_MG_8498.jpg',
  '_MG_8507.jpg',
  '_MG_8525.jpg',
  '_MG_8570.jpg',
  '_MG_8576.jpg',
  '_MG_8582.jpg',
  '_MG_8592.jpg',
  '_MG_8658.jpg',
  '_MG_8666.jpg',
  '_MG_8671.jpg',
  '_MG_8694.jpg',
  '_MG_8794.jpg',
  '_MG_8899.jpg',
  '_MG_8916.jpg',
  '_MG_8921.jpg',
  '_MG_9076.jpg',
] as const;

const POLAROID_ROTATIONS = [-5, 4, -3, 6, -4, 3, -2, 5] as const;

function buildAlbumPhotos(files: readonly string[]): AboutScrollPhoto[] {
  return files.map((file, i) => {
    // Cycle frames 1–8, but use frame 1 wherever frame 5 would appear
    let frame = (i % 8) + 1;
    if (frame === 5) frame = 1;
    return {
      id: `about-album-${file.replace(/\.[^.]+$/, '')}`,
      photo: `/images/about/${file}`,
      photoAlt: 'Moment from a previous Metropolitan Engineering Competition',
      frame: `/images/about/polaroid-frame-${frame}.png`,
      rotation: POLAROID_ROTATIONS[i % POLAROID_ROTATIONS.length],
    };
  });
}

const ABOUT_CHAPTERS: AboutChapter[] = [
  {
    id: 'what-is-mec',
    title: 'What is MEC?',
    titleSticker: '/images/about/What is MEC Sticker.png',
    body: 'The Metropolitan Engineering Competition (MEC) is a two-day event where over 400 students take on real-world engineering challenges.',
  },
  {
    id: 'the-competition',
    title: 'The Competition',
    titleSticker: '/images/about/The Competitions Sticker.png',
    body: 'Students enter one of 9 categories, each designed to test creativity, teamwork, and technical skill.',
  },
  {
    id: 'earn-your-spot',
    title: 'Earn Your Spot',
    titleSticker: '/images/about/Earn Your Spot Sticker.png',
    body: 'The top team from each category move on to represent Toronto Metropolitan University at the Ontario Engineering Competition (OEC).',
  },
  {
    id: 'beyond-the-competition',
    title: 'Beyond the Competition',
    titleSticker: '/images/about/Beyond the Competition Sticker.png',
    body: 'MEC also connects students with industry professionals through networking, sponsor showcases, and judging sessions.',
  },
];


export const siteContent: SiteContent = {
  siteName: 'Metropolitan Engineering Competition',
  shortName: 'MEC',
  logoSrc: '/images/hero/HeaderIcon.png',
  logoAlt: 'Metropolitan Engineering Competition logo',

  navLinks: [
    { id: 'about', label: 'About', href: '#about' },
    { id: 'competitions', label: 'Competitions', href: '#competitions' },
    { id: 'sponsors', label: 'Sponsors', href: '#sponsors' },
    { id: 'faq', label: 'FAQ', href: '#faq' },
    { id: 'chairs', label: 'Chairs', href: '#chairs' },
    { id: 'team', label: 'Meet the Team', href: '#team' },
  ],

  hero: {
    logoSrc: '/images/mec-logo.svg',
    logoAlt: 'Metropolitan Engineering Competition logo',
    title: 'Metropolitan Engineering Competition',
    titleLines: ['MET', 'ENG', 'COMP'],
    titleCycles: [
      ['MET', 'ENG', 'COMP'],
      ['COLLABORATE', 'CREATE', 'COMPETE'],
      ['DREAM', 'DESIGN', 'DELIVER'],
      ['IMAGINE', 'INNOVATE', 'IMPLEMENT'],
    ],
    gearSrc: '/images/hero/MECHeroGear.png',
    gearAlt: '',
    supportingStatement:
      'A two-day engineering competition where students tackle real challenges through innovation, teamwork, and problem-solving.',
    description:
      'Nine competition streams. One weekend. Winners advance to the Ontario Engineering Competition.',
    eventDate: 'NOVEMBER 7 & 8, 2026',
    eventLocation: 'GEORGE VARI ENGINEERING & COMPUTING CENTRE',
    registrationUrl: '',
    primaryCtaLabel: 'Register Now',
    secondaryCtaLabel: 'Explore Competitions',
    secondaryCtaHref: '#competitions',
    optionalLinkLabel: '',
    optionalLinkHref: '',
    stickers: [
      {
        id: 'sticker-rulebook',
        name: 'Rulebook',
        image: '/images/hero/Rulebook Sticker.png',
        imageAlt: 'Rulebook sticker',
        rotation: -7,
        accentColor: '#e8c547',
        underlineStyle: 'single',
        href: '',
      },
      {
        id: 'sticker-schedule',
        name: 'Schedule',
        image: '/images/hero/Schedule Sticker.png',
        imageAlt: 'Schedule sticker',
        rotation: 5,
        accentColor: '#5b9fd4',
        underlineStyle: 'multi',
        href: '',
      },
      {
        id: 'sticker-judge',
        name: 'MEC Judge Portal',
        image: '/images/hero/MEC Judge Portal Sticker.png',
        imageAlt: 'MEC Judge Portal sticker',
        rotation: -3,
        accentColor: '#e87a5b',
        underlineStyle: 'double',
        href: '',
      },
      {
        id: 'sticker-participant',
        name: 'Participant Portal',
        image: '/images/hero/Participant Portal Sticker.png',
        imageAlt: 'Participant Portal sticker',
        rotation: 8,
        accentColor: '#6bcb8a',
        underlineStyle: 'loop',
        href: '',
      },
      {
        id: 'sticker-rooms',
        name: 'Room Assignments',
        image: '/images/hero/Room Assignments Sticker.png',
        imageAlt: 'Room Assignments sticker',
        rotation: -5,
        accentColor: '#c084fc',
        underlineStyle: 'cross',
        href: '',
      },
      {
        id: 'sticker-shop',
        name: 'MEC Shop',
        image: '/images/hero/MEC Shop Sticker.png',
        imageAlt: 'MEC Shop sticker',
        rotation: 4,
        accentColor: '#f472b6',
        underlineStyle: 'scribble',
        href: '',
      },
      {
        id: 'sticker-board',
        name: 'View Board Competition',
        image: '/images/hero/View Board Competition Sticker.png',
        imageAlt: 'View Board Competition sticker',
        rotation: -6,
        accentColor: '#38bdf8',
        underlineStyle: 'wave',
        href: '',
      },
    ],
  },

  about: {
    heading: 'About MEC',
    intro:
      'The Metropolitan Engineering Competition brings together engineering students for an intensive two-day experience built around creativity, collaboration, and technical excellence.',
    experience:
      'Participants compete across diverse challenge formats that test design thinking, communication, and engineering fundamentals — from on-the-spot problem solving to longer-form project work.',
    streamsNote:
      'MEC features nine competition streams, giving students space to find a challenge that matches their strengths and interests.',
    oecNote:
      'Top performers earn the opportunity to advance to the Ontario Engineering Competition (OEC).',
  },

  aboutAlbumPhotos: buildAlbumPhotos(ABOUT_ALBUM),
  aboutChapters: ABOUT_CHAPTERS,

  aboutPhotos: [
    {
      id: 'about-1',
      image: '/images/about/_MG_8334.jpg',
      imageAlt: 'Photo from a previous MEC event',
      optionalCaption: 'Past MEC',
      optionalRotation: -6,
      optionalPositioning: { top: '4%', left: '6%', zIndex: 2 },
    },
    {
      id: 'about-2',
      image: '/images/about/_MG_8368.jpg',
      imageAlt: 'Students collaborating at MEC',
      optionalCaption: 'Teamwork',
      optionalRotation: 4,
      optionalPositioning: { top: '18%', right: '8%', zIndex: 3 },
    },
    {
      id: 'about-3',
      image: '/images/about/_MG_8488.jpg',
      imageAlt: 'Competition presentation at MEC',
      optionalCaption: 'Presentations',
      optionalRotation: -2,
      optionalPositioning: { bottom: '8%', left: '22%', zIndex: 4 },
    },
  ],

  competitionsIntro:
    'Nine streams. Explore each competition below — rules and packages will be linked once official documents are available.',

  sponsorsIntro:
    'MEC is made possible by the support of our partners. Official sponsor names and logos will appear here as confirmations arrive.',

  faqIntro:
    'Answers to common participant questions. Official policies will replace these examples when confirmed.',

  chairsIntro:
    'Meet the event chairs leading MEC. Have a question? Send it through the form below.',

  teamIntro:
    'The organizing committee behind MEC — students building an experience for students.',

  footer: {
    description:
      'Metropolitan Engineering Competition — engineering challenges, teamwork, and innovation.',
    copyright: `© ${new Date().getFullYear()} Metropolitan Engineering Competition. All rights reserved.`,
  },

  socialLinks: [
    {
      id: 'instagram',
      label: 'Instagram',
      href: '',
      icon: 'instagram',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: '',
      icon: 'linkedin',
    },
  ],
};
