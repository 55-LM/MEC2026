import type { FaqItem as FaqItemType } from '../../../types';
import { AccordionItem } from '../../ui/Accordion';

interface FAQItemProps {
  item: FaqItemType;
}

export function FAQItem({ item }: FAQItemProps) {
  return (
    <AccordionItem id={item.id} title={item.question}>
      <p>{item.answer}</p>
    </AccordionItem>
  );
}
