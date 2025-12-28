
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
            <div className="max-w-4xl mx-auto bg-zinc-900/80 border-2 border-yellow-400 p-8 rounded-3xl shadow-[0_0_30px_rgba(250,204,21,0.2)]">
              <h4 className="text-3xl font-black text-center mb-2 uppercase tracking-tighter italic">LKC <span className="text-yellow-400">Packages</span></h4>
              <p className="text-center text-gray-400 mb-8 font-medium">{packagesData.subtitle}</p>
              <div className="grid md:grid-cols-2 gap-8">
                {packagesData.items.map((item: any) => (
                  <div key={item.name} className="p-6 bg-black/50 rounded-2xl border border-zinc-800 hover:border-yellow-400 transition-colors">
                    <div className="flex justify-between items-baseline mb-3">
                      <h5 className="text-xl font-bold text-white">{item.name}</h5>
                      <span className="text-xl font-black text-yellow-400">{item.price}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="text-center text-[10px] text-zinc-500 mt-10 space-y-1 font-black uppercase tracking-widest">
                {packagesData.notes.map((note: string, i: number) => <p key={i}>{note}</p>)}
              </div>
            </div>
          </div>
          
          {/* Cocktails Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12 mb-20 max-w-6xl mx-auto">
            {cocktailsData.map((cat: any) => (
              <div key={cat.category}>
                <h4 className="text-3xl font-black text-pink-500 mb-8 uppercase tracking-tighter italic border-b border-zinc-800 pb-2">{cat.category}</h4>
                <ul className="space-y-8">
                  {cat.items.map((item: any) => (
                    <li key={item.name} className="group">
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <h5 className="font-bold text-white text-lg group-hover:text-pink-400 transition-colors">{item.name}</h5>
                        <div className="flex-grow border-b border-zinc-900 border-dotted mt-4"></div>
                        <span className="font-bold text-white whitespace-nowrap">£{item.price}</span>
                      </div>
                      <p className="text-sm text-zinc-400 font-medium">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Wines Table */}
          <div className="mb-20 max-w-6xl mx-auto">
            {winesData.map((cat: any) => (
                <div key={cat.category}>
                    <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-2">
                        <h4 className="text-3xl font-black text-purple-500 uppercase tracking-tighter italic">{cat.category}</h4>
                        <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                             <span className="w-12 text-center">175ml</span>
                             <span className="w-12 text-center">250ml</span>
                             <span className="w-12 text-center">Btl</span>
                        </div>
                    </div>
                    <ul className="space-y-6">
                    {cat.items.map((item: any) => (
                        <li key={item.name} className="group flex justify-between items-start gap-6 border-b border-zinc-900 pb-4">
                            <div className="flex-1">
                                <h5 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">{item.name}</h5>
                                {item.description && <p className="text-sm text-zinc-500 font-medium">{item.description}</p>}
                            </div>
                            <div className="flex gap-8 font-black text-white">
                                <span className="w-12 text-center">{item.price['175ml'] ? `£${item.price['175ml']}` : '-'}</span>
                                <span className="w-12 text-center">{item.price['250ml'] ? `£${item.price['250ml']}` : '-'}</span>
                                <span className="w-12 text-center">{item.price['Btl'] ? `£${item.price['Btl']}` : '-'}</span>
                            </div>
                        </li>
                    ))}
                    </ul>
                </div>
            ))}
          </div>

          {/* Bottle Service */}
          <div className="text-center mb-32 bg-zinc-900/30 p-12 rounded-[3rem] border border-zinc-800 shadow-2xl">
             <h3 className="text-4xl md:text-5xl font-black mb-16 uppercase tracking-tighter italic">Bottle <span className="text-yellow-400">Service</span></h3>
             <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-16 text-left">
                {bottleServiceData.map((cat: any) => (
                    <div key={cat.category}>
                        <h4 className="text-xs font-black text-yellow-500 mb-6 tracking-[0.3em] uppercase">{cat.category}</h4>
                        <ul className="space-y-4">
                            {cat.items.map((item: any) => (
                                <li key={item.name} className="flex justify-between items-baseline group">
                                    <span className="text-zinc-400 group-hover:text-white transition-colors text-sm font-medium">{item.name}</span>
                                    <div className="flex-grow border-b border-zinc-800 mx-2 mt-3 opacity-30"></div>
                                    <span className="text-white font-black">{item.price}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
             </div>
             <p className="text-center text-[10px] font-black text-zinc-600 mt-20 uppercase tracking-[0.2em]">A discretionary 12.5% service charge added to your bill</p>
          </div>
          
           {/* Beers & Shots */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-24 max-w-6xl mx-auto">
                <div>
                    {byTheGlassData.map((cat: any) => (
                        <div key={cat.category} className="mb-12">
                            <h4 className="text-3xl font-black text-green-500 mb-8 uppercase tracking-tighter italic border-b border-zinc-800 pb-2">{cat.category}</h4>
                             <ul className="space-y-6">
                                {cat.items.map((item: any) => (
                                    <li key={item.name} className="flex justify-between items-baseline group">
                                        <h5 className="font-bold text-white text-lg group-hover:text-green-400 transition-colors">{item.name}</h5>
                                        <div className="flex-grow border-b border-zinc-800 border-dotted mx-4"></div>
                                        <span className="font-black text-white">£{item.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div>
                     <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-2">
                         <h4 className="text-3xl font-black text-red-500 uppercase tracking-tighter italic">{shotsData.title}</h4>
                         <div className="flex gap-12 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                             <span className="w-12 text-center">Single</span>
                             <span className="w-12 text-center">Double</span>
                         </div>
                     </div>
                     <ul className="space-y-6 mb-16">
                        {shotsData.items.map((item: any) => (
                            <li key={item.name} className="flex justify-between items-baseline group">
                                <span className="font-bold text-white text-lg group-hover:text-red-400 transition-colors">{item.name}</span>
                                <div className="flex-grow border-b border-zinc-800 border-dotted mx-4"></div>
                                <div className="flex gap-12 font-black text-white">
                                    <span className="w-12 text-center">£{item.single}</span>
                                    <span className="w-12 text-center">£{item.double}</span>
                                </div>
                            </li>
                        ))}
                     </ul>
                     <div className="p-8 bg-red-900/10 border border-red-900/30 rounded-3xl backdrop-blur-sm">
                        <h5 className="font-black text-red-500 text-xl uppercase tracking-tighter mb-1 italic">{shotsData.shooters.title}</h5>
                        <p className="text-xs font-black text-zinc-500 mb-6 uppercase tracking-widest">{shotsData.shooters.prices}</p>
                         <ul className="grid grid-cols-2 gap-6">
                            {shotsData.shooters.items.map((item: any) => (
                                <li key={item.name}>
                                    <h6 className="font-bold text-white text-sm mb-1">{item.name}</h6>
                                    <p className="text-xs text-zinc-500 font-medium">{item.description}</p>
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
