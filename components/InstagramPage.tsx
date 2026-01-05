import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

interface StoryViewerProps {
  highlight: { title: string; imageUrl: string; link: string };
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ highlight, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onClose();
          return 100;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds total duration

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950 flex items-center justify-center animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg h-full md:h-[90vh] md:rounded-3xl overflow-hidden shadow-2xl bg-black">
        {/* Progress Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
          <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 z-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-pink-500 overflow-hidden bg-zinc-900">
              <img 
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m7V3XokxQ0Hbg2KE/new-YNq2gqz36OInJMrE.png" 
                alt="LKC" 
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <p className="text-white text-sm font-bold">londonkaraoke.club</p>
              <p className="text-white/60 text-xs font-medium">Just now</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Story Content */}
        <img 
          src={highlight.imageUrl || 'https://picsum.photos/seed/insta/800/1200'} 
          alt={highlight.title} 
          className="w-full h-full object-cover"
        />

        {/* Footer Link */}
        <a 
          href={highlight.link || "https://www.sumupbookings.com/londonkaraokeclub"}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest border border-white/30 hover:bg-white hover:text-black transition-all"
        >
          Book Now
        </a>
      </div>
      <div className="absolute inset-0 -z-10 cursor-pointer" onClick={onClose}></div>
    </div>
  );
};

const InstagramPage: React.FC = () => {
  const { instagramHighlightsData, galleryData } = useData();
  const [activeStory, setActiveStory] = useState<any>(null);

  const username = instagramHighlightsData.username || "@londonkaraoke.club";

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20 selection:bg-pink-500">
      {activeStory && <StoryViewer highlight={activeStory} onClose={() => setActiveStory(null)} />}

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-zinc-900 pb-12">
            <div className="relative group cursor-pointer">
                <div className="relative p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 animate-pulse-slow">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black overflow-hidden bg-zinc-900">
                        <img 
                            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/m7V3XokxQ0Hbg2KE/new-YNq2gqz36OInJMrE.png" 
                            alt="Profile" 
                            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-pink-600 text-[10px] font-black uppercase px-2 py-0.5 rounded border-2 border-black tracking-tighter">Live</div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <h1 className="text-2xl font-bold">{username.replace('@', '')}</h1>
                    <div className="flex gap-2">
                        <a 
                            href={`https://instagram.com/${username.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-pink-600 hover:bg-pink-500 px-6 py-1.5 rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95"
                        >
                            Follow
                        </a>
                        <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">
                            Message
                        </button>
                    </div>
                </div>
                <div className="flex justify-center md:justify-start gap-6 text-sm">
                    <span><strong className="text-white">128</strong> posts</span>
                    <span><strong className="text-white">12.5k</strong> followers</span>
                    <span><strong className="text-white">150</strong> following</span>
                </div>
                <div>
                    <h2 className="font-bold text-lg">London Karaoke Club 🎤 Soho</h2>
                    <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                        Luxury Private Karaoke Suites • 80k+ Songs • Pro Audio • Signature Cocktails • Open til 3AM • No Chains, Just Vocals 📍 Soho, London
                    </p>
                    <a href="https://www.sumupbookings.com/londonkaraokeclub" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 font-bold hover:underline flex items-center gap-1 justify-center md:justify-start mt-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        sumupbookings.com/londonkaraokeclub
                    </a>
                </div>
            </div>
        </div>

        {/* Highlights Section */}
        <div className="mb-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-zinc-800"></span>
                Story Highlights
            </h3>
            <div className="flex gap-6 md:gap-10 overflow-x-auto pb-6 scrollbar-hide px-2">
                {instagramHighlightsData.highlights.length > 0 ? (
                    instagramHighlightsData.highlights.map((h) => (
                        <button 
                            key={h.id}
                            onClick={() => setActiveStory(h)}
                            className="flex flex-col items-center gap-3 flex-shrink-0 group"
                        >
                            <div className="relative p-0.5 rounded-full border border-zinc-800 transition-transform duration-300 group-hover:scale-105 active:scale-95">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-black overflow-hidden bg-zinc-900 ring-2 ring-zinc-800 ring-offset-2 ring-offset-black group-hover:ring-pink-500">
                                    <img 
                                        src={h.imageUrl || 'https://picsum.photos/seed/insta/200/200'} 
                                        alt={h.title} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest">
                                {h.title}
                            </span>
                        </button>
                    ))
                ) : (
                    <div className="flex gap-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-900 border border-zinc-800"></div>
                                <div className="w-10 h-2 bg-zinc-900 rounded"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Post Grid (Tab Bar) */}
        <div className="border-t border-zinc-900">
            <div className="flex justify-center gap-12">
                <button className="flex items-center gap-2 py-4 border-t border-white -mt-[1px] text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Posts
                </button>
                <button className="flex items-center gap-2 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-300 transition-colors">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                    Reels
                </button>
            </div>

            <div className="grid grid-cols-3 gap-1 md:gap-4 mt-2 md:mt-4">
                {/* Use gallery images as simulated Instagram posts */}
                {galleryData.images.length > 0 ? (
                    galleryData.images.map((img) => (
                        <div key={img.id} className="aspect-square relative group cursor-pointer overflow-hidden bg-zinc-900 border border-zinc-800/30">
                            <img src={img.url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 md:gap-8">
                                <div className="flex items-center gap-1 md:gap-2">
                                    <svg className="w-4 h-4 md:w-6 md:h-6 fill-white" viewBox="0 0 24 24">
                                      <path d="M12.1 20.9l-.1.1-.1c-1.1-.7-2.1-1.4-3.2-2.1-1.4-.9-2.9-1.9-4.3-2.8l-.1-.1c-.1-.1-.1-.1-.2-.2C3.2 14.8 2 13.5 2 12c0-1.5 1.2-2.8 2.3-3.8.1-.1.1-.1.2-.2l.1-.1c1.4-.9 2.9-1.9 4.3-2.8 1.1-.7 2.1-1.4 3.2-2.1l.1-.1.1.1c1.1.7 2.1 1.4 3.2 2.1 1.4.9 2.9 1.9 4.3 2.8l.1.1c.1.1.1.1.2.2 1.1 1 2.3 2.3 2.3 3.8 0 1.5-1.2 2.8-2.3 3.8-.1.1-.1.1-.2.2l-.1.1c-1.4.9-2.9 1.9-4.3 2.8-1.1.7-2.1 1.4-3.2 2.1z"/>
                                    </svg>
                                    <span className="font-black text-xs md:text-lg">2.4k</span>
                                </div>
                                <div className="flex items-center gap-1 md:gap-2">
                                    <svg className="w-4 h-4 md:w-6 md:h-6 fill-white" viewBox="0 0 24 24">
                                      <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z"/>
                                    </svg>
                                    <span className="font-black text-xs md:text-lg">156</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center">
                        <div className="w-20 h-20 mx-auto border-4 border-zinc-800 rounded-full mb-6 flex items-center justify-center">
                            <svg className="w-10 h-10 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <h4 className="text-xl font-bold text-zinc-500">No Posts Yet</h4>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramPage;