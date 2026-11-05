import { useId, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { teamTitleStickers } from '../../../data/team';
import { TeamGears, type ActiveGear } from './TeamGears';
import './Team.css';

/** Minimum space kept between the name caption and the top of the gears. */
const GEAR_CLEARANCE_PX = 16;

/**
 * Shift the heading so the stickers + caption sit centred inside one big
 * grid square instead of being crossed by a bold grid line. The bold lines
 * count up from the page bottom (see GridBackground), so where they fall
 * depends on the page height — measure rather than guess.
 */
function useCentreInGridSquare(
  header: RefObject<HTMLElement | null>,
  block: { top: RefObject<HTMLElement | null>; bottom: RefObject<HTMLElement | null> },
) {
  useLayoutEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    let frame = 0;
    const update = () => {
      const el = header.current;
      const top = block.top.current;
      const bottom = block.bottom.current;
      const gear = root.querySelector<HTMLElement>('.team-gear');
      if (!el || !top || !bottom) return;

      const cell =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--grid-size')) || 32;
      const square = cell * 5;
      /* Same baseline GridBackground uses for its bold rows */
      const baseline = Math.floor(root.scrollHeight / cell) * cell;
      const rootTop = root.getBoundingClientRect().top;
      const shift = parseFloat(el.style.getPropertyValue('--team-title-snap')) || 0;

      const blockTop = top.getBoundingClientRect().top - rootTop - shift;
      const blockBottom = bottom.getBoundingClientRect().bottom - rootTop - shift;
      const centre = (blockTop + blockBottom) / 2;

      /* Square centres sit half a square above each bold line */
      const below = baseline - square * (Math.floor((baseline - centre) / square) + 0.5);
      let next = below - centre;
      if (gear) {
        const gearTop = gear.getBoundingClientRect().top - rootTop;
        if (blockBottom + next > gearTop - GEAR_CLEARANCE_PX) next -= square;
      }
      if (blockTop + next < 0) next = 0;
      el.style.setProperty('--team-title-snap', `${next}px`);
    };

    const schedule = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };
    schedule();
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [header, block.top, block.bottom]);
}

/**
 * Meet the Team — ends the page. The heading sits over the coordinator gears,
 * which roll out from behind the George Vari building (bottom-right).
 * Hovering, tapping or focusing a gear shows "Name, Role" under the heading.
 */
export function Team() {
  const headingId = useId();
  const [active, setActive] = useState<ActiveGear | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const stickersRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  useCentreInGridSquare(headerRef, { top: stickersRef, bottom: captionRef });

  return (
    <section id="team" className="team">
      <header ref={headerRef} className="team__title">
        <h2 id={headingId} className="team__title-sr">
          Meet the Team
        </h2>
        <div ref={stickersRef} className="team__title-stickers" aria-hidden="true">
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
        <p ref={captionRef} className="team__caption" aria-hidden="true">
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
