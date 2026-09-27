import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutDay1Album, aboutDay2Album } from '../../../data/aboutMarquee';
import { siteContent } from '../../../data/siteContent';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import type { AboutPolaroidWindow, AboutScrollPhoto } from '../../../types';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const COMPACT_ABOUT_MQ = '(max-width: 1024px), (orientation: portrait)';

/** Build a long single-row marquee for phones / portrait / narrow screens. */
function buildCompactAlbum(): AboutScrollPhoto[] {
  const base = [...aboutDay1Album, ...aboutDay2Album];
  if (base.length === 0) return base;
  /* Two full passes — dense enough without an endless scrub. */
  const loops = 2;
  return Array.from({ length: loops }, (_, loop) =>
    base.map((photo) => ({
      ...photo,
      id: `${photo.id}__compact-${loop}`,
    })),
  ).flat();
}

/** Single-row collage on phones / portrait. */
function useCompactAboutLayout() {
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(COMPACT_ABOUT_MQ).matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia(COMPACT_ABOUT_MQ);
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return compact;
}

/**
 * Exact photo cutouts per frame asset (native px).
 * Tops sit just below the white top bezel so photos don’t show through the tape.
 * Bottom margin is 269px on every frame.
 */
const FRAME_WINDOWS: Record<string, AboutPolaroidWindow> = {
  '/images/about/polaroid-frame-1.webp': {
    frameW: 1066,
    frameH: 1409,
    left: 50,
    top: 156,
    width: 965,
    height: 984,
  },
  '/images/about/polaroid-frame-2.webp': {
    frameW: 1066,
    frameH: 1371,
    left: 50,
    top: 116,
    width: 965,
    height: 986,
  },
  '/images/about/polaroid-frame-3.webp': {
    frameW: 1066,
    frameH: 1411,
    left: 50,
    top: 156,
    width: 965,
    height: 986,
  },
  '/images/about/polaroid-frame-4.webp': {
    frameW: 1066,
    frameH: 1392,
    left: 50,
    top: 151,
    width: 965,
    height: 972,
  },
  '/images/about/polaroid-frame-6.webp': {
    frameW: 1066,
    frameH: 1387,
    left: 50,
    top: 131,
    width: 965,
    height: 987,
  },
  '/images/about/polaroid-frame-7.webp': {
    frameW: 1066,
    frameH: 1395,
    left: 50,
    top: 141,
    width: 965,
    height: 985,
  },
  '/images/about/polaroid-frame-8.webp': {
    frameW: 1066,
    frameH: 1390,
    left: 50,
    top: 141,
    width: 965,
    height: 980,
  },
};

const DEFAULT_WINDOW: AboutPolaroidWindow = FRAME_WINDOWS['/images/about/polaroid-frame-1.webp'];

