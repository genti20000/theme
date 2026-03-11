import React from 'react';
import { useData } from '../context/DataContext';
import Card from './ui/Card';
import Section from './ui/Section';
import Button from './ui/Button';

const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=London+Karaoke+Club+Soho+google+reviews';

const Testimonials: React.FC = () => {
  const { testimonialsData } = useData();

  if (!testimonialsData || !testimonialsData.items) return null;

  const featuredReviews = testimonialsData.items.filter((item) => {
    const rating = typeof item.rating === 'number' ? item.rating : 5;
    return rating >= 5 && item.featured !== false;
  });

  if (featuredReviews.length === 0) return null;

  return (
    <Section className="border-t border-white/10 bg-[#0A0A0A]">
      <div className="mx-auto mb-12 max-w-[720px] text-center">
        <h2 className="text-2xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-cyan-300 md:text-3xl">{testimonialsData.heading}</h2>
        <p className="mt-3 text-base leading-6 text-zinc-400 md:text-lg md:leading-7">{testimonialsData.subtext}</p>
        <div className="mt-5 flex justify-center">
          <Button href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" variant="secondary">
            View Google Reviews
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-10">
        {featuredReviews.map((item, index) => (
          <TestimonialCard
            key={index}
            quote={item.quote}
            name={item.name}
            rating={item.rating}
            date={item.date}
            source={item.source}
            sourceUrl={item.sourceUrl}
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
  source?: string;
  sourceUrl?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, rating = 5, date = 'Verified review', source = 'Google Review', sourceUrl }) => {
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
        <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
          <span>{date}</span>
          <span className="text-zinc-700">•</span>
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-white">
              {source}
            </a>
          ) : (
            <span>{source}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Testimonials;
