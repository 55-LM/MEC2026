import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import './Accordion.css';

interface AccordionContextValue {
  openIds: string[];
  toggle: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

interface AccordionProps {
  children: ReactNode;
  /** When false (default), only one item may be open. */
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
}

export function Accordion({
  children,
  allowMultiple = false,
  defaultOpenId,
  className = '',
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : [],
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (allowMultiple) {
        return isOpen ? prev.filter((x) => x !== id) : [...prev, id];
      }
      return isOpen ? [] : [id];
    });
  };

  return (
    <AccordionContext.Provider value={{ openIds, toggle, allowMultiple }}>
      <div className={`accordion ${className}`.trim()}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function AccordionItem({ id, title, children }: AccordionItemProps) {
  const ctx = useContext(AccordionContext);
  const reduced = usePrefersReducedMotion();
  const panelId = useId();
  const buttonId = useId();

  if (!ctx) {
    throw new Error('AccordionItem must be used within Accordion');
  }

  const open = ctx.openIds.includes(id);

  return (
    <div className={`accordion-item ${open ? 'is-open' : ''}`}>
      <h3 className="accordion-item__heading">
        <button
          type="button"
          id={buttonId}
          className="accordion-item__trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => ctx.toggle(id)}
        >
          <span>{title}</span>
          <ChevronDown
            className="accordion-item__icon"
            size={20}
            aria-hidden
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="accordion-item__panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.45, 0, 0.55, 1] }}
          >
            <div className="accordion-item__content text-muted">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
