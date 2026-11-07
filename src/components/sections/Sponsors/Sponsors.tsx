import { sponsorBoards, sponsorTitleStickers } from '../../../data/sponsors';
import { siteContent } from '../../../data/siteContent';
import { SectionContainer } from '../../layout/SectionContainer';
import { SponsorBoardCard } from './SponsorBoards';
import './Sponsors.css';

export function Sponsors() {
  return (
    <SectionContainer id="sponsors" className="sponsors">
      <header className="sponsors__title">
        <h2 className="sponsors__title-sr">Our Sponsors</h2>
        <div className="sponsors__title-stickers" aria-hidden="true">
          {sponsorTitleStickers.map((sticker, index) => (
            <img
              key={sticker.id}
              className={`sponsors__title-sticker sponsors__title-sticker--${index + 1}`}
              src={sticker.src}
              alt=""
              draggable={false}
            />
          ))}
        </div>
        <div className="sponsors__intro">
          {siteContent.sponsorsIntro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="sponsors__intro-text">
              {paragraph}
            </p>
          ))}
        </div>
      </header>

      <div className="sponsors__stage">
        <div className="sponsors__boards">
          {sponsorBoards.map((board) => (
            <SponsorBoardCard key={board.id} board={board} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
