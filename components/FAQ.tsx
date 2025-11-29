
import React, { useMemo } from 'react';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => (
    <details className="group bg-red-950/40 backdrop-blur-sm border border-red-900/50 rounded-lg p-6 mb-4 transition-all hover:border-green-500 open:border-green-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] open:shadow-[0_0_15px_rgba(34,197,94,0.2)]">
        <summary className="flex justify-between items-center font-bold text-lg text-white cursor-pointer list-none focus:outline-none">
            <span className="group-hover:text-green-400 transition-colors">{question}</span>
            <span className="transform group-open:rotate-180 transition-transform duration-300 text-red-500 group-open:text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </span>
        </summary>
        <div className="mt-4 text-gray-200 text-sm leading-relaxed animate-fade-in-up border-t border-dashed border-red-900/50 pt-4">
            {answer}
        </div>
    </details>
);

const FAQ: React.FC = () => {
    const faqData = [
        {
            question: "What are the opening hours?",
            answer: "You can check this via our booking system online."
        },
        {
            question: "Do I need to book in advance?",
            answer: "Yes, pre-booking is mandatory. You can check availability and book through our online booking system available on our website."
        },
        {
            question: "What is the cost of booking a karaoke room?",
            answer: "Prices vary depending on the group size and booking duration. The minimum booking is 2 hours. Check our booking system for real-time pricing and to book for up to 50 guests."
        },
        {
            question: "Is food and drink included in the booking price?",
            answer: "No, but we have a full menu available to purchase throughout your stay."
        },
        {
            question: "Can I bring my own food and drinks?",
            answer: "Outside food and drinks are not permitted. We’ve got everything you need right here."
        },
        {
            question: "Is there an age limit to enter the club?",
            answer: "Yes, we’re an 18+ venue. Adults only, baby."
        },
        {
            question: "Do you have a dress code?",
            answer: "Come as you are or glam it up — costumes, masks, sequins... we love it all. Just be fabulous."
        },
        {
            question: "How many songs are available, and in which languages?",
            answer: "We have over 65,000 songs in English and many other languages. There's something for everyone."
        },
        {
            question: "Can I extend my booking time on the spot?",
            answer: "Yes, subject to availability. Let us know early during your visit to avoid disappointment."
        },
        {
            question: "How can I contact the club for more information?",
            answer: "You can message us anytime via WhatsApp. We’re here to help!"
        }
    ];

    // Generate static snowflakes
    const snowflakes = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 5 + 5,
        size: Math.random() * 10 + 8
    })), []);

  return (
    <section id="faq" className="bg-black py-16 border-t border-zinc-800 relative overflow-hidden">
        {/* Festive Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/20 to-red-950/20 pointer-events-none"></div>

        {/* Snowflakes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {snowflakes.map((s) => (
                <div 
                    key={s.id}
                    className="absolute text-white/30 animate-[fall_linear_infinite]"
                    style={{
                        left: `${s.left}%`,
                        animationDuration: `${s.duration}s`,
                        animationDelay: `${s.delay}s`,
                        top: '-20px',
                        fontSize: `${s.size}px`
                    }}
                >
                    ❄
                </div>
            ))}
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-20px); opacity: 0; }
                    10% { opacity: 0.8; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
            `}</style>
        </div>

      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-green-500 drop-shadow-md font-heading">
                Christmas FAQ
            </h2>
            <p className="text-gray-400 mt-4 text-lg flex justify-center items-center gap-2">
                <span className="text-red-500 text-2xl">🎄</span> Everything you need to know for the festive season <span className="text-green-500 text-2xl">🎄</span>
            </p>
        </div>
        
        <div className="space-y-2">
            {faqData.map((item, index) => (
                <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
