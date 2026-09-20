import type { CSSProperties } from 'react';
import type { TeamMember } from '../../../types';
import { Polaroid } from '../../ui/Polaroid';
import './Team.css';

interface TeamMemberCardProps {
  member: TeamMember;
  active?: boolean;
  showDetails?: boolean;
  onSelect?: () => void;
  rotation?: number;
  className?: string;
  style?: CSSProperties;
}

/** Standalone polaroid card used by simplified layouts and future edits. */
export function TeamMemberCard({
  member,
  active = false,
  showDetails = false,
  onSelect,
  rotation = 0,
  className = '',
  style,
}: TeamMemberCardProps) {
  return (
    <div
      className={`team-member-card ${active ? 'is-active' : ''} ${showDetails ? 'is-detail' : ''} ${className}`.trim()}
      style={style}
    >
      <Polaroid
        image={member.image}
        imageAlt={member.imageAlt}
        rotation={rotation}
        highlighted={active}
        onClick={onSelect}
        aria-label={`${member.name}, ${member.role}`}
        className="team-member-card__polaroid"
      />
      {(showDetails || active) && (
        <div className="team-member-card__details">
          <p className="team-member-card__name">{member.name}</p>
          <p className="team-member-card__role">{member.role}</p>
        </div>
      )}
    </div>
  );
}
