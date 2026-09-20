/** Shared TypeScript interfaces for MEC website content. */

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  /** lucide icon name key used by Footer */
  icon: 'instagram' | 'linkedin' | 'twitter' | 'youtube' | 'facebook' | 'globe';
}

export interface HeroSticker {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  rotation: number;
  /** Hover underline stroke colour */
  accentColor: string;
  /** Hand-drawn underline variant */
  underlineStyle:
    | 'single'
    | 'multi'
    | 'double'
    | 'loop'
    | 'scribble'
    | 'cross'
    | 'vee'
    | 'wave'
    | 'zigzag'
    | 'thinLoop';
  /** Optional link; empty string = non-clickable */
  href?: string;
}

export interface HeroContent {
  logoSrc: string;
  logoAlt: string;
  title: string;
  /** Large stacked display lines shown in the Hero (e.g. MET / ENG / COMP) */
  titleLines: string[];
  /** Rotating hero headlines — each entry is three stacked lines */
  titleCycles: [string, string, string][];
  gearSrc: string;
  gearAlt: string;
  supportingStatement: string;
  description: string;
  /** Placeholder until official date is confirmed */
  eventDate: string;
  /** Placeholder until official venue is confirmed */
  eventLocation: string;
  /** Empty string hides the Register button link behaviour */
  registrationUrl: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  /** Empty string hides the optional link */
  optionalLinkLabel: string;
  optionalLinkHref: string;
  stickers: HeroSticker[];
}

export interface AboutContent {
  heading: string;
  intro: string;
  experience: string;
  streamsNote: string;
  oecNote: string;
}

export interface AboutPolaroidWindow {
  /** Native frame pixel size */
  frameW: number;
  frameH: number;
  /** Photo cutout inside the frame (below tape / white top bezel) */
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface AboutScrollPhoto {
  id: string;
  photo: string;
  photoAlt: string;
  frame: string;
  rotation?: number;
  /** Exact cutout for this frame asset; keeps the photo inside the opening */
  window?: AboutPolaroidWindow;
}

/** Chapter copy that fades in along the About collage scroll */
export interface AboutChapter {
  id: string;
  title: string;
  /** Sticker image used instead of plain title text */
  titleSticker: string;
  body: string;
}

export interface AboutPhoto {
  id: string;
  image: string;
  imageAlt: string;
  optionalCaption?: string;
  optionalRotation?: number;
  optionalPositioning?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    zIndex?: number;
  };
}

export interface Competition {
  id: string;
  name: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  icon: string;
  accentColor: string;
  documentOneLabel: string;
  documentOneUrl: string;
  documentTwoLabel: string;
  documentTwoUrl: string;
}

export type SponsorTierId = 'tier1' | 'tier2' | 'tier3';

export interface SponsorTier {
  id: SponsorTierId;
  label: string;
  description: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  websiteUrl: string;
  tier: SponsorTierId;
  imageAlt: string;
  optionalStickerRotation?: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Chair {
  id: string;
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  shortBio: string;
  optionalSocialLink?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  optionalSocialLink?: string;
}

export interface FooterContent {
  description: string;
  copyright: string;
}

export interface SiteContent {
  siteName: string;
  shortName: string;
  logoSrc: string;
  logoAlt: string;
  navLinks: NavLink[];
  hero: HeroContent;
  about: AboutContent;
  aboutPhotos: AboutPhoto[];
  /** Continuous polaroid collage for the About horizontal scroll */
  aboutAlbumPhotos: AboutScrollPhoto[];
  /** Chapter text waypoints shown while scrolling the collage */
  aboutChapters: AboutChapter[];
  competitionsIntro: string;
  sponsorsIntro: string;
  faqIntro: string;
  chairsIntro: string;
  teamIntro: string;
  footer: FooterContent;
  socialLinks: SocialLink[];
}

export interface QuestionFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type FormSubmissionResult =
  | { ok: true }
  | { ok: false; error: string; unavailable?: boolean };
