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

const DISPLAY_FONT = 'Brigends';
const DISPLAY_FONT_STACK = `${DISPLAY_FONT}, sans-serif`;

async function ensureDisplayFont() {
  if (typeof document === 'undefined' || !document.fonts?.load) return;
  try {
    await document.fonts.load(`400 ${BASE_FONT_SIZE}px ${DISPLAY_FONT}`);
    await document.fonts.ready;
  } catch {
    /* Measurement still proceeds with whatever is available. */
  }
}

/** Overfill so rows sit tighter than the slot bounds. */
const FIT_Y_FILL = 1.14;

function measureInk(text: string, fontFamily: string, fontSize: number) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { width: fontSize * text.length * 0.6, height: fontSize * 0.8 };
  }

  ctx.font = `400 ${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  const gaps = Math.max(Array.from(text).length - 1, 0);
  const tracking = fontSize * LETTER_SPACING_EM * gaps;
  const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.75;
  const descent = metrics.actualBoundingBoxDescent || fontSize * 0.15;

  return {
    width: Math.max(metrics.width + tracking, 1),
    height: Math.max(ascent + descent, 1),
  };
}

/** SVG getBBox width — stable horizontal fit across MET / ENG / COMP. */
function measureGlyphWidth(text: string, fontFamily: string, fontSize: number) {
  if (typeof document === 'undefined') {
    return measureInk(text, fontFamily, fontSize).width;
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.style.cssText =
    'position:absolute;left:-99999px;top:0;visibility:hidden;pointer-events:none';
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  node.setAttribute('x', '0');
  node.setAttribute('y', '0');
  node.setAttribute('font-family', fontFamily);
  node.setAttribute('font-size', String(fontSize));
  node.setAttribute('font-weight', '400');
  node.style.letterSpacing = `${LETTER_SPACING_EM}em`;
  node.textContent = text;
  svg.appendChild(node);
  document.body.appendChild(svg);
  let width = fontSize * text.length * 0.6;
  try {
    width = Math.max(node.getBBox().width, 1);
  } catch {
    width = measureInk(text, fontFamily, fontSize).width;
  }
  svg.remove();
  return width;
}

function widestUnitWidth(cycles: readonly (readonly string[])[]) {
  let max = 1;
  for (const cycle of cycles) {
    for (const line of cycle) {
      const width = measureGlyphWidth(line, DISPLAY_FONT_STACK, BASE_FONT_SIZE);
      if (width > max) max = width;
    }
  }
  return max;
}

/**
 * Stretch each line to the full row width/height so the glyphs themselves
 * grow taller — not just empty space in the title container.
 */
function TitleLine({
  text,
  maxUnitWidth,
  fontsReady,
  onFit,
}: {
  text: string;
  maxUnitWidth: number;
  fontsReady: boolean;
  onFit?: () => void;
}) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const scalerRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const fittedRef = useRef(false);
  const fitRef = useRef({
    x: 1,
    y: 1,
    inkW: 100,
    inkH: 100,
    fontSize: BASE_FONT_SIZE,
  });
  const onFitRef = useRef(onFit);
  onFitRef.current = onFit;
  const [fit, setFit] = useState(fitRef.current);

  useLayoutEffect(() => {
    fittedRef.current = false;
  }, [text, fontsReady, maxUnitWidth]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const scaler = scalerRef.current;
    const word = wordRef.current;
    if (!frame || !scaler || !word || !fontsReady || maxUnitWidth <= 1) return;

    let cancelled = false;

    const applyFit = (next: typeof fitRef.current) => {
      fitRef.current = next;
      setFit(next);
    };

    /** Full ink measure — only safe before SplitText mutates the word. */
    const measureFull = () => {
      if (word.querySelector('.hero__split-word')) return;

      const family =
        getComputedStyle(frame).fontFamily || DISPLAY_FONT_STACK;
      const unitW = measureGlyphWidth(text, family, BASE_FONT_SIZE);
      const unitH = measureInk(text, family, BASE_FONT_SIZE).height;
      const refWidth = Math.max(unitW, maxUnitWidth);
      const fitX = frame.clientWidth / refWidth;
      const fitY = frame.clientHeight / Math.max(unitH, 1);
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

      /*
        Measure the unscaled HTML word. SVG getBBox was taller than the
        painted HTML glyphs, so scale filled empty box space instead of
        making the letters taller.
      */
      const prevTransform = scaler.style.transform;
      scaler.style.transform = 'none';
      scaler.style.width = 'auto';
      scaler.style.height = 'auto';
      void word.offsetWidth;

      const inkW = Math.max(measureGlyphWidth(text, family, fontSize), 1);
      const inkH = Math.max(word.offsetHeight, 1);

      scaler.style.transform = prevTransform;

      applyFit({
        x: frame.clientWidth / inkW,
        y: (frame.clientHeight / inkH) * FIT_Y_FILL,
        inkW,
        inkH,
        fontSize,
      });
    };

    /**
     * After SplitText, remasuring the word DOM is unsafe. Re-fit using the
     * stored ink size so scale still tracks resize / orientation changes.
     */
    const measureScale = () => {
      const { inkW, inkH, fontSize } = fitRef.current;
      if (inkW <= 1 || inkH <= 1) return;

      const nextX = frame.clientWidth / inkW;
      const nextY = (frame.clientHeight / inkH) * FIT_Y_FILL;
      const prev = fitRef.current;
      if (
        Math.abs(prev.x - nextX) < 0.001 &&
        Math.abs(prev.y - nextY) < 0.001
      ) {
        return;
      }

      applyFit({
        x: nextX,
        y: nextY,
        inkW,
        inkH,
        fontSize,
      });
    };

    const run = () => {
      if (cancelled) return;
      if (word.querySelector('.hero__split-word')) {
        measureScale();
      } else {
        measureFull();
        if (!fittedRef.current) {
          fittedRef.current = true;
          onFitRef.current?.();
        }
      }
    };

    run();

    const observer = new ResizeObserver(() => {
      if (cancelled) return;
      if (word.querySelector('.hero__split-word')) {
        measureScale();
      } else {
        measureFull();
      }
    });
    observer.observe(frame);

    const onWindowResize = () => {
      if (cancelled) return;
      if (word.querySelector('.hero__split-word')) {
        measureScale();
      } else {
        measureFull();
      }
    };
    window.addEventListener('resize', onWindowResize);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('resize', onWindowResize);
    };
  }, [text, maxUnitWidth, fontsReady]);

  return (
    <span ref={frameRef} className="hero__title-line">
      <span
        ref={scalerRef}
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
  const [fontsReady, setFontsReady] = useState(false);
  const [maxUnitWidth, setMaxUnitWidth] = useState(1);
  const [, setFitTick] = useState(0);
  const cycleRef = useRef<HTMLSpanElement>(null);
  const fitGateRef = useRef({ cycle: 0, count: 0 });

  const activeLines = cycles[cycleIndex] ?? hero.titleLines;

  if (fitGateRef.current.cycle !== cycleIndex) {
    fitGateRef.current = { cycle: cycleIndex, count: 0 };
  }

  const linesReady =
    fontsReady &&
    fitGateRef.current.cycle === cycleIndex &&
    fitGateRef.current.count >= activeLines.length;

  /* Load Brigends before any title measure — cold cache uses a narrow fallback. */
  useLayoutEffect(() => {
    let cancelled = false;
    void ensureDisplayFont().then(() => {
      if (cancelled) return;
      setMaxUnitWidth(widestUnitWidth(cycles));
      setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [cycles]);

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
      /* Snap visible — killed mid-tween (Strict Mode/HMR) left words at opacity 0. */
      gsap.set(split.words, { x: 0, y: 0, autoAlpha: 1, rotation: 0 });
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
        <div className="hero__gear-stage" aria-hidden="true">
          <div className="hero__gear">
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
        </div>
      ) : null}

      <div className="hero__inner">
        <div className="hero__title-block">
          <motion.p className="hero__meta" {...fade(0.22)}>
            <span className="hero__meta-text">
              {hero.eventDate} @ {hero.eventLocation}
            </span>
          </motion.p>

          <div className="hero__title-cluster">
            <h1 id="hero-title" className="hero__title" aria-label={activeLines.join(' ')}>
              <span
                key={`fit16-${cycleIndex}`}
                ref={cycleRef}
                className={
                  reduced
                    ? 'hero__title-cycle'
                    : 'hero__title-cycle hero__title-cycle--pending'
                }
              >
                <span className="hero__title-group">
                  {activeLines.map((line, i) => (
                    <span key={`${cycleIndex}-${i}`} className="hero__title-slot">
                      <TitleLine
                        text={line}
                        maxUnitWidth={maxUnitWidth}
                        fontsReady={fontsReady}
                        onFit={() => {
                          if (fitGateRef.current.cycle !== cycleIndex) return;
                          fitGateRef.current.count += 1;
                          setFitTick((n) => n + 1);
                        }}
                      />
                    </span>
                  ))}
                </span>
              </span>
            </h1>
          </div>
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
                    sticker.id === 'sticker-shop' ? ' hero__sticker--shop' : ''
                  }${
                    sticker.id === 'sticker-rulebook' ? ' hero__sticker--rulebook' : ''
                  }${
                    sticker.id === 'sticker-schedule' ? ' hero__sticker--schedule' : ''
                  }${
                    sticker.id === 'sticker-judge' ? ' hero__sticker--judge' : ''
                  }${
                    sticker.id === 'sticker-participant' ? ' hero__sticker--participant' : ''
                  }${
                    sticker.id === 'sticker-rooms' ? ' hero__sticker--rooms' : ''
                  }${
                    sticker.id === 'sticker-board' ? ' hero__sticker--board' : ''
                  }${
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
