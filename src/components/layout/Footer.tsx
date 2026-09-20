import {
  Globe,
  Share2,
} from 'lucide-react';
import type { SocialLink } from '../../types';
import { siteContent } from '../../data/siteContent';
import './Footer.css';

function SocialIcon({ link }: { link: SocialLink }) {
  // Brand icons are not shipped in current lucide-react; use generic marks.
  if (link.icon === 'globe') return <Globe size={18} aria-hidden />;
  return <Share2 size={18} aria-hidden />;
}

export function Footer() {
  const registrationUrl = siteContent.hero.registrationUrl.trim();
  const socials = siteContent.socialLinks.filter((s) => s.href.trim());

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <img src={siteContent.logoSrc} alt="" width={48} height={48} />
          <div>
            <p className="site-footer__title">{siteContent.shortName}</p>
            <p className="site-footer__desc text-muted">{siteContent.footer.description}</p>
          </div>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          <ul>
            {siteContent.navLinks.map((link) => (
              <li key={link.id}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
            {registrationUrl ? (
              <li>
                <a href={registrationUrl} target="_blank" rel="noreferrer">
                  Register
                </a>
              </li>
            ) : null}
          </ul>
        </nav>

        {socials.length > 0 ? (
          <ul className="site-footer__social">
            {socials.map((link) => (
              <li key={link.id}>
                <a href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
                  <SocialIcon link={link} />
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="site-footer__copy text-muted">{siteContent.footer.copyright}</p>
      </div>
    </footer>
  );
}
