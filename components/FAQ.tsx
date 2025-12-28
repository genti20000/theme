
import React, { useState } from 'react';

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqData = [
        {
            question: "What are the opening hours?",
            answer: "We are open daily from 2pm to 3am. Perfect for afternoon warm-ups or late-night encores."
        },
        {
            question: "Do I need to book in advance?",
            answer: "Yes, pre-booking is essential to guarantee your private room. We do not accept walk-ins. You can check real-time availability and book instantly through our website."
        },
        {
            question: "What is the cost of booking a karaoke room?",
            answer: "Prices vary based on group size, day of the week, and booking duration (minimum 2 hours). Please check our booking system for exact pricing for your group."
        },
        {
            question: "Is food and drink included?",
            answer: "The booking fee covers exclusive use of the room. Food and drinks are ordered separately from our delicious menu. We also offer pre-booked drinks packages for better value."
        },
        {
            question: "Can I bring my own food and drinks?",
            answer: "No outside food or drinks are permitted. Don't worry, our bar is fully stocked with cocktails, beers, wines, and soft drinks, plus a great food menu!"
        },
        {
            question: "Is there an age limit?",
            answer: "Yes, we are a strictly 18+ venue. Valid photo ID (Passport or Driving License) is required for entry."
        },
        {
            question: "Do you have a dress code?",
            answer: "We love a bit of sparkle! The dress code is smart-casual, but feel free to glam up, wear costumes, or bring props. Just be fabulous."
        },
        {
            question: "How many songs do you have?",
            answer: "Our library boasts over 80,000 songs in multiple languages, updated monthly. From rock anthems to pop classics, we've got your jam."
        },
        {
            question: "Can I extend my booking on the night?",
            answer: "If there is no booking immediately after yours, we are happy to extend your session! Just ask a member of our team early on."
        },
        {
            question: "How do I contact you?",
            answer: "The fastest way to reach us is via the WhatsApp button on this screen. Alternatively, you can email us for corporate or large event enquiries."
        }
    ];

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
                Common Questions
            </h2>
            <p className="text-gray-400 text-lg">Everything you need to know before you sing your heart out.</p>
        </div>
        
        <div className="space-y-4">
            {faqData.map((item, index) => (
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
