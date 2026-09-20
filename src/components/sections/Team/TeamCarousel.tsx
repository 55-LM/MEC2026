import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { TeamMember } from '../../../types';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { Polaroid } from '../../ui/Polaroid';
import './Team.css';

interface TeamCarouselProps {
  members: TeamMember[];
}

interface OrbitMetrics {
  radius: number;
  cardSize: number;
  compact: boolean;
}

function computeMetrics(width: number, height: number, count: number): OrbitMetrics {
  const compact = width < 640 || height < 420 || count <= 2;
  const maxRadius = Math.min(width, height) * 0.38;
  const radius = compact
    ? Math.max(90, Math.min(maxRadius, 140))
    : Math.max(120, Math.min(maxRadius, 210));
  const cardSize = compact
    ? Math.max(72, Math.min(width * 0.28, 110))
    : Math.max(96, Math.min(width * 0.2, 140));
  return { radius, cardSize, compact };
}

export function TeamCarousel({ members }: TeamCarouselProps) {
  const reduced = usePrefersReducedMotion();
  const regionId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [metrics, setMetrics] = useState<OrbitMetrics>({
    radius: 180,
    cardSize: 120,
    compact: false,
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const count = members.length;

  const measure = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMetrics(computeMetrics(rect.width, rect.height, count));
  }, [count]);

  useEffect(() => {
    measure();
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    if (activeIndex >= count) setActiveIndex(0);
  }, [activeIndex, count]);

  if (count === 0) {
    return <p className="text-muted">Team members coming soon.</p>;
  }

  const go = (delta: number) => {
    setActiveIndex((i) => (i + delta + count) % count);
  };

  const active = members[activeIndex] ?? members[0];
  if (!active) {
    return <p className="text-muted">Team members coming soon.</p>;
  }

  const revealId = hoveredId ?? active.id;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    go(dx < 0 ? 1 : -1);
  };

  return (
    <div className="team-carousel">
      <div
        ref={stageRef}
        className={`team-carousel__stage ${metrics.compact ? 'is-compact' : ''}`}
        role="region"
        id={regionId}
        aria-roledescription="carousel"
        aria-label="Organizing team"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="team-carousel__orbit" aria-live="polite">
          {members.map((member, index) => {
            const angle = ((index - activeIndex) / count) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * metrics.radius;
            const y = Math.sin(angle) * metrics.radius;
            const isActive = index === activeIndex;
            const depthScale = isActive ? 1.12 : 0.82 + 0.12 * Math.cos(angle + Math.PI / 2);
            const rotation = ((index * 17) % 11) - 5;
            const showDetails = revealId === member.id;

            return (
              <motion.div
                key={member.id}
                className={`team-carousel__item ${isActive ? 'is-active' : ''}`}
                style={{
                  width: metrics.cardSize,
                  zIndex: isActive ? 20 : 10 + Math.round(depthScale * 5),
                }}
                animate={{
                  x,
                  y,
                  scale: depthScale,
                  opacity: isActive ? 1 : 0.72,
                }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 220, damping: 24 }
                }
                onMouseEnter={() => setHoveredId(member.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(member.id)}
                onBlur={() => setHoveredId(null)}
              >
                <Polaroid
                  image={member.image}
                  imageAlt={member.imageAlt}
                  rotation={isActive || showDetails ? 0 : rotation}
                  highlighted={isActive}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${member.name}, ${member.role}. Select to view.`}
                  className="team-carousel__polaroid"
                />
                <AnimatePresence>
                  {showDetails ? (
                    <motion.div
                      className="team-carousel__tooltip"
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="team-carousel__tooltip-name">{member.name}</p>
                      <p className="team-carousel__tooltip-role">{member.role}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="team-carousel__controls">
        <button
          type="button"
          className="team-carousel__nav"
          aria-label="Previous team member"
          onClick={() => go(-1)}
        >
          <ChevronLeft size={20} aria-hidden />
        </button>
        <div className="team-carousel__caption">
          <p className="team-carousel__caption-name">{active.name}</p>
          <p className="team-carousel__caption-role text-muted">{active.role}</p>
        </div>
        <button
          type="button"
          className="team-carousel__nav"
          aria-label="Next team member"
          onClick={() => go(1)}
        >
          <ChevronRight size={20} aria-hidden />
        </button>
      </div>
    </div>
  );
}
