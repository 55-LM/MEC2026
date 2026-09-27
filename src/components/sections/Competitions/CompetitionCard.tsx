import type { CSSProperties } from 'react';
import {
  competitionDocStickers,
  competitionMetaStickers,
} from '../../../data/competitions';
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
  accentColor,
  className = '',
}: {
  src: string;
  alt: string;
  label: string;
  href: string;
  accentColor: string;
  className?: string;
}) {
  const classes = `competition-card__sticker${className ? ` ${className}` : ''}`;
  const peel = (
    <StickerPeel
      imageSrc={src}
      alt={alt}
      accentColor={accentColor}
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

function MetaRow({
  stickerSrc,
  stickerAlt,
}: {
  stickerSrc: string;
  stickerAlt: string;
}) {
  return (
    <div className="competition-card__meta-row">
      <img
        className="competition-card__meta-label"
        src={stickerSrc}
        alt={stickerAlt}
        draggable={false}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function MetaValue({ value }: { value: string }) {
  const display = value.trim();
  if (!display) {
    return (
      <span className="competition-card__meta-value-stack competition-card__meta-value-stack--empty">
        <span className="competition-card__meta-value competition-card__meta-value--empty" />
      </span>
    );
  }

  const lines = display
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <span className="competition-card__meta-value-stack">
      {lines.map((line) => (
        <span key={line} className="competition-card__meta-value">
          <span className="competition-card__meta-value-text">{line}</span>
        </span>
      ))}
    </span>
  );
}

export function CompetitionCard({ competition }: CompetitionCardProps) {
  const abstractHref = competition.documentOneUrl.trim();
  const rubricHref = competition.documentTwoUrl.trim();
  const underlineColor = competition.metaHighlightColor?.trim() || '#ffffff';
  const style = {
    '--competition-card-scale': String(competition.imageScale),
  } as CSSProperties;

  const bodyParagraphs = competition.shortDescription
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const showBody =
    bodyParagraphs.length > 0 &&
    !competition.shortDescription.startsWith('Official description pending');

  return (
    <article
      className={`competition-card competition-card--${competition.id}`}
      style={style}
    >
      <div className="competition-card__art">
        <img
          className="competition-card__art-img"
          src={competition.image}
          alt={competition.imageAlt || competition.name}
          loading="lazy"
          decoding="async"
        />

        {showBody ? (
          <div
            className="competition-card__body"
            style={
              competition.bodyOffsetX ||
              competition.bodyOffsetY ||
              competition.bodyFontScale ||
              competition.bodyWidthScale
                ? ({
                    ...(competition.bodyOffsetX
                      ? {
                          '--competition-body-offset-x': competition.bodyOffsetX,
                        }
                      : null),
                    ...(competition.bodyOffsetY
                      ? {
                          '--competition-body-offset-y': competition.bodyOffsetY,
                        }
                      : null),
                    ...(competition.bodyFontScale
                      ? {
                          '--competition-body-font-scale': String(
                            competition.bodyFontScale,
                          ),
                        }
                      : null),
                    ...(competition.bodyWidthScale
                      ? {
                          '--competition-body-width-scale': String(
                            competition.bodyWidthScale,
                          ),
                        }
                      : null),
                  } as CSSProperties)
                : undefined
            }
          >
            {bodyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="competition-card__body-text">
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}

        <div
          className="competition-card__meta"
          aria-label={`${competition.name} details`}
          style={
            competition.metaOffsetX || competition.metaOffsetY
              ? ({
                  ...(competition.metaOffsetX
                    ? {
                        '--competition-meta-offset-x': competition.metaOffsetX,
                      }
                    : null),
                  ...(competition.metaOffsetY
                    ? {
                        '--competition-meta-offset-y': competition.metaOffsetY,
                      }
                    : null),
                } as CSSProperties)
              : undefined
          }
        >
          <div className="competition-card__meta-labels">
            <MetaRow
              stickerSrc={competitionMetaStickers.teamSizeSrc}
              stickerAlt={competitionMetaStickers.teamSizeAlt}
            />
            <MetaRow
              stickerSrc={competitionMetaStickers.workTimeSrc}
              stickerAlt={competitionMetaStickers.workTimeAlt}
            />
            <MetaRow
              stickerSrc={competitionMetaStickers.deliverablesSrc}
              stickerAlt={competitionMetaStickers.deliverablesAlt}
            />
          </div>
          {competition.teamSize.trim() ||
          competition.workTime.trim() ||
          competition.deliverables.trim() ? (
            <div className="competition-card__meta-values">
              <MetaValue value={competition.teamSize} />
              <MetaValue value={competition.workTime} />
              <MetaValue value={competition.deliverables} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="competition-card__stickers" aria-label={`${competition.name} documents`}>
        <DocSticker
          src={competitionDocStickers.abstractSrc}
          alt={competitionDocStickers.abstractAlt}
          label={`${competition.name} ${competition.documentOneLabel}`}
          href={abstractHref}
          accentColor={underlineColor}
        />
        <DocSticker
          src={competitionDocStickers.rubricSrc}
          alt={competitionDocStickers.rubricAlt}
          label={`${competition.name} ${competition.documentTwoLabel}`}
          href={rubricHref}
          accentColor={underlineColor}
          className="competition-card__sticker--rubric"
        />
      </div>
    </article>
  );
}
