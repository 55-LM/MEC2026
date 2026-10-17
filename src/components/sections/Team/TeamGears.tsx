import { useEffect, useLayoutEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import type { TeamMember } from '../../../types';
import { teamBuilding, teamMembers } from '../../../data/team';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

/** Same pace as last year's team carousel (5828px every 70s). */
const GEAR_SPEED_PX_PER_S = 83;

/** The gear being hovered / tapped / focused; `key` tells the two loop copies apart. */
export interface ActiveGear {
  key: string;
  member: TeamMember;
}

interface TeamGearProps {
  member: TeamMember;
  isActive: boolean;
  /** Second copy that makes the loop seamless — hidden from assistive tech. */
  isCopy: boolean;
  onShow: () => void;
  onHide: () => void;
  onToggle: () => void;
  onKeyboardFocus: (item: HTMLElement) => void;
}

function TeamGear({
  member,
  isActive,
  isCopy,
  onShow,
  onHide,
  onToggle,
  onKeyboardFocus,
}: TeamGearProps) {
  const pointerType = useRef('mouse');

  return (
    <li className={`team-gear ${isActive ? 'is-active' : ''}`.trim()}>
      <button
        type="button"
        className="team-gear__button"
        aria-label={`${member.name}, ${member.role}`}
        tabIndex={isCopy ? -1 : undefined}
        onPointerDown={(e) => {
          pointerType.current = e.pointerType;
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') onShow();
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') onHide();
        }}
        onFocus={(e) => {
          const item = e.currentTarget.parentElement;
          if (item && e.currentTarget.matches(':focus-visible')) onKeyboardFocus(item);
        }}
        onBlur={onHide}
        onClick={(e) => {
          // Touch has no hover: tap to show / hide (keyboard clicks have detail 0)
          if (e.detail > 0 && pointerType.current !== 'mouse') onToggle();
        }}
      >
        <img
          src={member.image}
          alt=""
          width={320}
          height={320}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </button>
    </li>
  );
}

interface TeamGearsProps {
  /** Id of the section heading that names the list. */
  labelledBy: string;
  active: ActiveGear | null;
  onActiveChange: Dispatch<SetStateAction<ActiveGear | null>>;
}

/**
 * Coordinator gears roll right → left out from behind the George Vari
 * building. Hover (or tap / keyboard focus) stops the row; it resumes when
 * the pointer leaves. Renders grid items for the Team section's stage.
 */
export function TeamGears({ labelledBy, active, onActiveChange: setActive }: TeamGearsProps) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLUListElement>(null);

  /* Loop duration follows the row length so the speed stays constant */
  useLayoutEffect(() => {
    const track = trackRef.current;
    const set = setRef.current;
    if (!track || !set) return;
    const update = () => {
      track.style.setProperty('--team-gear-loop', `${set.offsetWidth / GEAR_SPEED_PX_PER_S}s`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(set);
    return () => observer.disconnect();
  }, [reduced]);

  /* Touch: tapping anywhere off a gear clears the name and resumes */
  useEffect(() => {
    if (!active) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest('.team-gear__button')) {
        setActive(null);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [active, setActive]);

  /* Keyboard focus: roll the focused gear out to the left edge so it is visible */
  const bringIntoView = (item: HTMLElement) => {
    const animation = trackRef.current
      ?.getAnimations()
      .find((a): a is CSSAnimation => a instanceof CSSAnimation);
    if (!animation) return;
    const offset = Math.max(0, item.offsetLeft - item.offsetWidth / 2);
    animation.currentTime = (offset / GEAR_SPEED_PX_PER_S) * 1000;
  };

  const copies = reduced ? [0] : [0, 1];

  return (
    <>
      <div className="team-gears">
        <div ref={trackRef} className={`team-gears__track ${active ? 'is-paused' : ''}`.trim()}>
          {copies.map((copy) => (
            <ul
              key={copy}
              ref={copy === 0 ? setRef : undefined}
              className="team-gears__set"
              aria-labelledby={copy === 0 ? labelledBy : undefined}
              aria-hidden={copy > 0 ? true : undefined}
            >
              {teamMembers.map((member) => {
                const key = `${copy}-${member.id}`;
                return (
                  <TeamGear
                    key={key}
                    member={member}
                    isActive={active?.key === key}
                    isCopy={copy > 0}
                    onShow={() => setActive({ key, member })}
                    onHide={() => setActive((current) => (current?.key === key ? null : current))}
                    onToggle={() =>
                      setActive((current) => (current?.key === key ? null : { key, member }))
                    }
                    onKeyboardFocus={(item) => {
                      bringIntoView(item);
                      setActive({ key, member });
                    }}
                  />
                );
              })}
            </ul>
          ))}
        </div>
      </div>

      <img
        className="team__building"
        src={teamBuilding.image}
        srcSet={teamBuilding.sources.map(({ src, width }) => `${src} ${width}w`).join(', ')}
        sizes="(max-width: 640px) and (orientation: portrait) 66vw, 62vw"
        alt={teamBuilding.imageAlt}
        width={teamBuilding.width}
        height={teamBuilding.height}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      {/* Building-shaped hit area: gears behind the facade can't be hovered */}
      <div className="team__building-hit" aria-hidden="true" />
    </>
  );
}
