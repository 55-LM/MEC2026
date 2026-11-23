import type { CSSProperties } from 'react';
import { ArrowLeft } from 'lucide-react';
import { GridBackground } from '../../components/layout/GridBackground';
import StickerPeel from '../../components/ui/StickerPeel/StickerPeel';
import { photoAlbum } from '../../data/photoAlbum';
import './PhotoAlbumPage.css';

/** Standalone /photos/ page: album title sticker + one sticker button per day. */
export function PhotoAlbumPage() {
  return (
    <>
      <GridBackground />
      <a className="skip-link" href="#photo-album">
        Skip to content
      </a>

      <header className="photo-album__bar">
        <a className="photo-album__back" href="/">
          <ArrowLeft aria-hidden="true" size={18} />
          {photoAlbum.backLabel}
        </a>
      </header>

      <main id="photo-album" className="photo-album">
        <h1 className="photo-album__title">
          <img src={photoAlbum.titleImage} alt={photoAlbum.title} draggable={false} />
        </h1>
        <p className="photo-album__intro">{photoAlbum.intro}</p>

        <ul className="photo-album__days" aria-label="Photo albums by day">
          {photoAlbum.days.map((day) => {
            const href = day.href?.trim() ?? '';
            const peel = (
              <StickerPeel
                imageSrc={day.image}
                alt={day.imageAlt}
                accentColor={day.accentColor}
                underlineStyle={day.underlineStyle}
                className="photo-album__peel"
              />
            );

            return (
              <li
                key={day.id}
                className="photo-album__day"
                style={{ '--sticker-angle': `${day.rotation}deg` } as CSSProperties}
              >
                {href ? (
                  <a
                    href={href}
                    {...(day.sameTab ? {} : { target: '_blank', rel: 'noreferrer' })}
                    aria-label={`${day.name} photos`}
                  >
                    {peel}
                  </a>
                ) : (
                  <div
                    className="photo-album__day-pending"
                    role="img"
                    aria-label={`${day.name} photos (${photoAlbum.pendingNote.toLowerCase()})`}
                  >
                    {peel}
                    <span className="photo-album__note" aria-hidden="true">
                      {photoAlbum.pendingNote}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
