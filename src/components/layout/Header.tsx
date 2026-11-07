import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from 'react';
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

/*
  The hero gear (wide landscape layout) spins in the top-left corner. The header row
  (logo + nav) is centred; if that would put the small logo inside the big gear's swept
  circle at the top of the page, nudge the whole row right just enough to clear it
  (capped at the right edge). Worked out for the page top only — the row stays put
  while scrolling.
*/
const HERO_GEAR_SELECTOR = '.hero__gear-img';
/** Wide-landscape layout where the header is transparent over the hero gear. */
const HERO_GEAR_LAYOUT_QUERY = '(min-width: 1025px) and (orientation: landscape)';
/** Outermost tooth tip as a fraction of the gear box half-width (asset padding). */
const HERO_GEAR_RADIUS_RATIO = 0.96;
/** Breathing room between the logo and the gear teeth, in px. */
const HERO_GEAR_CLEARANCE = 16;

function useHeaderClearOfHeroGear(
  logoRef: RefObject<HTMLElement | null>,
  navRef: RefObject<HTMLElement | null>,
) {
  // Layout effect so the first placement lands before paint (no jump on load).
  useLayoutEffect(() => {
    const mq = window.matchMedia(HERO_GEAR_LAYOUT_QUERY);
    let frame = 0;
    let applied = 0;

    const apply = (offset: number) => {
      if (offset === applied) return;
      applied = offset;
      const transform = offset ? `translateX(${offset}px)` : '';
      if (logoRef.current) logoRef.current.style.transform = transform;
      if (navRef.current) navRef.current.style.transform = transform;
    };

    const place = () => {
      frame = 0;
      const logo = logoRef.current;
      const nav = navRef.current;
      const row = logo?.parentElement;
      const gear = document.querySelector<HTMLElement>(HERO_GEAR_SELECTOR)?.parentElement;
      if (!mq.matches || !logo || !nav || !row || !gear) {
        apply(0);
        return;
      }

      // Unrotated wrapper box: the spinning art sweeps a circle around its centre.
      // Measured as if scrolled to the top (the header is sticky, so its row doesn't move).
      const g = gear.getBoundingClientRect();
      const l = logo.getBoundingClientRect();
      const cx = g.left + g.width / 2;
      const cy = g.top + window.scrollY + g.height / 2;
      const reach = (Math.min(g.width, g.height) / 2) * HERO_GEAR_RADIUS_RATIO + HERO_GEAR_CLEARANCE;

      // Closest vertical distance from the gear centre to the logo's row.
      const dy = cy < l.top ? l.top - cy : cy > l.bottom ? cy - l.bottom : 0;
      if (dy >= reach) {
        apply(0);
        return;
      }

      const clearLeft = cx + Math.sqrt(reach * reach - dy * dy);
      const naturalLeft = l.left - applied;
      const naturalRight = nav.getBoundingClientRect().right - applied;
      const maxShift = Math.max(0, row.getBoundingClientRect().right - naturalRight);
      apply(Math.round(Math.min(Math.max(0, clearLeft - naturalLeft), maxShift)));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };

    place();
    // Nav text width (and so the centred row) changes once the web fonts load.
    document.fonts?.ready.then(schedule).catch(() => {});
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    mq.addEventListener('change', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      apply(0);
      window.removeEventListener('load', schedule);
      window.removeEventListener('resize', schedule);
      mq.removeEventListener('change', schedule);
    };
  }, [logoRef, navRef]);
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const brandRef = useRef<HTMLAnchorElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useHeaderClearOfHeroGear(brandRef, endRef);

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
          ref={brandRef}
          href="#hero"
          className="site-header__brand"
          onClick={close}
          aria-label={siteContent.siteName}
        >
          <img src={siteContent.logoSrc} alt={siteContent.logoAlt} width={44} height={44} />
        </a>

        <div ref={endRef} className="site-header__end">
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
