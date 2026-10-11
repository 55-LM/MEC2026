import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import './GridBackground.css';

/** Label every N grid cells. */
const MAJOR_EVERY = 5;

interface RulerLayout {
  width: number;
  height: number;
  cell: number;
  /** Last whole grid row (from the top) at the page bottom — the ruler origin. */
  baseRow: number;
}

/** Track page size + grid cell so ruler ticks sit exactly on grid lines. */
function useRulerLayout(): RulerLayout | null {
  const [layout, setLayout] = useState<RulerLayout | null>(null);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    let frame = 0;
    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const cell =
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--grid-size'),
          ) || 32;
        const width = root.clientWidth;
        const height = root.scrollHeight;
        const baseRow = Math.floor(height / cell);
        setLayout((prev) =>
          prev &&
          prev.width === width &&
          prev.height === height &&
          prev.cell === cell &&
          prev.baseRow === baseRow
            ? prev
            : { width, height, cell, baseRow },
        );
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener('resize', measure);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return layout;
}

/** Page height between construction-line groups — scales with width so slopes match. */
const guideBand = (width: number) => Math.max(520, width * 0.76);

/** Small seeded PRNG so the guide layout is the same on every load. */
function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Faint dashed diagonals rising left → right plus large soft arcs, scattered
 * down the page like construction lines on drafting paper.
 */
function PageGuides({ width, height }: { width: number; height: number }) {
  const paths = useMemo(() => {
    const rand = seeded(2026);
    const between = (min: number, max: number) => min + rand() * (max - min);
    const out: { d: string; dashed: boolean }[] = [];
    const GUIDE_BAND = guideBand(width);
    const bands = Math.max(Math.ceil(height / GUIDE_BAND), 1);

    for (let i = 0; i < bands; i += 1) {
      const top = i * GUIDE_BAND;

      /* Dashed diagonal with a gentle bow, edge to edge (ends run off the page sides) */
      const x0 = -0.05 * width;
      const y0 = top + between(0.7, 1.05) * GUIDE_BAND;
      const x1 = 1.05 * width;
      const y1 = y0 - between(0.35, 0.6) * GUIDE_BAND;
      const cx = x0 + (x1 - x0) * 0.55;
      const cy = Math.max(y0, y1) - Math.abs(y0 - y1) * between(0.35, 0.55);
      out.push({ d: `M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}`, dashed: true });

      /* Large soft arc sweeping edge to edge (ends run off the page sides) */
      const ax = -0.05 * width;
      const ay = top + between(0.05, 0.45) * GUIDE_BAND;
      const bx = 1.05 * width;
      const by = ay + between(0.45, 1) * GUIDE_BAND;
      const radius = between(1, 1.6) * Math.max(width, GUIDE_BAND);
      out.push({
        d: `M${ax} ${ay} A${radius} ${radius} 0 0 ${i % 2} ${bx} ${by}`,
        dashed: false,
      });
    }
    return out;
  }, [width, height]);

  return (
    <svg
      className="page-guides"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      focusable="false"
    >
      {paths.map(({ d, dashed }, index) => (
        <path
          key={index}
          d={d}
          className={dashed ? 'page-guides__dash' : 'page-guides__arc'}
        />
      ))}
    </svg>
  );
}

/** Engineering-paper rulers on the left and bottom edges of the page. */
function PageRulers({ layout }: { layout: RulerLayout }) {
  const { width, height, cell, baseRow } = layout;

  /* Side labels count up from the page bottom; skip the 0 at the corner. */
  const sideLabels: { value: number; y: number }[] = [];
  for (let value = MAJOR_EVERY; value <= baseRow; value += MAJOR_EVERY) {
    sideLabels.push({ value, y: (baseRow - value) * cell });
  }

  const bottomLabels: { value: number; x: number }[] = [];
  /* Keep a cell of room at the right edge so the last label isn't clipped */
  const cols = Math.floor(width / cell) - 1;
  for (let value = MAJOR_EVERY; value <= cols; value += MAJOR_EVERY) {
    bottomLabels.push({ value, x: value * cell });
  }

  const style = {
    height: `${height}px`,
    '--ruler-base-y': `${baseRow * cell}px`,
  } as CSSProperties;

  return (
    <div className="page-rulers" style={style}>
      <PageGuides width={width} height={height} />
      <div className="page-ruler page-ruler--side page-ruler--left">
        {sideLabels.map(({ value, y }) => (
          <span key={value} className="page-ruler__label" style={{ top: `${y}px` }}>
            {value}
          </span>
        ))}
      </div>

      <div className="page-ruler page-ruler--bottom">
        {bottomLabels.map(({ value, x }) => (
          <span key={value} className="page-ruler__label" style={{ left: `${x}px` }}>
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Continuous engineering grid (thin lines + bold 5-cell squares), subtle static
 * noise, faint construction lines, and ruler edges (left, bottom).
 * Positioned absolutely within #root so it scrolls with page content.
 * About freezes it (position: fixed) while that section is pinned.
 * pointer-events: none so it never intercepts interaction.
 */
export function GridBackground() {
  const layout = useRulerLayout();
  /* Bold grid rows sit where the left ruler's labelled ticks are */
  const style = layout
    ? ({ '--grid-major-y': `${(layout.baseRow % MAJOR_EVERY) * layout.cell}px` } as CSSProperties)
    : undefined;

  return (
    <div className="grid-background" style={style} aria-hidden="true">
      <div className="grid-background__pattern" />
      <div className="grid-background__noise" />
      {layout ? <PageRulers layout={layout} /> : null}
    </div>
  );
}

/** Empty space at the end of the page for the bottom ruler. */
export function PageRulerSpacer() {
  return <div className="page-ruler-spacer" aria-hidden="true" />;
}
