import { useId } from 'react';
import { chairsNote } from '../../../data/chairs';

/** Rough rendered width of the notebook (see `--team-notes-w` in Team.css). */
const NOTEBOOK_SIZES = '(orientation: portrait) 90vw, 42vw';

/**
 * The Co-Chairs' spiral notebook: two polaroids up top, their welcome note
 * written below. Anchored as #chairs so the header's "Chairs" link lands here.
 */
export function ChairsNotebook() {
  const headingId = useId();
  const { message, email } = chairsNote;
  const lastIndex = message.length - 1;

  return (
    <article id="chairs" className="team-notes" aria-labelledby={headingId}>
      <div className="team-notes__page">
        <img
          className="team-notes__paper"
          src={chairsNote.notebookImage}
          srcSet={chairsNote.notebookSources.map((s) => `${s.src} ${s.width}w`).join(', ')}
          sizes={NOTEBOOK_SIZES}
          alt=""
          width={chairsNote.notebookWidth}
          height={chairsNote.notebookHeight}
          loading="lazy"
          decoding="async"
          draggable={false}
        />

        <h3 id={headingId} className="team-notes__heading">
          {chairsNote.heading}
        </h3>

        <div className="team-notes__photos">
          {chairsNote.photos.map((photo, index) => (
            <img
              key={photo.id}
              className={`team-notes__photo team-notes__photo--${index + 1}`}
              src={photo.image}
              alt={photo.imageAlt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          ))}
        </div>

        <div className="team-notes__message">
          {message.map((paragraph, index) => (
            <p key={paragraph.slice(0, 32)}>
              {paragraph}
              {index === lastIndex ? (
                <>
                  {' '}
                  <a href={`mailto:${email}`}>{email}</a>.
                </>
              ) : null}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
