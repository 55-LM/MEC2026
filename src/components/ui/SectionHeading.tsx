import type { ReactNode } from 'react';
import './SectionHeading.css';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  children,
}: SectionHeadingProps) {
  return (
    <header className={`section-heading section-heading--${align}`}>
      {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
      <h2 className="section-heading__title">{title}</h2>
      {description ? <p className="section-heading__desc text-muted">{description}</p> : null}
      {children}
    </header>
  );
}
