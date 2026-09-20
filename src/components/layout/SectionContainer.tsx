import type { ReactNode } from 'react';
import './SectionContainer.css';

interface SectionContainerProps {
  id: string;
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div';
}

export function SectionContainer({
  id,
  children,
  className = '',
  as: Tag = 'section',
}: SectionContainerProps) {
  return (
    <Tag id={id} className={`section-container ${className}`.trim()}>
      <div className="section-container__inner">{children}</div>
    </Tag>
  );
}
