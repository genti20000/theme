
import React from 'react';
import { useData } from '../context/DataContext';

const Features: React.FC = () => {
  const { featuresData } = useData();
  const { experience, occasions, grid } = featuresData;

  return (
    <section className="bg-black">
      {/* The Experience - Full Width */}
      {/* Mobile: Stacked. Desktop: Overlay. */}
      <div className="flex flex-col md:block relative text-center md:py-48 md:min-h-[60vh] md:overflow-hidden">
          
          {/* Image Section */}
          <div className="w-full h-[40vh] md:absolute md:inset-0 md:h-full z-0">
            <img 
                src={experience.image} 
                alt="Interior of a stylish karaoke room" 
                className="w-full h-full object-cover md:opacity-40"
            />
            {/* Gradient overlay only visible on desktop */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black"></div>
          </div>

          {/* Content Section */}
          <div className="relative z-10 bg-black md:bg-transparent px-6 py-16 md:py-0 md:flex md:flex-col md:justify-center md:items-center md:h-full md:absolute md:inset-0 pointer-events-none">
            <div className="max-w-4xl mx-auto pointer-events-auto">
                <p className="text-pink-500 font-bold tracking-widest uppercase mb-4">{experience.label}</p>
                <h3 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl">{experience.heading}</h3>
                <p className="text-xl text-gray-100 max-w-2xl mx-auto drop-shadow-md leading-relaxed">
                {experience.text}
                </p>
            </div>
          </div>
      </div>

      <div className="py-16 md:py-24 container mx-auto px-6">
        {/* Room for every occasion */}
        <div className="max-w-4xl mx-auto text-center">
            <h4 className="text-4xl md:text-5xl font-bold leading-tight">{occasions.heading}</h4>
            <p className="text-gray-300 mt-6 text-lg">
                {occasions.text}
            </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8 text-sm">
            {occasions.items.map((item, idx) => (
                <div key={idx} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                    <h5 className="font-bold mb-3 text-xl">{item.title}</h5>
                    <p className="text-gray-400 leading-relaxed">{item.text}</p>
                </div>
            ))}
        </div>

        {/* More Features Grid */}
        <div className="mt-24 md:mt-32 max-w-4xl mx-auto text-center">
            <h4 className="text-3xl font-bold mb-4">{grid.heading}</h4>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {grid.items.map((item, index) => (
                <FeatureCard 
                    key={index}
                    title={item.title}
                    description={item.description}
                    imgSrc={item.image}
                    interactiveImage={index === 1} // Preserve specific behavior for cocktails
                >
                    {index === 0 && <SongListSimulator />}
                </FeatureCard>
            ))}
        </div>
      </div>
    </section>
  );
};

const SongListSimulator: React.FC = () => (
  <div className="bg-zinc-800 rounded-xl p-4 text-sm my-6 select-none border border-zinc-700">
    <div className="flex items-center text-gray-500 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="truncate">Find your anthem...</span>
    </div>
    <ul className="space-y-3 text-gray-300 font-mono text-xs">
      <li className="truncate opacity-70 border-b border-zinc-700 pb-2">Bohemian Rhapsody - Queen</li>
      <li className="truncate bg-pink-500/20 text-pink-300 -mx-4 px-4 py-2 border-l-4 border-pink-500">Don't Stop Believin' - Journey</li>
      <li className="truncate opacity-70 pt-1">I Will Survive - Gloria Gaynor</li>
    </ul>
  </div>
);


interface FeatureCardProps {
    title: string;
    description: string;
    imgSrc: string;
    children?: React.ReactNode;
    interactiveImage?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, imgSrc, children, interactiveImage }) => (
    <div className={`bg-zinc-900 rounded-3xl p-6 flex flex-col justify-between h-full border border-zinc-800 ${interactiveImage ? 'group' : ''}`}>
        <div>
            <h5 className="font-bold text-xl mb-3 text-white">{title}</h5>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            {children}
        </div>
        <div className="mt-8 flex justify-center items-end flex-grow rounded-2xl overflow-hidden">
            <img 
              src={imgSrc} 
              alt={title} 
              className={`rounded-2xl max-h-64 w-full object-cover shadow-lg ${interactiveImage ? 'transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]' : ''}`}
            />
        </div>
    </div>
);

export default Features;
