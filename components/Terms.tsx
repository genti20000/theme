
import React from 'react';
import { useData } from '../context/DataContext';

const Terms: React.FC = () => {
  const { termsData } = useData();

  return (
    <section className="bg-black min-h-screen py-20 md:py-28 text-white relative overflow-hidden">
       {/* Background Accent - Festive Colors */}
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-900/20 rounded-full blur-[150px] pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 drop-shadow-lg">Terms & Conditions</h1>
        
        <div className="bg-zinc-900/80 p-8 rounded-3xl border border-red-900/30 backdrop-blur-sm mb-12 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
            <p className="text-gray-300 text-lg leading-relaxed text-center">
                Please read these Terms and Conditions carefully before making a reservation with us. By booking with us, you agree to abide by the following terms and conditions:
            </p>
        </div>

        <div className="space-y-8 mb-12">
          {termsData.map((term, index) => (
            <div key={index} className="bg-zinc-900/80 p-8 rounded-3xl border border-zinc-800 backdrop-blur-sm hover:border-green-800 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold text-yellow-400 group-hover:text-red-400 transition-colors mb-4">{term.title}</h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line text-base md:text-lg">{term.content}</div>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900/80 p-8 rounded-3xl border border-zinc-800 backdrop-blur-sm text-center shadow-lg">
            <p className="text-gray-300 text-lg leading-relaxed">
                By booking with us, you acknowledge that you have read and understood these Terms and Conditions and agree to comply with them. We reserve the right to update these Terms and Conditions at any time, and it is your responsibility to review them before making a reservation.
            </p>
        </div>
      </div>
    </section>
  );
};

export default Terms;
