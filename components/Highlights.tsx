
import React from 'react';
import { useData } from '../context/DataContext';

const Highlights: React.FC = () => {
  const { highlightsData } = useData();

  return (
    <section className="bg-zinc-900 py-16 md:py-24">
      <div className="container mx-auto px-6 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">{highlightsData.heading}</h3>
          <p className="text-xl text-gray-300">
            {highlightsData.subtext}
          </p>
        </div>
      </div>

      {/* Full Width Image */}
      <div className="w-full h-[60vh] md:h-[80vh] mb-16 relative">
          <img 
            src={highlightsData.mainImageUrl} 
            alt="Friends singing karaoke" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="pl-0 md:pl-10">
            <h4 className="text-3xl font-bold mb-8">{highlightsData.featureListTitle}</h4>
            <ul className="space-y-4 text-lg text-gray-300">
              {highlightsData.featureList.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckIcon />
                    {feature}
                  </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <img src={highlightsData.sideImageUrl} alt="Karaoke Detail" className="rounded-full w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-cover border-8 border-zinc-800 shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4 text-pink-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);


export default Highlights;
