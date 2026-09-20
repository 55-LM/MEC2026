import { useId, useMemo, type CSSProperties } from 'react';
import {
  UNDERLINE_STYLES,
  type UnderlineStyle,
} from './underlineStyles';
import './StickerPeel.css';

export interface StickerPeelProps {
  imageSrc: string;
  width?: number;
  className?: string;
  alt?: string;
  accentColor?: string;
  underlineStyle?: UnderlineStyle;
  /** Stretch underline to the full sticker width (no side inset). */
  underlineFullWidth?: boolean;
}

interface CSSVars extends CSSProperties {
  '--sticker-width'?: string;
  '--sticker-accent'?: string;
}

/** Sticker image with sketched marker underline on hover. */
export default function StickerPeel({
  imageSrc,
  width,
  className = '',
  alt = '',
  accentColor = '#e8c547',
  underlineStyle = 'single',
  underlineFullWidth = false,
}: StickerPeelProps) {
  const uid = useId().replace(/:/g, '');
  const filterId = `sketch-${uid}`;
  const paths = UNDERLINE_STYLES[underlineStyle];

  const cssVars: CSSVars = useMemo(() => {
    const vars: CSSVars = {
      '--sticker-accent': accentColor,
    };
    if (width != null) {
      vars['--sticker-width'] = `${width}px`;
    }
    return vars;
  }, [width, accentColor]);

  return (
    <span
      className={`sticker-peel${underlineFullWidth ? ' sticker-peel--full-underline' : ''} ${className}`.trim()}
      style={cssVars}
    >      <img
        src={imageSrc}
        alt={alt}
        className="sticker-image"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />

      <svg
        className="sticker-stroke"
        viewBox="0 0 300 32"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
            x="-12%"
            y="-60%"
            width="124%"
            height="220%"
            filterUnits="objectBoundingBox"
          >
            {/* Soft hand-drawn wobble */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035 0.08"
              numOctaves="2"
              seed="11"
              result="wobble"
            />
            {/* Light marker tooth */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="3"
              result="grain"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="wobble"
              scale="2.2"
              xChannelSelector="R"
              yChannelSelector="G"
              result="warped"
            />
            <feDisplacementMap
              in="warped"
              in2="grain"
              scale="0.7"
              xChannelSelector="B"
              yChannelSelector="R"
              result="textured"
            />
            <feGaussianBlur in="textured" stdDeviation="0.2" />
          </filter>
        </defs>

        <g filter={`url(#${filterId})`} className="sticker-stroke__group">
          {paths.map((path, i) => (
            <path
              key={`${underlineStyle}-${i}`}
              className="sticker-stroke__draw"
              d={path.d}
              fill="none"
              pathLength={1}
              style={{
                strokeWidth: path.strokeWidth ?? 2.2,
                opacity: path.opacity ?? 1,
              }}
            />
          ))}
        </g>
      </svg>
    </span>
  );
}

export type { UnderlineStyle };
