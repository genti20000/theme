
import React from 'react';
import { useData } from '../context/DataContext';

const DrinksMenu: React.FC = () => {
  const { drinksData } = useData();
  const { packagesData, bottleServiceData, byTheGlassData, shotsData, cocktailsData, winesData, headerImageUrl } = drinksData;

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="relative text-center py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={headerImageUrl || "https://picsum.photos/seed/barvibes/1600/800"}
            alt="Vibrant cocktail bar atmosphere"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <h3 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
            Raise a Glass
          </h3>
          <p className="text-xl md:text-2xl text-gray-200 mt-6 max-w-3xl mx-auto">
            From signature cocktails to premium spirits, discover the perfect drink for your night out.
          </p>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">

          {/* Packages */}
          <div className="mb-20">
            <div className="max-w-4xl mx-auto bg-zinc-900/50 border-2 border-yellow-400 p-8 rounded-lg shadow-[0_0_20px_rgba(250,204,21,0.5)] bg-cover bg-center" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/shattered.png')"}}>
              <h4 className="text-3xl font-bold text-center mb-2">{packagesData.title}</h4>
              <p className="text-center text-gray-400 mb-8">{packagesData.subtitle}</p>
              <div className="space-y-6">
                {packagesData.items.map((item: any) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-baseline">
                      <h5 className="text-xl font-semibold text-yellow-400">{item.name}</h5>
                      <span className="text-xl font-semibold text-yellow-400">{item.price}</span>
                    </div>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="text-center text-xs text-gray-500 mt-8 space-y-1">
                {packagesData.notes.map((note: string, i: number) => <p key={i}>{note}</p>)}
              </div>
            </div>
          </div>
          
          {/* Cocktails & Wines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-20">
            {cocktailsData.map((cat: any) => (
              <div key={cat.category}>
                <h4 className="text-2xl font-bold text-pink-400 mb-4">{cat.category}</h4>
                <ul className="space-y-4">
                  {cat.items.map((item: any) => (
                    <li key={item.name} className="transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] rounded-lg p-2 -m-2">
                      <div className="flex justify-between items-start gap-4">
                        <h5 className="font-semibold text-white">{item.name}</h5>
                        <span className="font-semibold text-white whitespace-nowrap">£{item.price}</span>
                      </div>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
             {winesData.map((cat: any) => (
                <div key={cat.category}>
                    <div className="flex justify-between items-baseline mb-4">
                        <h4 className="text-2xl font-bold text-purple-400">{cat.category}</h4>
                        <div className="text-sm text-gray-400 flex gap-4">
                            {Object.keys(cat.items[0].price).map(p => <span key={p}>{p}</span>)}
                        </div>
                    </div>
                    <ul className="space-y-4">
                    {cat.items.map((item: any) => (
                        <li key={item.name} className="transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] rounded-lg p-2 -m-2">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h5 className="font-semibold text-white">{item.name}</h5>
                                    {item.description && <p className="text-sm text-gray-400 max-w-xs">{item.description}</p>}
                                </div>
                                <div className="font-semibold text-white whitespace-nowrap flex gap-4">
                                    {
                                      Object.values(item.price).map((p: any, i: number) => <span key={i}>£{p}</span>)
                                    }
                                </div>
                            </div>
                        </li>
                    ))}
                    </ul>
                </div>
             ))}
          </div>

          {/* Bottle Service */}
          <div className="text-center mb-20">
             <h3 className="text-4xl md:text-5xl font-bold mb-12">Bottle Service</h3>
             <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 text-left">
                {bottleServiceData.map((cat: any) => (
                    <div key={cat.category}>
                        <h4 className="text-xl font-bold text-yellow-400 mb-4 tracking-widest">{cat.category.toUpperCase()}</h4>
                        <ul>
                            {cat.items.map((item: any) => (
                                <li key={item.name} className="flex justify-between border-b border-dashed border-gray-700 py-1 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] rounded -mx-1 px-1">
                                    <span className="text-gray-300">{item.name}</span>
                                    <span className="text-white font-medium">{item.price}</span>
                                </li>
                            ))}
                        </ul>
                         {cat.note && <p className="text-xs text-gray-500 mt-2">{cat.note}</p>}
                    </div>
                ))}
             </div>
             <p className="text-center text-xs text-gray-500 mt-8">A discretionary 12.5% service charge added to your bill</p>
          </div>
          
           {/* By the Glass & Shots */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    {byTheGlassData.map((cat: any) => (
                        <div key={cat.category} className="mb-8">
                            <h4 className="text-2xl font-bold text-green-400 mb-4">{cat.category}</h4>
                             <ul>
                                {cat.items.map((item: any) => (
                                    <li key={item.name} className="flex justify-between items-start gap-4 py-1">
                                        <div>
                                            <h5 className="font-semibold text-white">{item.name}</h5>
                                            {item.description && <p className="text-sm text-gray-400">{item.description}</p>}
                                        </div>
                                        <span className="font-semibold text-white whitespace-nowrap">£{item.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div>
                     <h4 className="text-2xl font-bold text-red-400 mb-4">{shotsData.title}</h4>
                     <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span></span>
                        <div className="flex gap-4"><span>Single</span><span>Double</span></div>
                     </div>
                     <ul>
                        {shotsData.items.map((item: any) => (
                            <li key={item.name} className="flex justify-between items-center py-1">
                                <span className="font-semibold text-white">{item.name}</span>
                                <div className="flex gap-6 font-semibold text-white">
                                    <span>{item.single}</span>
                                    <span>{item.double}</span>
                                </div>
                            </li>
                        ))}
                     </ul>
                     <div className="mt-8">
                        <h5 className="font-bold text-red-400 mb-1">{shotsData.shooters.title}</h5>
                        <p className="text-sm text-gray-400 mb-2">{shotsData.shooters.prices}</p>
                         <ul className="space-y-2">
                            {shotsData.shooters.items.map((item: any) => (
                                <li key={item.name}>
                                    <h6 className="font-semibold text-white">{item.name}</h6>
                                    <p className="text-xs text-gray-400">{item.description}</p>
                                </li>
                            ))}
                         </ul>
                     </div>
                </div>
           </div>


        </div>
      </section>
    </div>
  );
};

export default DrinksMenu;
