import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import './Polaroid.css';

interface PolaroidProps {
  image: string;
  imageAlt: string;
  caption?: string;
  rotation?: number;
  className?: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
  interactive?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
  tabIndex?: number;
  'aria-label'?: string;
}

export function Polaroid({
  image,
  imageAlt,
  caption,
  rotation = 0,
  className = '',
  style,
  loading = 'lazy',
  interactive = true,
  highlighted = false,
  onClick,
  tabIndex,
  'aria-label': ariaLabel,
}: PolaroidProps) {
  const reduced = usePrefersReducedMotion();
  const motionProps = {
    className: `polaroid ${highlighted ? 'polaroid--highlighted' : ''} ${className}`.trim(),
    style: { ...style, '--polaroid-rotation': `${rotation}deg` } as CSSProperties,
    initial: false as const,
    whileHover:
      interactive && !reduced
        ? { y: -6, rotate: 0, scale: 1.03, zIndex: 20 }
        : undefined,
    whileFocus:
      interactive && !reduced
        ? { y: -4, rotate: 0, scale: 1.02, zIndex: 20 }
        : undefined,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  };

  const frame = (
    <div className="polaroid__frame">
      <img src={image} alt={imageAlt} loading={loading} decoding="async" />
      {caption ? <p className="polaroid__caption">{caption}</p> : null}
    </div>
  );

  if (onClick) {
    return (
      <motion.button type="button" onClick={onClick} tabIndex={tabIndex} aria-label={ariaLabel} {...motionProps}>
        {frame}
      </motion.button>
    );
  }

  return (
    <motion.div tabIndex={tabIndex} aria-label={ariaLabel} {...motionProps}>
      {frame}
    </motion.div>
  );
}
