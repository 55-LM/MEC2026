import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from '../../../data/siteContent';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import type { AboutPolaroidWindow, AboutScrollPhoto } from '../../../types';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Exact photo cutouts per frame asset (native px).
 * Tops sit just below the white top bezel so photos don’t show through the tape.
 * Bottom margin is 269px on every frame.
 */
const FRAME_WINDOWS: Record<string, AboutPolaroidWindow> = {
  '/images/about/polaroid-frame-1.png': {
    frameW: 1066,
    frameH: 1409,
    left: 50,
    top: 156,
    width: 965,
    height: 984,
  },
  '/images/about/polaroid-frame-2.png': {
    frameW: 1066,
    frameH: 1371,
    left: 50,
    top: 116,
    width: 965,
    height: 986,
  },
  '/images/about/polaroid-frame-3.png': {
    frameW: 1066,
    frameH: 1411,
    left: 50,
    top: 156,
    width: 965,
    height: 986,
  },
  '/images/about/polaroid-frame-4.png': {
    frameW: 1066,
    frameH: 1392,
    left: 50,
    top: 151,
    width: 965,
    height: 972,
  },
  '/images/about/polaroid-frame-5.png': {
    frameW: 1066,
    frameH: 1418,
    left: 50,
    top: 176,
    width: 965,
    height: 973,
  },
  '/images/about/polaroid-frame-6.png': {
    frameW: 1066,
    frameH: 1387,
    left: 50,
    top: 131,
    width: 965,
    height: 987,
  },
  '/images/about/polaroid-frame-7.png': {
    frameW: 1066,
    frameH: 1395,
    left: 50,
    top: 141,
    width: 965,
    height: 985,
  },
  '/images/about/polaroid-frame-8.png': {
    frameW: 1066,
    frameH: 1390,
    left: 50,
    top: 141,
    width: 965,
    height: 980,
  },
};

const DEFAULT_WINDOW: AboutPolaroidWindow = FRAME_WINDOWS['/images/about/polaroid-frame-1.png'];

/** Vertical rhythm for the collage (biased upward). */
const COLLAGE_OFFSETS = [
  '0.15rem',
  '-1.55rem',
  '0.55rem',
  '-1.15rem',
  '0.85rem',
  '-1.9rem',
  '0.1rem',
  '-1.35rem',
  '0.65rem',
  '-0.95rem',
  '0.95rem',
  '-1.45rem',
];

function FramedPolaroid({
  photo,
  className = '',
  style,
}: {
  photo: AboutScrollPhoto;
  className?: string;
  style?: CSSProperties;
}) {
  const win = photo.window ?? FRAME_WINDOWS[photo.frame] ?? DEFAULT_WINDOW;

  return (
    <div className={`about-polaroid-slot ${className}`.trim()} style={style}>
      <figure
        className="about-polaroid"
        style={
          {
            '--polaroid-tilt': `${photo.rotation ?? 0}deg`,
            '--frame-w': win.frameW,
            '--frame-h': win.frameH,
            '--window-left': win.left,
            '--window-top': win.top,
            '--window-w': win.width,
            '--window-h': win.height,
          } as CSSProperties
        }
      >
        <img
          className="about-polaroid__photo"
          src={photo.photo}
          alt={photo.photoAlt}
          loading="lazy"
          decoding="async"
        />
        <span className="about-polaroid__fx" aria-hidden="true" />
        <img
          className="about-polaroid__frame"
          src={photo.frame}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </figure>
    </div>
  );
}

/** Resting size of each stacked title sticker (each one larger than the last). */
const STICKER_SIZES = ['72%', '94%', '100%', '128%'] as const;
const STICKER_MAX_HEIGHTS = ['11rem', '13.5rem', '14rem', '17.5rem'] as const;

/** Slight sticker tilts for the stacked title pile */
const STICKER_TILTS = [-7, 5, -4, 8] as const;

