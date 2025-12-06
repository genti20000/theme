
import React from 'react';
import { useData } from '../context/DataContext';

const Testimonials: React.FC = () => {
  const { testimonialsData } = useData();

  return (
    <section className="py-16 md:py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
             <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-8 h-8" />
             <h3 className="text-2xl md:text-3xl font-bold text-white">{testimonialsData.heading}</h3>
          </div>
          <p className="text-lg text-gray-400">
            {testimonialsData.subtext}
          </p>
          <div className="flex justify-center items-center gap-2 mt-4 text-yellow-400">
             <span className="text-white font-bold text-xl">4.9</span>
             <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z"/></svg>
                ))}
             </div>
             <span className="text-gray-500 text-sm ml-2">(128 reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col h-full border border-gray-200">
      <div className="flex items-center gap-4 mb-4">
          <img src={avatar || `https://ui-avatars.com/api/?name=${name}&background=random`} alt={name} className="w-10 h-10 rounded-full" />
          <div>
              <p className="font-bold text-gray-900 text-sm">{name}</p>
              <div className="flex text-yellow-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z"/></svg>
                ))}
                <span className="text-gray-400 ml-2">a week ago</span>
              </div>
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5 ml-auto opacity-50" />
      </div>
      <p className="text-gray-600 text-sm leading-relaxed flex-grow">
        "{quote}"
      </p>
    </div>
  );
};

export default Testimonials;
