import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, type Transition } from 'motion/react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { siteContent } from '../../../data/siteContent';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import StickerPeel from '../../ui/StickerPeel/StickerPeel';
import './Hero.css';

gsap.registerPlugin(SplitText);

const easeOut = [0.22, 1, 0.36, 1] as const;
const BASE_FONT_SIZE = 100;
const TITLE_HOLD_MS = 9000;
const TITLE_HOLD_FIRST_MS = 20000;
const TITLE_SHUFFLE_MS = 800;
/** Extra sharpness headroom on top of the viewport fit scale. */
const FIT_SUPER_SAMPLE = 1.25;

/** Slightly tighter than the font default. */
const LETTER_SPACING_EM = -0.03;

function measureInk(text: string, fontFamily: string, fontSize: number) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { width: fontSize * text.length * 0.6, height: fontSize };
  }

  ctx.font = `400 ${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.75;
  const descent = metrics.actualBoundingBoxDescent || fontSize * 0.15;
  const gaps = Math.max(Array.from(text).length - 1, 0);
  const tracking = fontSize * LETTER_SPACING_EM * gaps;

  return {
    width: Math.max(metrics.width + tracking, 1),
    /* Slight bottom slack so scaled glyphs aren't clipped. */
    height: Math.max(ascent + descent, 1) * 1.06,
  };
}

/**
 * Scale each line to fill its row using the font’s natural spacing/kerning.
 * Each line stretches to the full hero width; fit locks after measure so
 * SplitText cannot remasure and jump the width mid-transition.
 */
function TitleLine({
  text,
  maxUnitWidth,
  onFit,
}: {
  text: string;
  maxUnitWidth: number;
  onFit?: () => void;
}) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const fittedRef = useRef(false);
  const lockedRef = useRef(false);
  const onFitRef = useRef(onFit);
  onFitRef.current = onFit;
  const [fit, setFit] = useState({
    x: 1,
    y: 1,
    inkW: 100,
    inkH: 100,
    fontSize: BASE_FONT_SIZE,
  });

  useLayoutEffect(() => {
    fittedRef.current = false;
    lockedRef.current = false;
  }, [text]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const word = wordRef.current;
    if (!frame || !word) return;

    const measure = () => {
      /* SplitText mutates the word DOM — remasuring would change inkW/scaleX. */
      if (lockedRef.current || word.querySelector('.hero__split-word')) {
        return;
      }

      const family =
        getComputedStyle(frame).fontFamily || 'Brigends, sans-serif';
      const unit = measureInk(text, family, BASE_FONT_SIZE);
      const refWidth = Math.max(unit.width, maxUnitWidth);
      const fitX = frame.clientWidth / refWidth;
      const fitY = frame.clientHeight / unit.height;
      const dpr = Math.min(
        typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
        2,
      );
      const renderMul = Math.min(
        Math.max(fitX, fitY, 1) * dpr * FIT_SUPER_SAMPLE,
        28,
      );
      const fontSize = BASE_FONT_SIZE * renderMul;

      word.style.fontSize = `${fontSize}px`;
      word.style.letterSpacing = `${LETTER_SPACING_EM}em`;

      /* Canvas ink only — scrollWidth shifts after SplitText wraps the word. */
      const ink = measureInk(text, family, fontSize);
      const inkW = Math.max(ink.width, 1);
      const inkH = Math.max(ink.height, 1);

      setFit({
        /* Stretch each line to the full hero width. */
        x: frame.clientWidth / inkW,
        /* Keep a hair of room so the bottom row isn’t clipped by rounding */
        y: (frame.clientHeight / inkH) * 0.98,
        inkW,
        inkH,
        fontSize,
      });
    };

    const run = () => {
      measure();
      void document.fonts.ready.then(() => {
        measure();
        if (!fittedRef.current) {
          fittedRef.current = true;
          lockedRef.current = true;
          onFitRef.current?.();
        }
      });
    };

    run();
    const observer = new ResizeObserver(() => {
      /* Allow remasure on real frame resize only (unlock briefly). */
      if (word.querySelector('.hero__split-word')) return;
      lockedRef.current = false;
      measure();
      lockedRef.current = true;
    });
    observer.observe(frame);
    document.fonts.addEventListener?.('loadingdone', run);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener?.('loadingdone', run);
    };
  }, [text, maxUnitWidth]);

  return (
    <span ref={frameRef} className="hero__title-line">
      <span
        className="hero__title-scaler"
        style={{
          width: fit.inkW,
          height: fit.inkH,
          transform: `scale(${fit.x}, ${fit.y})`,
        }}
      >
        <span
          ref={wordRef}
          className="hero__title-word"
          style={{
            fontSize: fit.fontSize,
            letterSpacing: `${LETTER_SPACING_EM}em`,
          }}
        >
          {text}
        </span>
      </span>
    </span>
  );
}

export function Hero() {
  const { hero } = siteContent;
  const reduced = usePrefersReducedMotion();
  const hasGear = Boolean(hero.gearSrc.trim());
  const cycles =
    hero.titleCycles?.length > 0
      ? hero.titleCycles
      : [hero.titleLines as [string, string, string]];
  const [cycleIndex, setCycleIndex] = useState(0);
  const [, setFitTick] = useState(0);
  const cycleRef = useRef<HTMLSpanElement>(null);
  const fitGateRef = useRef({ cycle: 0, count: 0 });

  const activeLines = cycles[cycleIndex] ?? hero.titleLines;

  if (fitGateRef.current.cycle !== cycleIndex) {
    fitGateRef.current = { cycle: cycleIndex, count: 0 };
  }

  const linesReady =
    fitGateRef.current.cycle === cycleIndex &&
    fitGateRef.current.count >= activeLines.length;

  /* Widest line across every phrase — keeps all cycles on the same width scale. */
  const maxUnitWidth = (() => {
    let max = 1;
    const family = 'Brigends, sans-serif';
    for (const cycle of cycles) {
      for (const line of cycle) {
        const { width } = measureInk(line, family, BASE_FONT_SIZE);
        if (width > max) max = width;
      }
    }
    return max;
  })();

  /* SplitText word shuffle once TitleLine scales are applied. */
  useLayoutEffect(() => {
    const root = cycleRef.current;
    if (!root || reduced) {
      root?.classList.remove('hero__title-cycle--pending');
      return;
    }
    if (!linesReady) return;

    const wordEls = root.querySelectorAll('.hero__title-word');
    if (!wordEls.length) {
      root.classList.remove('hero__title-cycle--pending');
      return;
    }

    const split = SplitText.create(wordEls, {
      type: 'words',
      tag: 'span',
      wordsClass: 'hero__split-word',
    });

    /* Prime off-state before first paint so full text never flashes. */
    gsap.set(split.words, {
      x: () => gsap.utils.random(-80, 80),
      y: () => gsap.utils.random(-40, 40),
      autoAlpha: 0,
      rotation: () => gsap.utils.random(-12, 12),
      force3D: true,
    });
    root.classList.remove('hero__title-cycle--pending');

    const tween = gsap.to(split.words, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      rotation: 0,
      stagger: { each: 0.1, from: 'start' },
      duration: 0.95,
      ease: 'power3.out',
      force3D: true,
    });

    return () => {
      tween.kill();
      gsap.killTweensOf(split.words);
      /* Skip revert — remount handles cleanup; revert flashes unsplit text. */
    };
  }, [cycleIndex, reduced, linesReady]);

  useEffect(() => {
    if (reduced || cycles.length <= 1) return;

    let alive = true;
    let timeoutId = 0;
    let currentIndex = 0;

    const schedule = () => {
      const hold =
        currentIndex === 0 ? TITLE_HOLD_FIRST_MS : TITLE_HOLD_MS;

      timeoutId = window.setTimeout(() => {
        if (!alive) return;

        const root = cycleRef.current;
        const words = root?.querySelectorAll('.hero__split-word, .hero__title-word');

        const advance = () => {
          if (!alive) return;
          currentIndex = (currentIndex + 1) % cycles.length;
          setCycleIndex(currentIndex);
          schedule();
        };

        if (!words?.length) {
          advance();
          return;
        }

        gsap.to(words, {
          x: () => gsap.utils.random(-80, 80),
          y: () => gsap.utils.random(-40, 40),
          autoAlpha: 0,
          rotation: () => gsap.utils.random(-12, 12),
          stagger: { each: 0.06, from: 'end' },
          duration: TITLE_SHUFFLE_MS / 1000,
          ease: 'power2.in',
          force3D: true,
          onComplete: advance,
        });
      }, hold);
    };

    schedule();
    return () => {
      alive = false;
      window.clearTimeout(timeoutId);
    };
  }, [reduced, cycles.length]);

  const fade = (delay: number) => {
    if (reduced) {
      return {};
    }
    const transition: Transition = {
      duration: 0.55,
      delay,
      ease: easeOut,
    };
    return {
      initial: { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
      transition,
    };
  };

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      {hasGear ? (
        <div className="hero__gear" aria-hidden="true">
          <motion.img
            className="hero__gear-img"
            src={hero.gearSrc}
            alt=""
            animate={reduced ? undefined : { rotate: 360 }}
            transition={
              reduced
                ? undefined
                : { duration: 28, ease: 'linear', repeat: Infinity }
            }
          />
        </div>
      ) : null}

      <div className="hero__inner">
        <div className="hero__title-block">
          <h1 id="hero-title" className="hero__title" aria-label={activeLines.join(' ')}>
            <span
              key={cycleIndex}
              ref={cycleRef}
              className={
                reduced
                  ? 'hero__title-cycle'
                  : 'hero__title-cycle hero__title-cycle--pending'
              }
            >
              {activeLines.map((line, i) => (
                <span key={`${cycleIndex}-${i}`} className="hero__title-slot">
                  <TitleLine
                    text={line}
                    maxUnitWidth={maxUnitWidth}
                    onFit={() => {
                      if (fitGateRef.current.cycle !== cycleIndex) return;
                      fitGateRef.current.count += 1;
                      setFitTick((n) => n + 1);
                    }}
                  />
                </span>
              ))}
            </span>
          </h1>

          <motion.p className="hero__meta" {...fade(0.22)}>
            {hero.eventDate} @ {hero.eventLocation}
          </motion.p>
        </div>

        {hero.stickers.length > 0 ? (
          <motion.ul className="hero__stickers" aria-label="Quick links" {...fade(0.32)}>
            {hero.stickers.map((sticker) => {
              const href = sticker.href?.trim() ?? '';
              const peel = (
                <StickerPeel
                  imageSrc={sticker.image}
                  alt={sticker.imageAlt}
                  accentColor={sticker.accentColor}
                  underlineStyle={sticker.underlineStyle}
                  underlineFullWidth={sticker.id === 'sticker-board'}
                  className="hero__sticker-peel"
                />
              );

              return (
                <li
                  key={sticker.id}
                  className={`hero__sticker${
                    sticker.id === 'sticker-board'
                      ? ' hero__sticker--xlarge'
                      : sticker.id === 'sticker-participant' || sticker.id === 'sticker-rooms'
                        ? ' hero__sticker--larger'
                        : sticker.id === 'sticker-judge'
                          ? ' hero__sticker--medium'
                          : ''
                  }`}
                  style={{ '--sticker-angle': `${sticker.rotation}deg` } as CSSProperties}
                >
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer" aria-label={sticker.name}>
                      {peel}
                    </a>
                  ) : (
                    <div className="hero__sticker-static" aria-label={sticker.name} role="img">
                      {peel}
                    </div>
                  )}
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </div>
    </section>
  );
}
