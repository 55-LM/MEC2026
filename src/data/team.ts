import type { TeamMember } from '../types';

/** "Meet the Team" title stickers, shown side by side in one row. */
export const teamTitleStickers = [
  {
    id: 'meet',
    src: '/images/team/MeetSticker.webp',
    alt: 'Meet',
    width: 531,
    height: 286,
  },
  {
    id: 'the',
    src: '/images/team/TheSticker.webp',
    alt: 'The',
    width: 448,
    height: 286,
  },
  {
    id: 'team',
    src: '/images/team/TeamSticker.webp',
    alt: 'Team',
    width: 543,
    height: 286,
  },
] as const;

/** George Vari Engineering & Computing Centre — the gears roll out from behind it. */
export const teamBuilding = {
  image: '/images/team/GVEngBuilding-1600.webp',
  /** Same art at higher resolutions; the browser picks one for the screen. */
  sources: [
    { src: '/images/team/GVEngBuilding-1600.webp', width: 1600 },
    { src: '/images/team/GVEngBuilding-2400.webp', width: 2400 },
    { src: '/images/team/GVEngBuilding-3600.webp', width: 3600 },
  ],
  imageAlt: 'George Vari Engineering and Computing Centre',
  width: 1600,
  height: 1227,
} as const;

/** Gear photo at `public/images/team/gears/<first-last>.webp`. */
function member(name: string, role: string): TeamMember {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    id: `team-${slug}`,
    name,
    role,
    image: `/images/team/gears/${slug}.webp`,
    imageAlt: `${name}, ${role}`,
  };
}

/**
 * Coordinators on the gear carousel, in scroll order
 * (vice presidents first, then coordinators A–Z).
 */
export const teamMembers: TeamMember[] = [
  member('Alvi Alam', 'Vice President Marketing'),
  member('Anastasia Trivanovic', 'Vice President External'),
  member('Krishiv Kanendran', 'Vice President Competition'),
  member('Mahdi Siddique', 'Vice President Competition'),
  member('Nithusha Ketheeswaran', 'Vice President Logistics'),
  member('Ramil Soni', 'Vice President Sponsorship'),
  member('Rishabh Mistry', 'Vice President Logistics'),
  member('Alliyah Davy', 'Competition Coordinator'),
  member('Amartya Mishra', 'Competition Coordinator'),
  member('Ashkan Raeissian', 'Competition Coordinator'),
  member('Ashvin Cashinathan', 'Competition Coordinator'),
  member('Bruntha Gnaneswaran', 'Sponsorship Coordinator'),
  member('Dev Bhavsar', 'Competition Coordinator'),
  member('Dulmi Wickramasinghe', 'Logistics Coordinator'),
  member('Emily Lam', 'Logistics Coordinator'),
  member('Esraa Kamakh', 'External Coordinator'),
  member('Faheema Malik', 'Logistics Coordinator'),
  member('Hamza Rashid', 'Competition Coordinator'),
  member('Hassan Akbar', 'Competition Coordinator'),
  member('Jason Raie', 'Competition Coordinator'),
  member('Karina Erlan', 'Competition Coordinator'),
  member('Karunya Purohit', 'Marketing Coordinator'),
  member('Labib Islam', 'External Coordinator'),
  member('Lakshmi Thusu', 'Marketing Coordinator'),
  member('Martina Mora', 'Logistics Coordinator'),
  member('Mbambe Moukoko', 'Logistics Coordinator'),
  member('Melina Nazari', 'Competition Coordinator'),
  member('Mirushan Manokaran', 'Sponsorship Coordinator'),
  member('Negara Habiba Neha', 'Competition Coordinator'),
  member('Ragave Sharma', 'Competition Coordinator'),
  member('Rameesha Khan', 'Logistics Coordinator'),
  member('Sajantan Srivel', 'Competition Coordinator'),
  member('Sam George', 'Competition Coordinator'),
  member('Samrudh Suryanarayan', 'Competition Coordinator'),
  member('Shaqis Mohammed', 'External Coordinator'),
  member('Tiffany Cao', 'Competition Coordinator'),
  member('Uzair Mohamady', 'Marketing Coordinator'),
  member('Zahin Bhuiyan', 'Competition Coordinator'),
  member('Zahra Soni', 'Competition Coordinator'),
  member('Zaid Haque', 'Marketing Coordinator'),
  member('Zion Daniel', 'Logistics Coordinator'),
];
