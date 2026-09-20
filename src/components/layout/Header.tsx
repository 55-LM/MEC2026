import { useEffect, useId, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { siteContent } from '../../data/siteContent';
import './Header.css';

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      className="site-header__icon-linkedin"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SocialIcon({ icon }: { icon: string }) {
  if (icon === 'instagram') return <InstagramIcon />;
  if (icon === 'linkedin') return <LinkedInIcon />;
  return null;
}

function SocialList({
  className = '',
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const socials = siteContent.socialLinks.filter(
    (link) => link.icon === 'instagram' || link.icon === 'linkedin',
  );

  return (
    <ul className={`site-header__social ${className}`.trim()} aria-label="Social media">
      {socials.map((link) => {
        const href = link.href.trim();
        const icon = <SocialIcon icon={link.icon} />;
        return (
          <li key={link.id}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                onClick={onNavigate}
              >
                {icon}
              </a>
            ) : (
              <span
                className="site-header__social-pending"
                aria-label={`${link.label} (link coming soon)`}
              >
                {icon}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <a
          href="#hero"
          className="site-header__brand"
          onClick={close}
          aria-label={siteContent.siteName}
        >
          <img src={siteContent.logoSrc} alt={siteContent.logoAlt} width={44} height={44} />
        </a>

        <div className="site-header__end">
          <nav className="site-header__nav" aria-label="Primary">
            <ul className="site-header__links">
              {siteContent.navLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
            <SocialList className="site-header__social--desktop" />
          </nav>

          <SocialList className="site-header__social--compact" />

          <button
            type="button"
            className="site-header__menu-toggle"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id={menuId}
        className={`site-header__mobile ${open ? 'is-open' : ''}`}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul>
            {siteContent.navLinks.map((link) => (
              <li key={link.id}>
                <a href={link.href} onClick={close}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <SocialList className="site-header__social--mobile" onNavigate={close} />
        </nav>
      </div>
    </header>
  );
}
