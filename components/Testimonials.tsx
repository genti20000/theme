import React from 'react';
import { useData } from '../context/DataContext';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Section from './ui/Section';

const Testimonials: React.FC = () => {
  const { testimonialsData } = useData();

  if (!testimonialsData || !testimonialsData.items) return null;

  return (
    <Section className="bg-zinc-950 border-t border-zinc-900">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h3 className="text-2xl md:text-4xl font-black text-white">{testimonialsData.heading}</h3>
        <p className="text-zinc-400 mt-3">{testimonialsData.subtext}</p>
        <Badge className="mt-5">★★★★★ 4.9 (128 Google Reviews)</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonialsData.items.map((item, index) => (
          <TestimonialCard
            key={index}
            quote={item.quote}
            name={item.name}
            avatar={item.avatar}
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
  avatar: string;
  rating?: number;
  date?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, avatar, rating = 5, date = 'a week ago' }) => {
  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'LK';

  return (
    <Card className="p-5 h-full">
      <div className="flex items-center gap-3 mb-4">
        {avatar ? (
          <img src={avatar} alt={name} width={40} height={40} loading="lazy" className="w-10 h-10 rounded-full object-cover border border-zinc-700" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-black flex items-center justify-center">
            {initials}
          </div>
        )}
        <div>
          <p className="font-bold text-white text-sm">{name}</p>
          <div className="flex items-center gap-1 text-yellow-300 text-xs">
            {[...Array(rating)].map((_, i) => (
              <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" /></svg>
            ))}
            <span className="text-zinc-500 ml-1">{date}</span>
          </div>
        </div>
      </div>
      <p className="text-zinc-300 text-sm leading-relaxed">“{quote}”</p>
    </Card>
  );
};

export default Testimonials;
