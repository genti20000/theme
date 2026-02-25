
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.159 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Welcome to London Karaoke Club! 🎤🌟 I'm your virtual host. Need a room, a cocktail recommendation, or have questions about our 80,000+ song library? I'm here to help!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        chatSessionRef.current = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `You are the London Karaoke Club (LKC) Virtual Host. 
                Your tone is energetic, professional, and slightly cheeky—perfect for Soho nightlife.
                
                KEY INFO FOR CUSTOMERS:
                - Location: Heart of Soho, London (near Oxford St, Bond St).
                - Hours: open until 3am.
                - Experience: Private luxury booths (no "padded boxes"), 80,000+ songs, pro-audio.
                - Booking: MUST pre-book via our booking site (https://bookings.londonkaraoke.club). No walk-ins allowed.
                - Age: Strictly 18+. Valid photo ID required.
                - Pricing: Minimum 2 hours. Extension possible if slot is free.
                - Food/Drink: Signature cocktails, gourmet sharing platters. No outside food/drink.
                - WhatsApp: For large events/corporate, contact +44 7761 383514.
                
                FAQs you should handle:
                1. How do I book? (Direct them to https://bookings.londonkaraoke.club).
                2. Can I bring my own booze? (No, we have a fully licensed bar).
                3. What songs do you have? (80k+ songs, updated monthly, browse via smartphone remote in the room).
                4. Can I host a hen party? (Yes! We specialize in hen dos and birthdays).
                
                Be concise. If they ask for something you don't know, suggest they use the WhatsApp button to speak to a human.`,
            },
        });
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !chatSessionRef.current || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
        const resultStream = await chatSessionRef.current.sendMessageStream({ message: userMessage });
        
        let fullResponse = '';
        setMessages(prev => [...prev, { role: 'model', text: '' }]);
        
        for await (const chunk of resultStream) {
            const c = chunk as GenerateContentResponse;
            const text = c.text;
            if (text) {
                fullResponse += text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: fullResponse };
                    return newMessages;
                });
            }
        }
    } catch (error) {
        console.error('Chat error:', error);
        setMessages(prev => [...prev, { role: 'model', text: "The music skipped! 🎶 Can you try saying that again?" }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up h-[500px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                    <div className="bg-black rounded-full p-1.5 shadow-inner">
                        <ChatIcon />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-black text-black text-sm uppercase tracking-tighter">LKC Host</h3>
                      <span className="text-[10px] text-black/70 font-bold uppercase tracking-widest leading-none">Always Online</span>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-black hover:bg-black/10 rounded-full p-1 transition-colors">
                    <CloseIcon />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40 backdrop-blur-md">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-pink-600 text-white rounded-br-none' 
                            : 'bg-zinc-800 text-gray-200 rounded-bl-none border border-zinc-700'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="bg-zinc-800 rounded-2xl rounded-bl-none px-4 py-2 border border-zinc-700 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {/* Fixed: Use lowercase <form> tag and ensure it is properly opened with < */}
            <form onSubmit={handleSend} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about rooms, songs..." 
                    className="flex-1 bg-zinc-800 border-zinc-700 focus:border-yellow-400 focus:ring-0 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 outline-none transition-all"
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || isLoading}
                    className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black p-2 rounded-full transition-all active:scale-90"
                >
                    <SendIcon />
                </button>
            </form>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-yellow-400 hover:bg-yellow-500 text-black p-4 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all duration-300 hover:scale-110 flex items-center justify-center ${isOpen ? 'rotate-90' : ''}`}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
};

export default Chatbot;
