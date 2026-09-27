import type { CSSProperties } from 'react';
import { competitionDocStickers } from '../../../data/competitions';
import type { Competition } from '../../../types';
import StickerPeel from '../../ui/StickerPeel/StickerPeel';
import './Competitions.css';

interface CompetitionCardProps {
  competition: Competition;
}

function DocSticker({
  src,
  alt,
  label,
  href,
  className = '',
}: {
  src: string;
  alt: string;
  label: string;
  href: string;
  className?: string;
}) {
  const classes = `competition-card__sticker${className ? ` ${className}` : ''}`;
  const peel = (
    <StickerPeel
      imageSrc={src}
      alt={alt}
      accentColor="#ffffff"
      underlineStyle="single"
      className="competition-card__sticker-peel"
    />
  );

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
      >
        {peel}
      </a>
    );
  }

  return (
    <span className={classes} aria-label={label}>
      {peel}
    </span>
  );
}

export function CompetitionCard({ competition }: CompetitionCardProps) {
  const abstractHref = competition.documentOneUrl.trim();
  const rubricHref = competition.documentTwoUrl.trim();
  const style = {
    '--competition-card-scale': String(competition.imageScale),
  } as CSSProperties;

  return (
    <article className="competition-card" style={style}>
      <div className="competition-card__art">
        <img
          className="competition-card__art-img"
          src={competition.image}
          alt={competition.imageAlt || competition.name}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="competition-card__stickers" aria-label={`${competition.name} documents`}>
        <DocSticker
          src={competitionDocStickers.abstractSrc}
          alt={competitionDocStickers.abstractAlt}
          label={`${competition.name} ${competition.documentOneLabel}`}
          href={abstractHref}
        />
        <DocSticker
          src={competitionDocStickers.rubricSrc}
          alt={competitionDocStickers.rubricAlt}
          label={`${competition.name} ${competition.documentTwoLabel}`}
          href={rubricHref}
          className="competition-card__sticker--rubric"
        />
      </div>
    </article>
  );
}
