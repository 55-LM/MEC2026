import type { SponsorBoard } from '../../../types';
import './Sponsors.css';

interface SponsorBoardProps {
  board: SponsorBoard;
}

/** Rough rendered width — boards sit side by side on wide screens, stacked on portrait. */
const BOARD_SIZES = '(orientation: portrait) 88vw, (max-width: 700px) 88vw, min(46vw, 40rem)';

export function SponsorBoardCard({ board }: SponsorBoardProps) {
  return (
    <figure className={`sponsor-board sponsor-board--${board.id}`} aria-label={board.label}>
      <img
        className="sponsor-board__image"
        src={board.imageLarge}
        srcSet={`${board.imageSmall} 900w, ${board.imageLarge} 1600w`}
        sizes={BOARD_SIZES}
        alt={board.imageAlt}
        width={board.imageWidth}
        height={board.imageHeight}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}