/** Vertical rhythm for the collage (biased upward). */
const COLLAGE_OFFSETS = [
  '0.08rem',
  '-0.55rem',
  '0.25rem',
  '-0.4rem',
  '0.35rem',
  '-0.65rem',
  '0.05rem',
  '-0.45rem',
  '0.3rem',
  '-0.35rem',
  '0.4rem',
  '-0.5rem',
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
        <div className="about-polaroid__window">
          <img
            className="about-polaroid__photo"
            src={photo.photo}
            alt={photo.photoAlt}
            loading="lazy"
            decoding="async"
          />
          <span className="about-polaroid__fx" aria-hidden="true" />
        </div>
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
const STICKER_SIZES = ['68%', '82%', '94%', '125%'] as const;
const STICKER_MAX_HEIGHTS = ['7.75rem', '9.25rem', '10.25rem', '14rem'] as const;

/** Slight sticker tilts for the stacked title pile */
const STICKER_TILTS = [-7, 5, -4, 3] as const;

export function About() {
  const { aboutChapters } = siteContent;
  const reduced = usePrefersReducedMotion();
  const compact = useCompactAboutLayout();
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const row1Album = useMemo(
    () => (compact ? buildCompactAlbum() : aboutDay1Album),
    [compact],
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (
      !section ||
      !row1 ||
      reduced ||
      aboutDay1Album.length === 0 ||
      (!compact && aboutDay2Album.length === 0) ||
      (!compact && !row2)
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const stickers = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll('.about-scroll__sticker-slot'),
      );
      const bodies = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll('.about-scroll__chapter'),
      );
      const count = Math.max(stickers.length, 1);

      const getTravel = (el: HTMLElement | null) => {
        if (!el || getComputedStyle(el).display === 'none') return 0;
        const clip = el.parentElement?.clientWidth ?? window.innerWidth;
        const collage = el.querySelector(
          '.about-scroll__collage',
        ) as HTMLElement | null;
        const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
        const contentW = collage?.scrollWidth ?? el.scrollWidth;
        /*
          Stop when the last photo hits the right edge — do NOT include
          padding-right or the scrub keeps going after images are gone.
        */
        return Math.max(padLeft + contentW - clip, 0);
      };

      /* Shared travel so pin end and x-transform stay locked together. */
      let compactPin = 0;
      const refreshCompactTravel = () => {
        const travel = getTravel(row1);
        /*
          Long enough to feel paced, shorter than the full strip so it
          doesn’t drag after the photos.
        */
        compactPin = Math.min(travel, window.innerHeight * 5.25);
        return compactPin;
      };
      if (compact) refreshCompactTravel();

      const applyProgress = (progress: number) => {
        const travel1 = compact
          ? compactPin || refreshCompactTravel()
          : getTravel(row1);
        const travel2 = compact ? 0 : getTravel(row2);

        /*
          Compact: move only `compactPin` of the strip so images and scrub
          finish together when the shorter pin ends.
        */
        const imgProgress = compact ? progress : Math.pow(progress, 1.15);
        const textSpan = compact ? 0.52 : 0.68;
        const stickerFade = compact ? 0.07 : 0.1;
        const bodyFade = compact ? 0.05 : 0.07;

        gsap.set(row1, { x: -travel1 * imgProgress });
        if (row2 && !compact) {
          gsap.set(row2, { x: -travel2 * (1 - imgProgress) });
        }

        stickers.forEach((sticker, index) => {
          if (index === 0) {
            gsap.set(sticker, { autoAlpha: 1, scale: 1, y: 0, rotate: 0 });
            sticker.classList.add('is-on');
            return;
          }

          const appearAt = (index / count) * textSpan;
          const t = gsap.utils.clamp(0, 1, (progress - appearAt) / stickerFade);
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
          const start = (index / count) * textSpan;
          const end =
            index === count - 1 ? 1.01 : ((index + 1) / count) * textSpan;
          let opacity = 0;
          let y = 14;

          if (progress >= start && progress < start + bodyFade) {
            const t = (progress - start) / bodyFade;
            opacity = t;
            y = 14 * (1 - t);
          } else if (progress >= start + bodyFade && progress < end - bodyFade) {
            opacity = 1;
            y = 0;
          } else if (progress >= end - bodyFade && progress < end) {
            const t = (progress - (end - bodyFade)) / bodyFade;
            opacity = 1 - t;
            y = -10 * t;
          } else if (index === count - 1 && progress >= start) {
            opacity = 1;
            y = 0;
          }

          gsap.set(body, { autoAlpha: opacity, y });
        });
      };

      applyProgress(0);

      const grid = document.querySelector<HTMLElement>('.grid-background');
      const freezeGrid = (self: ScrollTrigger) => {
        if (!grid) return;
        gsap.set(grid, { y: self.scroll() - self.start });
      };
      const releaseGrid = () => {
        if (!grid) return;
        gsap.set(grid, { y: 0 });
      };

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => {
          const travel = Math.max(
            getTravel(row1),
            compact ? 0 : getTravel(row2),
          );
          if (compact) {
            return `+=${Math.max(refreshCompactTravel(), 1)}`;
          }
          return `+=${Math.max(travel, window.innerHeight) * 1.2}`;
        },
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          applyProgress(self.progress);
          freezeGrid(self);
        },
        onRefresh: (self) => {
          if (compact) refreshCompactTravel();
          applyProgress(self.progress);
          if (self.isActive) freezeGrid(self);
          else releaseGrid();
        },
        onLeave: releaseGrid,
        onLeaveBack: releaseGrid,
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    const raf = window.requestAnimationFrame(refresh);
    const timer = window.setTimeout(refresh, 500);
    const timer2 = window.setTimeout(refresh, 1500);
    window.addEventListener('load', refresh);

    /* Recalc travel once polaroids finish decoding (scrollWidth grows). */
    const imgs = row1.querySelectorAll('img');
    const onImg = () => refresh();
    imgs.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', onImg);
        img.addEventListener('error', onImg);
      }
    });

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.clearTimeout(timer2);
      window.removeEventListener('load', refresh);
      imgs.forEach((img) => {
        img.removeEventListener('load', onImg);
        img.removeEventListener('error', onImg);
      });
      const grid = document.querySelector<HTMLElement>('.grid-background');
      if (grid) gsap.set(grid, { y: 0 });
      ctx.revert();
    };
  }, [reduced, aboutChapters.length, compact, row1Album]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about${reduced ? ' about--static' : ''}${compact ? ' about--compact' : ''}`}
      aria-label="About MEC"
    >
      {/* Shared film-grain + warmth filter for polaroid photos */}
      <svg className="about-polaroid-filter" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="about-polaroid-vintage"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
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

        <div className="about-scroll__rows" aria-label="Photos from previous MEC events">
          <div ref={row1Ref} className="about-scroll__track about-scroll__track--row1">
            <div className="about-scroll__collage">
              {row1Album.map((photo, index) => (
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

          {!compact ? (
            <div ref={row2Ref} className="about-scroll__track about-scroll__track--row2">
              <div className="about-scroll__collage">
                {aboutDay2Album.map((photo, index) => (
                  <FramedPolaroid
                    key={photo.id}
                    photo={photo}
                    style={
                      {
                        '--collage-offset': COLLAGE_OFFSETS[(index + 3) % COLLAGE_OFFSETS.length],
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