export function About() {
  const { aboutAlbumPhotos, aboutChapters } = siteContent;
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reduced || aboutAlbumPhotos.length === 0) return;

    const ctx = gsap.context(() => {
      const stickers = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll('.about-scroll__sticker-slot'),
      );
      const bodies = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll('.about-scroll__chapter'),
      );
      const count = Math.max(stickers.length, 1);

      const getTravel = () => Math.max(track.scrollWidth - window.innerWidth, 0);

      const applyProgress = (progress: number) => {
        gsap.set(track, { x: -getTravel() * progress });

        stickers.forEach((sticker, index) => {
          if (index === 0) {
            gsap.set(sticker, { autoAlpha: 1, scale: 1, y: 0, rotate: 0 });
            sticker.classList.add('is-on');
            return;
          }

          // Slap on across the scroll — earlier stickers land sooner
          const appearAt = (index / count) * 0.82;
          const t = gsap.utils.clamp(0, 1, (progress - appearAt) / 0.1);
          const e = 1 - (1 - t) ** 3;

          gsap.set(sticker, {
            autoAlpha: t,
            scale: gsap.utils.interpolate(1.4, 1, e),
            y: gsap.utils.interpolate(-56, 0, e),
            rotate: gsap.utils.interpolate(index % 2 === 0 ? -14 : 14, 0, e),
          });
          sticker.classList.toggle('is-on', t > 0.15);
        });

        bodies.forEach((body, index) => {
          const start = (index / count) * 0.82;
          const end =
            index === count - 1 ? 1.01 : ((index + 1) / count) * 0.82;
          const fade = 0.07;
          let opacity = 0;
          let y = 14;

          if (progress >= start && progress < start + fade) {
            const t = (progress - start) / fade;
            opacity = t;
            y = 14 * (1 - t);
          } else if (progress >= start + fade && progress < end - fade) {
            opacity = 1;
            y = 0;
          } else if (progress >= end - fade && progress < end) {
            const t = (progress - (end - fade)) / fade;
            opacity = 1 - t;
            y = -10 * t;
          } else if (index === count - 1 && progress >= start) {
            opacity = 1;
            y = 0;
          }

          gsap.set(body, { autoAlpha: opacity, y });
        });
      };

      // Initial state
      applyProgress(0);

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(getTravel(), window.innerHeight) * 1.2}`,
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyProgress(self.progress),
        onRefresh: (self) => applyProgress(self.progress),
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    const raf = window.requestAnimationFrame(refresh);
    const timer = window.setTimeout(refresh, 500);
    window.addEventListener('load', refresh);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, [reduced, aboutAlbumPhotos.length, aboutChapters.length]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about${reduced ? ' about--static' : ''}`}
      aria-label="About MEC"
    >
      {/* Shared film-grain + warmth filter for polaroid photos */}
      <svg className="about-polaroid-filter" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="about-polaroid-vintage"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              seed="7"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.55
                      0 0 0 0 0.5
                      0 0 0 0 0.4
                      0 0 0 0.4 0"
              result="grain"
            />
            <feBlend in="SourceGraphic" in2="grain" mode="overlay" result="grained" />
            <feComponentTransfer in="grained">
              <feFuncR type="linear" slope="1.05" intercept="0.015" />
              <feFuncG type="linear" slope="1.02" intercept="0.008" />
              <feFuncB type="linear" slope="0.97" intercept="0" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <div className="about-scroll">
        <div className="about-scroll__copy">
          <div className="about-scroll__sticker-stack" aria-hidden={reduced ? undefined : true}>
            {aboutChapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="about-scroll__sticker-slot"
                style={
                  {
                    zIndex: index + 1,
                    '--sticker-tilt': `${STICKER_TILTS[index % STICKER_TILTS.length]}deg`,
                    '--sticker-size': STICKER_SIZES[index % STICKER_SIZES.length],
                    '--sticker-max-h': STICKER_MAX_HEIGHTS[index % STICKER_MAX_HEIGHTS.length],
                  } as CSSProperties
                }
              >
                <img
                  className="about-scroll__title-sticker"
                  src={chapter.titleSticker}
                  alt={reduced ? chapter.title : ''}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          <div className="about-scroll__bodies" aria-live="polite">
            {aboutChapters.map((chapter) => (
              <div key={chapter.id} className="about-scroll__chapter">
                <h2 className="about-scroll__title-sr">{chapter.title}</h2>
                <p className="about-scroll__body">{chapter.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div ref={trackRef} className="about-scroll__track">
          <div className="about-scroll__collage">
            {aboutAlbumPhotos.map((photo, index) => (
              <FramedPolaroid
                key={photo.id}
                photo={photo}
                style={
                  {
                    '--collage-offset': COLLAGE_OFFSETS[index % COLLAGE_OFFSETS.length],
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
