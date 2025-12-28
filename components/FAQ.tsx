import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const FAQ: React.FC = () => {
    const { faqData } = useData();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

  return (
    <section id="faq" className="bg-zinc-950 py-24 border-t border-zinc-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-6">
                {faqData.heading}
            </h2>
            <p className="text-gray-400 text-lg">{faqData.subtext}</p>
        </div>
        
        <div className="space-y-4">
            {faqData.items.map((item, index) => (
                <div 
                    key={index} 
                    className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-300 ${
                        openIndex === index 
                        ? 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.15)]' 
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                >
                    <button 
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                    >
                        <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                            {item.question}
                        </span>
                        <span className={`ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${openIndex === index ? 'bg-pink-500 text-white rotate-180' : 'bg-zinc-800 text-gray-400'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </button>
                    
                    <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="px-6 pb-6 pt-0 text-gray-400 leading-relaxed border-t border-zinc-800/50 mt-2">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
