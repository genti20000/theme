import React from 'react';
import { useData } from '../context/DataContext';
import Badge from './ui/Badge';
import Card from './ui/Card';
import Section from './ui/Section';

const Testimonials: React.FC = () => {
  const { testimonialsData } = useData();

  if (!testimonialsData || !testimonialsData.items) return null;

  return (
    <Section className="border-t border-white/10 bg-[#0A0A0A]">
      <div className="mx-auto mb-12 max-w-[720px] text-center">
        <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">{testimonialsData.heading}</h2>
        <p className="mt-3 text-base leading-6 text-zinc-400 md:text-lg md:leading-7">{testimonialsData.subtext}</p>
        <Badge className="mt-5">★★★★★ 4.9 (128 Google Reviews)</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-10">
        {testimonialsData.items.map((item, index) => (
          <TestimonialCard
            key={index}
            quote={item.quote}
            name={item.name}
            rating={item.rating}
            date={item.date}
          />
        ))}
      </div>
    </Section>
  );
};

interface TestimonialCardProps {
  quote: string;
  name: string;
  rating?: number;
  date?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, rating = 5, date = 'Verified review' }) => {
  return (
    <Card className="h-full p-6">
      <div className="mb-4 flex items-center gap-1 text-yellow-300">
        {[...Array(rating)].map((_, i) => (
          <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
      <p className="mb-5 text-sm leading-relaxed text-zinc-300">“{quote}”</p>
      <div className="border-t border-white/10 pt-4">
        <p className="text-sm font-bold text-white">{name}</p>
        <p className="text-sm text-zinc-500">{date}</p>
      </div>
    </Card>
  );
};

export default Testimonials;
