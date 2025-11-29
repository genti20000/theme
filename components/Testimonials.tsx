
import React from 'react';
import { useData } from '../context/DataContext';

const Testimonials: React.FC = () => {
  const { testimonialsData } = useData();

  return (
    <section className="py-16 md:py-24 bg-zinc-900">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-bold">{testimonialsData.heading}</h3>
          <p className="text-lg text-gray-300 mt-4">
            {testimonialsData.subtext}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.items.map((item, index) => (
            <TestimonialCard
                key={index}
                quote={item.quote}
                name={item.name}
                avatar={item.avatar}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  quote: string;
  name: string;
  avatar: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, avatar }) => {
  return (
    <div className="bg-black p-8 rounded-3xl flex flex-col items-center text-center h-full">
      <img src={avatar} alt={name} className="w-20 h-20 rounded-full mb-6 border-4 border-zinc-700 object-cover" />
      <div className="flex text-yellow-400 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <blockquote className="text-gray-300 italic flex-grow">"{quote}"</blockquote>
      <p className="mt-6 font-semibold text-white">- {name}</p>
    </div>
  );
};

export default Testimonials;
