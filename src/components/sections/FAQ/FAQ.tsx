import { faqItems, faqSideStickers, faqTitleStickers } from '../../../data/faq';
import { SectionContainer } from '../../layout/SectionContainer';
import { Accordion } from '../../ui/Accordion';
import { FAQItem } from './FAQItem';
import './FAQ.css';

/** Column of decorative stickers in one gutter beside the questions. */
function SideStickers({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`faq__side faq__side--${side}`} aria-hidden="true">
      {faqSideStickers[side].map((sticker, index) => (
        <img
          key={sticker.id}
          className={`faq__side-sticker faq__side-sticker--${index + 1}`}
          src={sticker.src}
          alt=""
          width={sticker.width}
          height={sticker.height}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ))}
    </div>
  );
}

/**
 * FAQ accordion — single-open by default.
 * Pass allowMultiple to Accordion for multi-open mode.
 */
export function FAQ() {
  return (
    <SectionContainer id="faq" className="faq">
      <header className="faq__title">
        <h2 className="faq__title-sr">Frequently Asked Questions</h2>
        <div className="faq__title-stickers" aria-hidden="true">
          {faqTitleStickers.map((sticker, index) => (
            <img
              key={sticker.id}
              className={`faq__title-sticker faq__title-sticker--${index + 1}`}
              src={sticker.src}
              alt=""
              width={sticker.width}
              height={sticker.height}
              draggable={false}
            />
          ))}
        </div>
      </header>
      <div className="faq__body">
        <SideStickers side="left" />
        <Accordion className="faq__list" allowMultiple={false}>
          {faqItems.map((item) => (
            <FAQItem key={item.id} item={item} />
          ))}
        </Accordion>
        <SideStickers side="right" />
      </div>
    </SectionContainer>
  );
}
