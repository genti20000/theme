
import React from 'react';
import { useData } from '../context/DataContext';

const Menu: React.FC = () => {
  const { foodMenu } = useData();

  return (
    <section className="py-16 md:py-24 bg-zinc-900 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Fuel Your Performance</h3>
          <p className="text-lg md:text-xl text-gray-300 mt-6 leading-relaxed">
            Hand-picked bites and sharing platters designed to keep the energy high and the vocals soaring.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {foodMenu.map((category) => (
            <div key={category.category} className="break-inside-avoid">
              <div className="flex items-baseline justify-between border-b-2 border-yellow-400/30 pb-2 mb-6">
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{category.category}</h4>
                {category.description && <span className="text-xs text-gray-500 italic hidden md:inline">{category.description}</span>}
              </div>
              <ul className="space-y-6">
                {category.items.map((item) => (
                  <li key={item.name} className="group">
                    <div className="flex justify-between items-baseline gap-4 mb-1">
                      <h5 className="font-bold text-white text-lg group-hover:text-yellow-400 transition-colors">{item.name}</h5>
                      <div className="flex-grow border-b border-zinc-800 border-dotted mx-2 hidden sm:block"></div>
                      <span className="font-bold text-white whitespace-nowrap">£{item.price}</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-snug">{item.description}</p>
                    {item.note && <p className="text-xs text-yellow-400/70 mt-1 font-medium">{item.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
