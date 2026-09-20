import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { siteContent } from '../../../data/siteContent';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import StickerPeel from '../../ui/StickerPeel/StickerPeel';
import './Hero.css';

const easeOut = [0.22, 1, 0.36, 1] as const;
const easeIn = [0.55, 0, 1, 0.45] as const;
const BASE_FONT_SIZE = 100;
const TITLE_HOLD_MS = 9000;
const TITLE_HOLD_FIRST_MS = 20000;
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
    /* Extra bottom slack so scaled glyphs aren't clipped. */
    height: Math.max(ascent + descent, 1) * 1.1,
  };
}

/**
 * Scale each line to fill its row using the font’s natural spacing/kerning.
 */
function TitleLine({
  text,
  maxUnitWidth,
}: {
  text: string;
  maxUnitWidth: number;
}) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [fit, setFit] = useState({
    x: 1,
    y: 1,
    inkW: 100,
    inkH: 100,
    fontSize: BASE_FONT_SIZE,
  });

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const word = wordRef.current;
    if (!frame || !word) return;

    const measure = () => {
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
      const inkW = Math.max(word.scrollWidth, measureInk(text, family, fontSize).width, 1);
      const inkH = Math.max(word.scrollHeight, measureInk(text, family, fontSize).height, 1);

      setFit({
        x: frame.clientWidth / inkW,
        y: frame.clientHeight / inkH,
        inkW,
        inkH,
        fontSize,
      });
    };

    const run = () => {
      measure();
      void document.fonts.ready.then(measure);
    };

    run();
    const observer = new ResizeObserver(run);
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

  const activeLines = cycles[cycleIndex] ?? hero.titleLines;

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
        currentIndex = (currentIndex + 1) % cycles.length;
        setCycleIndex(currentIndex);
        schedule();
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
            <AnimatePresence mode="wait">
              <motion.span
                key={cycleIndex}
                className="hero__title-cycle"
                initial={reduced ? false : { y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={
                  reduced
                    ? undefined
                    : {
                        y: '-110%',
                        opacity: 0,
                        transition: { duration: 0.7, ease: easeIn },
                      }
                }
                transition={{ duration: 0.85, ease: easeOut }}
              >
                {activeLines.map((line, i) => (
                  <span key={i} className="hero__title-slot">
                    <TitleLine text={line} maxUnitWidth={maxUnitWidth} />
                  </span>
                ))}
              </motion.span>
            </AnimatePresence>
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
