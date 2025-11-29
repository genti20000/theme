
import React from 'react';
import { useData } from '../context/DataContext';

const Menu: React.FC = () => {
  const { foodMenu } = useData();

  return (
    <section className="py-16 md:py-24 bg-zinc-900">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-4xl md:text-5xl font-bold">Fuel Your Performance</h3>
          <p className="text-lg md:text-xl text-gray-300 mt-4">
            Delicious bites and sharing plates to keep the party going all night long.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {foodMenu.map((category) => (
            <div key={category.category} className="break-inside-avoid">
              <h4 className="text-2xl font-bold text-yellow-400 mb-2">{category.category}</h4>
              {category.description && <p className="text-xs text-gray-400 italic mb-4">{category.description}</p>}
              <ul className="space-y-4">
                {category.items.map((item) => (
                  <li key={item.name} className="flex justify-between items-start gap-4">
                    <div>
                      <h5 className="font-semibold text-white">{item.name}</h5>
                      <p className="text-sm text-gray-400">{item.description}</p>
                       {item.note && <p className="text-xs text-gray-500">{item.note}</p>}
                    </div>
                    <span className="font-semibold text-white whitespace-nowrap">£{item.price}</span>
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
