import { competitionTitleStickers, competitions } from '../../../data/competitions';
import { siteContent } from '../../../data/siteContent';
import { SectionContainer } from '../../layout/SectionContainer';
import { CompetitionCard } from './CompetitionCard';
import './Competitions.css';

export function Competitions() {
  return (
    <SectionContainer id="competitions" className="competitions">
      <header className="competitions__title">
        <h2 className="competitions__title-sr">
          Explore the Nine Competition Categories
        </h2>
        <div className="competitions__title-stickers" aria-hidden="true">
          {competitionTitleStickers.map((sticker, index) => (
            <img
              key={sticker.id}
              className={`competitions__title-sticker competitions__title-sticker--${index + 1}`}
              src={sticker.src}
              alt=""
              draggable={false}
            />
          ))}
        </div>
        <p className="competitions__intro">{siteContent.competitionsIntro}</p>
      </header>

      <div className="competitions__grid">
        {competitions.map((competition) => (
          <CompetitionCard key={competition.id} competition={competition} />
        ))}
      </div>
    </SectionContainer>
  );
}
