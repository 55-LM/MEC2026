import type { CSSProperties } from 'react';
import {
  ClipboardList,
  Cog,
  CircuitBoard,
  Lightbulb,
  Megaphone,
  Rocket,
  Timer,
  Trophy,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { Competition } from '../../../types';
import { Button } from '../../ui/Button';
import './Competitions.css';

const iconMap: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  wrench: Wrench,
  'circuit-board': CircuitBoard,
  megaphone: Megaphone,
  cog: Cog,
  timer: Timer,
  'clipboard-list': ClipboardList,
  rocket: Rocket,
  trophy: Trophy,
};

interface CompetitionCardProps {
  competition: Competition;
}

export function CompetitionCard({ competition }: CompetitionCardProps) {
  const Icon = iconMap[competition.icon] ?? Lightbulb;
  const docOne = competition.documentOneUrl.trim();
  const docTwo = competition.documentTwoUrl.trim();

  return (
    <article
      className="competition-card"
      style={{ '--card-accent': competition.accentColor } as CSSProperties}
    >
      <div className="competition-card__media">
        <img
          src={competition.image}
          alt={competition.imageAlt}
          loading="lazy"
          decoding="async"
        />
        <span className="competition-card__icon" aria-hidden>
          <Icon size={18} />
        </span>
      </div>
      <div className="competition-card__body">
        <h3>{competition.name}</h3>
        <p className="text-muted">{competition.shortDescription}</p>
        <div className="competition-card__docs">
          {docOne ? (
            <Button href={docOne} target="_blank" variant="secondary" size="sm">
              {competition.documentOneLabel}
            </Button>
          ) : (
            <Button variant="secondary" size="sm" disabled>
              {competition.documentOneLabel}
            </Button>
          )}
          {docTwo ? (
            <Button href={docTwo} target="_blank" variant="secondary" size="sm">
              {competition.documentTwoLabel}
            </Button>
          ) : (
            <Button variant="secondary" size="sm" disabled>
              {competition.documentTwoLabel}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
