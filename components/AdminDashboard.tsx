
import React, { useState, useRef, useEffect } from 'react';
import { useData, DrinkCategory } from '../context/DataContext';

const SectionCard: React.FC<{ title: string; children: React.ReactNode; enabled?: boolean; onToggle?: (v: boolean) => void }> = ({ title, children, enabled, onToggle }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8 shadow-sm">
    <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
      <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
          <span className={`w-3 h-3 ${enabled !== false ? 'bg-pink-500 animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'bg-zinc-600'} rounded-full`}></span>
          {title}
      </h3>
      {onToggle && (
        <Toggle label="Section Visibility" checked={enabled !== false} onChange={onToggle} />
      )}
    </div>
    <div className={enabled === false ? 'opacity-40 grayscale pointer-events-none' : ''}>
      {children}
    </div>
  </div>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">{label}</span>
    <div 
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${checked ? 'bg-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.5)]' : 'bg-zinc-800'}`}
    >
      <div className={`absolute top-1 bottom-1 w-4 rounded-full bg-white transition-all duration-300 ${checked ? 'left-7 shadow-[-2px_0_5px_rgba(0,0,0,0.2)]' : 'left-1 shadow-[2px_0_5px_rgba(0,0,0,0.2)]'}`} />
    </div>
  </label>
);

const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string }> = ({ label, value, onChange, type = 'text' }) => (
  <div className="mb-6">
    <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</label>
    <input type={type} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500 transition-all font-medium text-sm" value={value || ''} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="mb-6">
    <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</label>
    <textarea rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500 transition-all font-medium leading-relaxed text-sm" value={value || ''} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const CodeArea: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
    <div className="mb-6">
      <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</label>
      <textarea rows={8} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-4 text-green-400 font-mono outline-none focus:border-pink-500 transition-all text-xs leading-relaxed" spellCheck={false} value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [tab, setTab] = useState('hero');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeLibraryCallback, setActiveLibraryCallback] = useState<(url: string) => void>(() => {});
  const [storageFiles, setStorageFiles] = useState<{name: string, url: string}[]>([]);

  const { 
    isDataLoading, headerData, updateHeaderData, heroData, updateHeroData, highlightsData, updateHighlightsData,
    batteryData, updateBatteryData, galleryData, updateGalleryData, blogData, updateBlogData, 
    faqData, updateFaqData, songs, updateSongs, adminPassword, updateAdminPassword, syncUrl, updateSyncUrl,
    firebaseConfig, updateFirebaseConfig, saveToHostinger, uploadFile, purgeCache,
    featuresData, updateFeaturesData, vibeData, updateVibeData, foodMenu, updateFoodMenu,
    drinksData, updateDrinksData, testimonialsData, updateTestimonialsData,
    infoSectionData, updateInfoSectionData, eventsData, updateEventsData,
    termsData, updateTermsData, fetchServerFiles
  } = useData();

  const batchFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLibraryOpen) {
      fetchServerFiles().then(setStorageFiles);
    }
  }, [isLibraryOpen, fetchServerFiles]);

  const MediaPicker: React.FC<{ label: string; value: string; onChange: (v: string) => void; horizontal?: boolean }> = ({ label, value, onChange, horizontal }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      const url = await uploadFile(file);
      if (url) onChange(url);
      setUploading(false);
    };

    const openLibrary = () => {
      setActiveLibraryCallback(() => (url: string) => {
        onChange(url);
        setIsLibraryOpen(false);
      });
      setIsLibraryOpen(true);
    };

    const isVideo = value?.toLowerCase().match(/\.(mp4|webm|mov)$/);

    return (
      <div className={`mb-6 ${horizontal ? 'flex items-center gap-6' : ''}`}>
        <div className="flex-grow">
          <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className={`bg-zinc-800 rounded-2xl border border-zinc-700 flex-shrink-0 overflow-hidden relative group transition-all ${horizontal ? 'w-24 h-24' : 'w-full sm:w-32 h-32'}`}>
              {value ? (
                isVideo ? (
                  <video src={value} className="w-full h-full object-cover" />
                ) : (
                  <img src={value} className="w-full h-full object-cover" alt="Preview" />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[10px] uppercase font-bold px-2 text-center">No Media</div>
              )}
              {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div></div>}
            </div>
            <div className="flex-1 space-y-2">
              <input className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-pink-500 transition-all font-medium text-xs" placeholder="Direct URL (HTTPS)" value={value || ''} onChange={(e) => onChange(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={() => inputRef.current?.click()} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-black uppercase py-2.5 rounded-xl border border-zinc-700 transition-all">Upload</button>
                <button onClick={openLibrary} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-black uppercase py-2.5 rounded-xl border border-zinc-700 transition-all">Gallery</button>
              </div>
              <input type="file" ref={inputRef} onChange={handleUpload} className="hidden" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i]);
        if (url) {
            updateGalleryData(prev => ({
                ...prev,
                images: [...prev.images, { id: Date.now().toString() + i, url, caption: 'LKC Soho' }]
            }));
        }
    }
  };

  const moveNavItem = (index: number, direction: 'up' | 'down') => {
      const nextOrder = [...(headerData.navOrder || [])];
      if (direction === 'up' && index > 0) {
          [nextOrder[index], nextOrder[index - 1]] = [nextOrder[index - 1], nextOrder[index]];
      } else if (direction === 'down' && index < nextOrder.length - 1) {
          [nextOrder[index], nextOrder[index + 1]] = [nextOrder[index + 1], nextOrder[index]];
      }
      updateHeaderData(prev => ({...prev, navOrder: nextOrder}));
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
      <div className="bg-zinc-900 p-12 rounded-[3rem] border border-zinc-800 w-full max-w-md shadow-2xl">
        <h2 className="text-4xl font-black text-white mb-8 text-center uppercase tracking-tighter italic">LKC <span className="text-pink-500">CMS</span></h2>
        <input type="password" value={passInput} autoFocus onChange={e => setPassInput(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 p-5 rounded-2xl outline-none focus:border-pink-500 text-white mb-6 text-center text-xl tracking-[0.5em]" placeholder="••••••••" />
        <button onClick={() => passInput === adminPassword ? setIsAuthenticated(true) : alert("Invalid Pass")} className="w-full bg-pink-600 text-white font-black py-5 rounded-2xl hover:bg-pink-500 transition-all uppercase tracking-widest text-sm shadow-lg active:scale-95">Enter Control Room</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20 font-sans">
      {/* Media Library Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-zinc-900 w-full max-w-5xl h-[80vh] rounded-[3rem] border border-zinc-800 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">LKC <span className="text-pink-500">Media Library</span></h3>
              <button onClick={() => setIsLibraryOpen(false)} className="bg-zinc-800 p-3 rounded-full hover:bg-zinc-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {storageFiles.map((file, idx) => (
                <button 
                  key={idx} 
                  onClick={() => activeLibraryCallback(file.url)}
                  className="aspect-square bg-zinc-800 rounded-3xl overflow-hidden border border-zinc-700 hover:border-pink-500 transition-all relative group shadow-lg"
                >
                  {file.url.toLowerCase().match(/\.(mp4|webm|mov)$/) ? (
                    <video src={file.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={file.url} className="w-full h-full object-cover" alt="" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-pink-500 text-white text-[10px] font-black uppercase px-4 py-2 rounded-full">Select</span>
                  </div>
                </button>
              ))}
              {storageFiles.length === 0 && <div className="col-span-full py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-sm">No assets found on server.</div>}
            </div>
          </div>
        </div>
      )}

      <div className="bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-50 p-6 flex justify-between items-center px-10">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic">LKC <span className="text-pink-500 font-normal">SOHO</span></h2>
        <div className="flex gap-4">
            <button onClick={saveToHostinger} disabled={isDataLoading} className="bg-pink-600 hover:bg-pink-500 px-10 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(219,39,119,0.4)]">
                {isDataLoading ? 'Syncing...' : 'Publish Site'}
            </button>
        </div>
      </div>

      <div className="flex bg-zinc-900/50 border-b border-zinc-800 overflow-x-auto scrollbar-hide px-8 sticky top-[88px] z-40 backdrop-blur-md">
        {[
          {id: 'hero', icon: '⚡'}, {id: 'nav', icon: '🔗'}, {id: 'seo', icon: '🌍'}, 
          {id: 'about', icon: '🎭'}, {id: 'features', icon: '✨'}, {id: 'vibe', icon: '🔥'}, 
          {id: 'stats', icon: '📊'}, {id: 'food', icon: '🍔'}, {id: 'drinks', icon: '🍹'}, 
          {id: 'events', icon: '📅'}, {id: 'blog', icon: '✍️'}, {id: 'faq', icon: '❓'}, 
          {id: 'gallery', icon: '📸'}, {id: 'config', icon: '⚙️'}
        ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-5 uppercase font-black text-[10px] tracking-widest transition-all relative flex-shrink-0 flex items-center gap-2 ${tab === t.id ? 'text-pink-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <span>{t.icon}</span>
                {t.id}
                {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500"></div>}
            </button>
        ))}
      </div>

      <div className="container mx-auto p-10 max-w-5xl">
        {tab === 'hero' && (
            <SectionCard title="Hero & Stage Settings">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 bg-black/20 p-6 rounded-[2rem] border border-zinc-800">
                  <Toggle label="Festive Badge" checked={heroData.showBadge !== false} onChange={v => updateHeroData(prev => ({...prev, showBadge: v}))} />
                  <Toggle label="CTA Buttons" checked={heroData.showButtons !== false} onChange={v => updateHeroData(prev => ({...prev, showButtons: v}))} />
                </div>
                
                <div className="mb-10">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Text & Content</h4>
                  <Input label="Badge Text (e.g. Winter Wonderland)" value={heroData.badgeText} onChange={v => updateHeroData(prev => ({...prev, badgeText: v}))} />
                  <Input label="Main Heading" value={heroData.headingText} onChange={v => updateHeroData(prev => ({...prev, headingText: v}))} />
                  <TextArea label="Subheading Description" value={heroData.subText} onChange={v => updateHeroData(prev => ({...prev, subText: v}))} />
                </div>

                <div className="space-y-12">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visual Slides & Assets</h4>
                    {heroData.slides.map((s, i) => (
                        <div key={i} className="bg-zinc-800/20 p-8 rounded-[2.5rem] border border-zinc-800 shadow-inner">
                            <div className="flex justify-between items-center mb-6">
                              <span className="text-xs font-black text-zinc-400">SLIDE {i + 1}</span>
                              <button onClick={() => updateHeroData(prev => ({...prev, slides: prev.slides.filter((_, idx) => idx !== i), mobileSlides: prev.mobileSlides?.filter((_, idx) => idx !== i)}))} className="text-red-500 text-[10px] font-black uppercase hover:text-red-400">Delete Slide</button>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-12">
                              <MediaPicker label="Desktop Asset (16:9)" value={s} onChange={v => {
                                  updateHeroData(prev => {
                                    const next = [...prev.slides];
                                    next[i] = v;
                                    return { ...prev, slides: next };
                                  });
                              }} />
                              
                              <div className="border-l border-zinc-800 pl-0 md:pl-12">
                                <MediaPicker label="Mobile Asset (9:16)" value={heroData.mobileSlides?.[i] || ''} onChange={v => {
                                    updateHeroData(prev => {
                                        const next = [...(prev.mobileSlides || [])];
                                        next[i] = v;
                                        return {...prev, mobileSlides: next};
                                    });
                                }} />
                              </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => updateHeroData(prev => ({...prev, slides: [...prev.slides, ''], mobileSlides: [...(prev.mobileSlides || []), '']}))} className="w-full py-6 border-2 border-dashed border-zinc-800 text-xs text-zinc-500 font-black rounded-[2.5rem] hover:border-pink-500 hover:text-pink-500 transition-all flex items-center justify-center gap-2">
                      <span className="text-lg">+</span> ADD NEW SLIDE PAIR
                    </button>
                </div>
            </SectionCard>
        )}

        {tab === 'about' && (
            <SectionCard title="Soho Highlights" enabled={highlightsData.enabled} onToggle={v => updateHighlightsData(prev => ({...prev, enabled: v}))}>
                <Input label="Section Heading" value={highlightsData.heading} onChange={v => updateHighlightsData(prev => ({...prev, heading: v}))} />
                <TextArea label="Introduction Text" value={highlightsData.subtext} onChange={v => updateHighlightsData(prev => ({...prev, subtext: v}))} />
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <MediaPicker label="Desktop Image" value={highlightsData.mainImageUrl} onChange={v => updateHighlightsData(prev => ({...prev, mainImageUrl: v}))} />
                  <MediaPicker label="Mobile Image" value={highlightsData.mobileMainImageUrl || ''} onChange={v => updateHighlightsData(prev => ({...prev, mobileMainImageUrl: v}))} />
                </div>
            </SectionCard>
        )}

        {tab === 'features' && (
            <SectionCard title="The Experience" enabled={featuresData.enabled} onToggle={v => updateFeaturesData(prev => ({...prev, enabled: v}))}>
                <Input label="Experience Heading" value={featuresData.experience.heading} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, heading: v}}))} />
                <TextArea label="Experience Body Copy" value={featuresData.experience.text} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, text: v}}))} />
                <div className="grid md:grid-cols-2 gap-8">
                  <MediaPicker label="Background (Desktop)" value={featuresData.experience.image} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, image: v}}))} />
                  <MediaPicker label="Background (Mobile)" value={featuresData.experience.mobileImage || ''} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, mobileImage: v}}))} />
                </div>
            </SectionCard>
        )}

        {tab === 'vibe' && (
            <SectionCard title="The Vibe & Atmosphere" enabled={vibeData.enabled} onToggle={v => updateVibeData(prev => ({...prev, enabled: v}))}>
                <Input label="Section Heading" value={vibeData.heading} onChange={v => updateVibeData(prev => ({...prev, heading: v}))} />
                <TextArea label="Body Text" value={vibeData.text} onChange={v => updateVibeData(prev => ({...prev, text: v}))} />
                <div className="grid md:grid-cols-2 gap-8">
                  <MediaPicker label="Vibe Background (Desktop MP4/IMG)" value={vibeData.videoUrl || ''} onChange={v => updateVibeData(prev => ({...prev, videoUrl: v}))} />
                  <MediaPicker label="Vibe Background (Mobile MP4/IMG)" value={vibeData.mobileVideoUrl || ''} onChange={v => updateVibeData(prev => ({...prev, mobileVideoUrl: v}))} />
                </div>
            </SectionCard>
        )}

        {tab === 'stats' && (
            <SectionCard title="Song Stat Counter" enabled={batteryData.enabled} onToggle={v => updateBatteryData(prev => ({...prev, enabled: v}))}>
                <div className="grid grid-cols-3 gap-6">
                  <Input label="Prefix" value={batteryData.statPrefix} onChange={v => updateBatteryData(prev => ({...prev, statPrefix: v}))} />
                  <Input label="Number" value={batteryData.statNumber} onChange={v => updateBatteryData(prev => ({...prev, statNumber: v}))} />
                  <Input label="Suffix" value={batteryData.statSuffix} onChange={v => updateBatteryData(prev => ({...prev, statSuffix: v}))} />
                </div>
                <Input label="Subtitle Text" value={batteryData.subText} onChange={v => updateBatteryData(prev => ({...prev, subText: v}))} />
            </SectionCard>
        )}

        {tab === 'faq' && (
            <SectionCard title="Home FAQ Section" enabled={faqData.enabled} onToggle={v => updateFaqData(prev => ({...prev, enabled: v}))}>
                <Input label="Section Heading" value={faqData.heading} onChange={v => updateFaqData(prev => ({...prev, heading: v}))} />
                {faqData.items.map((item, idx) => (
                    <div key={idx} className="bg-zinc-800/30 p-6 rounded-2xl mb-4 border border-zinc-800">
                        <Input label={`Question ${idx + 1}`} value={item.question} onChange={v => {
                            const next = [...faqData.items]; next[idx].question = v; updateFaqData(prev => ({...prev, items: next}));
                        }} />
                        <TextArea label="Answer" value={item.answer} onChange={v => {
                            const next = [...faqData.items]; next[idx].answer = v; updateFaqData(prev => ({...prev, items: next}));
                        }} />
                    </div>
                ))}
            </SectionCard>
        )}

        {tab === 'gallery' && (
            <SectionCard title="Global Gallery Archive">
                <div className="flex items-center gap-4 mb-10 bg-black/40 p-5 rounded-2xl border border-zinc-800">
                    <input type="checkbox" id="sh" checked={galleryData.showOnHome} onChange={e => updateGalleryData(prev => ({...prev, showOnHome: e.target.checked}))} className="w-5 h-5 accent-pink-500 cursor-pointer" />
                    <label htmlFor="sh" className="text-xs font-black uppercase tracking-widest text-zinc-300 cursor-pointer">Show Preview on Home Page</label>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {galleryData.images.map((img, i) => (
                        <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
                            <img src={img.url} className="w-full h-full object-cover" alt="" />
                            <button onClick={() => updateGalleryData(prev => ({...prev, images: prev.images.filter((_, idx) => idx !== i)}))} className="absolute top-2 right-2 bg-red-600/90 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </div>
                    ))}
                    <div className="aspect-square border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center bg-zinc-900/50 hover:border-pink-500 group transition-all cursor-pointer" onClick={() => batchFileRef.current?.click()}>
                        <input type="file" multiple ref={batchFileRef} className="hidden" onChange={handleBatchUpload} />
                        <span className="text-[11px] font-black uppercase text-zinc-500 group-hover:text-pink-500 transition-colors">Batch Upload</span>
                    </div>
                </div>
            </SectionCard>
        )}

        {tab === 'config' && (
            <div className="space-y-12">
                <SectionCard title="Developer & Script Injection">
                    <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-widest leading-relaxed">Paste third-party scripts here (Analytics, Facebook Pixel, Custom CSS, etc.)</p>
                    <CodeArea label="Header Scripts (<head>)" value={headerData.customScripts?.header || ''} onChange={v => updateHeaderData(prev => ({...prev, customScripts: {...prev.customScripts, header: v}}))} />
                    <CodeArea label="Footer Scripts (Before </body>)" value={headerData.customScripts?.footer || ''} onChange={v => updateHeaderData(prev => ({...prev, customScripts: {...prev.customScripts, footer: v}}))} />
                </SectionCard>

                <SectionCard title="CMS Security & API">
                    <Input label="PHP Endpoint URL" value={syncUrl} onChange={v => updateSyncUrl(v)} />
                    <Input label="Auth Secret (CMS Password)" value={adminPassword} onChange={v => updateAdminPassword(v)} type="password" />
                </SectionCard>

                <div className="flex flex-col gap-4">
                  <button onClick={purgeCache} className="w-full py-5 bg-red-600/10 border border-red-600/30 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all">Destroy Local Cache</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
