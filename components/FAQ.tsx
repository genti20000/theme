import React from 'react';
import Section from './ui/Section';
import FAQAccordion, { FAQAccordionItem } from './ui/FAQAccordion';

const faqData: FAQAccordionItem[] = [
  {
    question: 'What are the opening hours?',
    answer: 'We are open daily from 2pm until 3am. Perfect for afternoon warm-ups or late-night encores.'
  },
  {
    question: 'Do I need to book in advance?',
    answer: 'Yes, pre-booking is essential to guarantee your private room. We do not accept walk-ins. You can check real-time availability and book instantly through our website.'
  },
  {
    question: 'What is the cost of booking a karaoke room?',
    answer: 'Prices vary based on group size, day of the week, and booking duration (minimum 2 hours). Please check our booking system for exact pricing for your group.'
  },
  {
    question: 'Is food and drink included?',
    answer: 'The booking fee covers exclusive use of the room. Food and drinks are ordered separately from our menu. We also offer pre-booked drinks packages for better value.'
  },
  {
    question: 'Can I bring my own food and drinks?',
    answer: 'No outside food or drinks are permitted. Our bar is fully stocked with cocktails, beers, wines, and soft drinks, plus a food menu.'
  },
  {
    question: 'Is there an age limit?',
    answer: 'Yes, we are a strictly 18+ venue. Valid photo ID (Passport or Driving License) is required for entry.'
  },
  {
    question: 'Do you have a dress code?',
    answer: 'The dress code is smart-casual, and themed outfits are welcome.'
  },
  {
    question: 'How many songs do you have?',
    answer: 'Our library includes 80,000+ songs, updated monthly, across multiple languages and genres.'
  },
  {
    question: 'Can I extend my booking on the night?',
    answer: 'If there is no booking immediately after yours, we can often extend your session. Speak to a team member early in your booking.'
  },
  {
    question: 'How do I contact you?',
    answer: 'The fastest way to reach us is via WhatsApp. For corporate or large event enquiries, please message us directly.'
  }
];

const FAQ: React.FC = () => {
  return (
    <Section id="faq" className="bg-zinc-950 border-t border-zinc-900" containerClassName="max-w-4xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-3">Frequently Asked Questions</h2>
        <p className="text-zinc-400">Everything you need before you sing.</p>
      </div>
      <FAQAccordion items={faqData} />
    </Section>
  );
};

export default FAQ;
