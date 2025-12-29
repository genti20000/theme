
import React from 'react';
import { useData } from '../context/DataContext';

const Menu: React.FC = () => {
  const { foodMenu } = useData();

  // If menu is empty or specifically disabled (pattern matching other sections)
  if (!foodMenu || foodMenu.length === 0) return null;

  return (
    <section id="food-menu" className="py-16 md:py-32 bg-zinc-950">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h3 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 uppercase italic tracking-tighter">Fuel Your Performance</h3>
          <p className="text-lg md:text-xl text-gray-400 mt-6 leading-relaxed font-light">
            Hand-picked bites and sharing platters designed to keep the energy high and the vocals soaring.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
          {foodMenu.map((category) => (
            <div key={category.category} className="break-inside-avoid animate-fade-in-up">
              <div className="flex items-baseline justify-between border-b border-zinc-800 pb-4 mb-8">
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">{category.category}</h4>
                {category.description && <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{category.description}</span>}
              </div>
              <ul className="space-y-8">
                {category.items.map((item) => (
                  <li key={item.name} className="group cursor-default">
                    <div className="flex justify-between items-baseline gap-4 mb-2">
                      <h5 className="font-bold text-white text-xl group-hover:text-pink-500 transition-colors duration-300">{item.name}</h5>
                      <div className="flex-grow border-b border-zinc-800 border-dotted mx-2 hidden sm:block"></div>
                      <span className="font-black text-white text-lg">£{item.price}</span>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">{item.description}</p>
                    {item.note && (
                        <div className="mt-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                            <p className="text-[10px] text-yellow-500/80 font-black uppercase tracking-widest">{item.note}</p>
                        </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
            <p className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.3em]">Deliciously curated for Soho nights</p>
        </div>
      </div>
    </section>
  );
};

export default Menu;
