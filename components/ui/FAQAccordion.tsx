import React, { useState } from 'react';
import Card from './Card';

export interface FAQAccordionItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQAccordionItem[];
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const open = openIndex === idx;
        return (
          <Card key={`${item.question}-${idx}`} className={`${open ? 'border-yellow-300/40' : 'border-white/10'}`}>
            <button
              onClick={() => setOpenIndex(open ? null : idx)}
              aria-expanded={open}
              className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm md:text-base font-bold text-white">{item.question}</span>
              <span className="text-zinc-300 text-lg leading-none">{open ? '−' : '+'}</span>
            </button>
            <div className={`grid transition-all duration-200 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-3">{item.answer}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
