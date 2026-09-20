import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import './Sticker.css';

interface StickerProps {
  children: ReactNode;
  href?: string;
  name: string;
  rotation?: number;
  className?: string;
}

export function Sticker({
  children,
  href,
  name,
  rotation = 0,
  className = '',
}: StickerProps) {
  const reduced = usePrefersReducedMotion();
  const style = { '--sticker-rotation': `${rotation}deg` } as CSSProperties;
  const hover = reduced ? undefined : { y: -4, rotate: 0, scale: 1.04 };

  const inner = (
    <motion.span
      className={`sticker ${className}`.trim()}
      style={style}
      whileHover={hover}
      whileFocus={hover}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="sticker__surface">{children}</span>
      <span className="sr-only">{name}</span>
    </motion.span>
  );

  if (href?.trim()) {
    return (
      <a
        className="sticker-link"
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Visit ${name}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <span className="sticker-link sticker-link--static" aria-label={name}>
      {inner}
    </span>
  );
}
