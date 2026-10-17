import { useId, useState } from 'react';
import { teamTitleStickers } from '../../../data/team';
import { TeamGears, type ActiveGear } from './TeamGears';
import './Team.css';

/**
 * Meet the Team — ends the page. The heading sits over the coordinator gears,
 * which roll out from behind the George Vari building (bottom-right).
 * Hovering, tapping or focusing a gear shows "Name, Role" under the heading.
 */
export function Team() {
  const headingId = useId();
  const [active, setActive] = useState<ActiveGear | null>(null);

  return (
    <section id="team" className="team">
      <header className="team__title">
        <h2 id={headingId} className="team__title-sr">
          Meet the Team
        </h2>
        <div className="team__title-stickers" aria-hidden="true">
          {teamTitleStickers.map((sticker, index) => (
            <img
              key={sticker.id}
              className={`team__title-sticker team__title-sticker--${index + 1}`}
              src={sticker.src}
              alt=""
              width={sticker.width}
              height={sticker.height}
              draggable={false}
            />
          ))}
        </div>
        {/* Visual echo of the focused gear's accessible name, so hidden from AT */}
        <p className="team__caption" aria-hidden="true">
          {active ? (
            <>
              <span className="team__caption-name">{active.member.name}</span>, {active.member.role}
            </>
          ) : null}
        </p>
      </header>

      <TeamGears labelledBy={headingId} active={active} onActiveChange={setActive} />
    </section>
  );
}
