import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import type { Chair } from '../../../types';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { Polaroid } from '../../ui/Polaroid';
import './Chairs.css';

interface ChairCardProps {
  chair: Chair;
  index?: number;
}

export function ChairCard({ chair, index = 0 }: ChairCardProps) {
  const reduced = usePrefersReducedMotion();
  const social = chair.optionalSocialLink?.trim();

  return (
    <motion.article
      className="chair-card"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <Polaroid
        image={chair.image}
        imageAlt={chair.imageAlt}
        rotation={index % 2 === 0 ? -3 : 3}
        loading="lazy"
        className="chair-card__photo"
      />
      <div className="chair-card__info">
        <h3>{chair.name}</h3>
        <p className="chair-card__role accent">{chair.role}</p>
        <p className="text-muted">{chair.shortBio}</p>
        {social ? (
          <a
            className="chair-card__social"
            href={social}
            target="_blank"
            rel="noreferrer"
          >
            Connect <ExternalLink size={14} aria-hidden />
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}
