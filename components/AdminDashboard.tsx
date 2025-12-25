
import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 shadow-sm">
    <h3 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-2 flex items-center gap-2 uppercase tracking-tighter">
        <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
        {title}
    </h3>
    {children}
  </div>
);

const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string }> = ({ label, value, onChange, type = 'text' }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</label>
    <input type={type} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-pink-500 transition-colors" value={value || ''} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</label>
    <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-pink-500 transition-colors" value={value || ''} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [tab, setTab] = useState('seo');
  const { 
    isDataLoading, headerData, updateHeaderData, heroData, updateHeroData, highlightsData, updateHighlightsData,
    featuresData, updateFeaturesData, vibeData, updateVibeData, batteryData, updateBatteryData, 
    testimonialsData, updateTestimonialsData, infoSectionData, updateInfoSectionData, faqData, updateFaqData,
    galleryData, updateGalleryData, blogData, updateBlogData, songs, updateSongs, 
    foodMenu, updateFoodMenu, drinksData, updateDrinksData, adminPassword, syncUrl, updateSyncUrl,
    firebaseConfig, updateFirebaseConfig, saveToHostinger, saveToFirebase, uploadFile, purgeCache
  } = useData();

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-6 text-center uppercase tracking-tighter">LKC <span className="text-pink-500">CMS</span></h2>
        <input type="password" value={passInput} onChange={e => setPassInput(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl outline-none focus:border-pink-500 text-white mb-4" placeholder="••••••••" />
        <button onClick={() => passInput === adminPassword ? setIsAuthenticated(true) : alert("Wrong")} className="w-full bg-pink-600 text-white font-black py-4 rounded-xl hover:bg-pink-500 transition-all uppercase tracking-widest text-xs">Access Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20 font-sans">
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50 p-4 flex justify-between items-center px-8">
        <h2 className="text-xl font-black uppercase tracking-tighter">LKC <span className="text-pink-500">Admin</span></h2>
        <div className="flex gap-4">
            <button onClick={saveToFirebase} disabled={isDataLoading} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Firebase Sync</button>
            <button onClick={saveToHostinger} disabled={isDataLoading} className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-widest animate-pulse shadow-lg">
                {isDataLoading ? 'Saving...' : 'Save & Deploy'}
            </button>
        </div>
      </div>

      <div className="flex bg-zinc-900 border-b border-zinc-800 overflow-x-auto scrollbar-hide px-4">
        {['seo', 'hero', 'about', 'vibe', 'info', 'faq', 'reviews', 'blog', 'songs', 'config'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-4 uppercase font-black text-[10px] tracking-widest transition-all ${tab === t ? 'text-pink-500 border-b-2 border-pink-500 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}>
                {t}
            </button>
        ))}
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        {tab === 'seo' && (
            <SectionCard title="Global SEO & Branding">
                <Input label="Site Title (Browser Tab)" value={headerData.siteTitle} onChange={v => updateHeaderData({...headerData, siteTitle: v})} />
                <TextArea label="Meta Description" value={headerData.siteDescription} onChange={v => updateHeaderData({...headerData, siteDescription: v})} />
                <Input label="Logo URL" value={headerData.logoUrl} onChange={v => updateHeaderData({...headerData, logoUrl: v})} />
            </SectionCard>
        )}

        {tab === 'hero' && (
            <SectionCard title="Hero & Slides">
                <Input label="Badge Text" value={heroData.badgeText} onChange={v => updateHeroData({...heroData, badgeText: v})} />
                <Input label="Heading" value={heroData.headingText} onChange={v => updateHeroData({...heroData, headingText: v})} />
                <TextArea label="Subtext" value={heroData.subText} onChange={v => updateHeroData({...heroData, subText: v})} />
                <div className="space-y-4 mt-6">
                    <label className="text-[10px] font-black text-gray-500">SLIDES (URLs)</label>
                    {heroData.slides.map((s, i) => (
                        <div key={i} className="flex gap-2">
                            <input className="flex-1 bg-zinc-800 border border-zinc-700 p-2 rounded text-xs" value={s} onChange={e => {
                                const next = [...heroData.slides]; next[i] = e.target.value; updateHeroData({...heroData, slides: next});
                            }} />
                            <button onClick={() => updateHeroData({...heroData, slides: heroData.slides.filter((_, idx) => idx !== i)})} className="text-red-500">×</button>
                        </div>
                    ))}
                    <button onClick={() => updateHeroData({...heroData, slides: [...heroData.slides, '']})} className="w-full py-2 border-2 border-dashed border-zinc-800 text-xs text-gray-500">+ ADD SLIDE</button>
                </div>
            </SectionCard>
        )}

        {tab === 'info' && (
            <SectionCard title="Main Information Sections">
                <Input label="Main Heading" value={infoSectionData.heading} onChange={v => updateInfoSectionData({...infoSectionData, heading: v})} />
                {infoSectionData.sections.map((s, i) => (
                    <div key={i} className="border border-zinc-800 p-4 rounded-xl mb-4">
                        <Input label={`Section ${i+1} Title`} value={s.title} onChange={v => {
                            const next = [...infoSectionData.sections]; next[i].title = v; updateInfoSectionData({...infoSectionData, sections: next});
                        }} />
                        <TextArea label="Content" value={s.content} onChange={v => {
                            const next = [...infoSectionData.sections]; next[i].content = v; updateInfoSectionData({...infoSectionData, sections: next});
                        }} />
                        <button onClick={() => updateInfoSectionData({...infoSectionData, sections: infoSectionData.sections.filter((_, idx) => idx !== i)})} className="text-red-500 text-[10px]">DELETE SECTION</button>
                    </div>
                ))}
                <button onClick={() => updateInfoSectionData({...infoSectionData, sections: [...infoSectionData.sections, {title: '', content: ''}]})} className="w-full py-2 border-2 border-dashed border-zinc-800 text-xs">+ ADD SECTION</button>
            </SectionCard>
        )}

        {tab === 'faq' && (
            <SectionCard title="Frequently Asked Questions">
                <Input label="Heading" value={faqData.heading} onChange={v => updateFaqData({...faqData, heading: v})} />
                {faqData.items.map((it, i) => (
                    <div key={i} className="mb-6 p-4 bg-zinc-800/20 rounded-xl">
                        <Input label="Question" value={it.question} onChange={v => {
                            const next = [...faqData.items]; next[i].question = v; updateFaqData({...faqData, items: next});
                        }} />
                        <TextArea label="Answer" value={it.answer} onChange={v => {
                            const next = [...faqData.items]; next[i].answer = v; updateFaqData({...faqData, items: next});
                        }} />
                        <button onClick={() => updateFaqData({...faqData, items: faqData.items.filter((_, idx) => idx !== i)})} className="text-red-500 text-[10px]">REMOVE FAQ</button>
                    </div>
                ))}
                <button onClick={() => updateFaqData({...faqData, items: [...faqData.items, {question: '', answer: ''}]})} className="w-full py-3 border-2 border-dashed border-zinc-800 text-xs text-gray-500 font-black uppercase tracking-widest">+ NEW FAQ</button>
            </SectionCard>
        )}

        {tab === 'songs' && (
            <SectionCard title="Karaoke Library Management">
                <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-widest">Managing {songs.length} songs.</p>
                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2 mb-6 scrollbar-hide">
                    {songs.map((s, i) => (
                        <div key={i} className="flex gap-2 bg-zinc-800/30 p-2 rounded text-xs border border-zinc-800">
                            <input className="bg-transparent outline-none flex-1 border-b border-zinc-700" value={s.title} onChange={e => {
                                const next = [...songs]; next[i].title = e.target.value; updateSongs(next);
                            }} />
                            <input className="bg-transparent outline-none flex-1 border-b border-zinc-700" value={s.artist} onChange={e => {
                                const next = [...songs]; next[i].artist = e.target.value; updateSongs(next);
                            }} />
                            <button onClick={() => updateSongs(songs.filter((_, idx) => idx !== i))} className="text-red-500 px-2 font-black">×</button>
                        </div>
                    ))}
                </div>
                <button onClick={() => updateSongs([{id: Date.now().toString(), title: 'New Song', artist: 'Artist'}, ...songs])} className="w-full py-4 bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-700 transition-colors">+ ADD TRACK TO LIBRARY</button>
            </SectionCard>
        )}

        {tab === 'config' && (
            <>
                <SectionCard title="Firebase Setup">
                    <Input label="Realtime Database URL" value={firebaseConfig.databaseURL} onChange={v => updateFirebaseConfig({...firebaseConfig, databaseURL: v})} />
                    <Input label="Auth Secret / API Key" value={firebaseConfig.apiKey} onChange={v => updateFirebaseConfig({...firebaseConfig, apiKey: v})} type="password" />
                </SectionCard>
                <SectionCard title="Hostinger Sync">
                    <Input label="Sync URL (db.php)" value={syncUrl} onChange={v => updateSyncUrl(v)} />
                </SectionCard>
                <SectionCard title="System">
                    <button onClick={purgeCache} className="bg-red-600/10 border border-red-600 text-red-500 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all w-full">Purge Local Cache & Force Reload</button>
                </SectionCard>
            </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
