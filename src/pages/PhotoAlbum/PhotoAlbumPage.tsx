import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
        <h1 className="sr-only">{photoAlbum.title}</h1>

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

            const content = (
              <>
                <span className="photo-album__sticker">
                  {peel}
                </span>
                <img
                  className="photo-album__photo"
                  src={day.photo}
                  alt={day.photoAlt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                {href ? (
                  <span className="photo-album__cta" aria-hidden="true">
                    {photoAlbum.ctaLabel}
                    <ArrowRight className="photo-album__cta-arrow" size={18} />
                  </span>
                ) : (
                  <span className="photo-album__note">{photoAlbum.pendingNote}</span>
                )}
              </>
            );

            return (
              <li
                key={day.id}
                className="photo-album__day"
                style={{ '--sticker-angle': `${day.rotation}deg` } as CSSProperties}
              >
                {href ? (
                  <a
                    className="photo-album__day-inner"
                    href={href}
                    {...(day.sameTab ? {} : { target: '_blank', rel: 'noreferrer' })}
                    aria-label={`${photoAlbum.ctaLabel}: ${day.name} photos`}
                  >
                    {content}
                  </a>
                ) : (
                  <div className="photo-album__day-inner">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
