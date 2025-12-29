
import React, { useState, useRef, useEffect } from 'react';
import { useData, DrinkCategory, MenuCategory, BlogPost } from '../context/DataContext';
import ImageOptimizer, { PresetType, optimizeImage } from './ImageOptimizer';
import { GoogleGenAI } from "@google/genai";

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
  const [aiLoading, setAiLoading] = useState(false);
  const [groundingSources, setGroundingSources] = useState<{title: string, uri: string}[]>([]);
  const [aiStep, setAiStep] = useState<string>('');

  const { 
    isDataLoading, headerData, updateHeaderData, heroData, updateHeroData, highlightsData, updateHighlightsData,
    batteryData, updateBatteryData, galleryData, updateGalleryData, blogData, updateBlogData, 
    faqData, updateFaqData, songs, updateSongs, adminPassword, updateAdminPassword, syncUrl, updateSyncUrl,
    saveToHostinger, uploadFile, purgeCache,
    foodMenu, updateFoodMenu,
    fetchServerFiles, optimizationSettings, updateOptimizationSettings
  } = useData();

  const batchFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLibraryOpen) {
      fetchServerFiles().then(setStorageFiles);
    }
  }, [isLibraryOpen, fetchServerFiles]);

  const handleAiSeoOptimize = async (mode: 'fast' | 'trend' | 'deep') => {
    setAiLoading(true);
    setGroundingSources([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      let model = 'gemini-2.5-flash-lite-latest';
      let config: any = { responseMimeType: "application/json" };
      let prompt = `Analyze the current Soho karaoke club scene. Propose a JSON site title (max 60 chars) and meta description (max 160 chars) for "London Karaoke Club". 
                   Context: "${highlightsData.subtext}". 
                   Return format: {"title": "...", "description": "..."}`;

      if (mode === 'fast') {
        setAiStep('Initiating low-latency response...');
        model = 'gemini-2.5-flash-lite-latest';
      } else if (mode === 'trend') {
        setAiStep('Searching Google for latest Soho trends...');
        model = 'gemini-3-flash-preview';
        config.tools = [{ googleSearch: {} }];
        prompt = `Search for the most trending nightlife and karaoke keywords in London Soho for 2024/2025. 
                 Based on the search results, suggest a highly optimized site title and meta description for "London Karaoke Club". 
                 Return format: {"title": "...", "description": "..."}`;
      } else if (mode === 'deep') {
        setAiStep('Engaging Deep Thinking mode for strategic analysis...');
        model = 'gemini-3-pro-preview';
        config.thinkingConfig = { thinkingBudget: 32768 };
        prompt = `As a world-class SEO strategist, perform a deep analysis of "London Karaoke Club" brand positioning. 
                 Consider psychological hooks for party groups, Soho's competitive landscape, and premium service delivery. 
                 Think through the optimal metadata strategy, then provide a JSON object with "title" and "description".`;
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const text = response.text;
      if (text) {
        const cleaned = text.replace(/```json|```/g, '').trim();
        const result = JSON.parse(cleaned);
        updateHeaderData(prev => ({
          ...prev,
          siteTitle: result.title || prev.siteTitle,
          siteDescription: result.description || prev.siteDescription
        }));
      }

      // Extract grounding sources if trend mode used Search
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const sources = chunks
          .filter((chunk: any) => chunk.web)
          .map((chunk: any) => ({
            title: chunk.web.title || 'Market Source',
            uri: chunk.web.uri
          }));
        setGroundingSources(sources);
      }
      setAiStep('Optimization complete!');
      setTimeout(() => setAiStep(''), 3000);
    } catch (e) {
      console.error("AI SEO Error:", e);
      alert("AI task failed. Ensure your API key is valid and you are using a supported model.");
      setAiStep('Error encountered.');
    } finally {
      setAiLoading(false);
    }
  };

  const MediaPicker: React.FC<{ label: string; value: string; onChange: (v: string) => void; horizontal?: boolean; preset?: PresetType }> = ({ label, value, onChange, horizontal, preset = 'general' }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [optimizerFile, setOptimizerFile] = useState<File | null>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (optimizationSettings.enabled && file.type.startsWith('image/')) {
        setOptimizerFile(file);
      } else {
        await processAndUpload(file);
      }
    };

    const processAndUpload = async (file: File | Blob) => {
        setUploading(true);
        const url = await uploadFile(file);
        if (url) onChange(url);
        setUploading(false);
        setOptimizerFile(null);
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
        {optimizerFile && (
            <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <ImageOptimizer 
                        file={optimizerFile} 
                        preset={preset}
                        quality={optimizationSettings.quality}
                        maxWidths={{
                            hero: optimizationSettings.maxHeroWidth,
                            gallery: optimizationSettings.maxGalleryWidth,
                            general: optimizationSettings.maxGeneralWidth
                        }}
                        onOptimized={(res) => processAndUpload(res.blob)}
                        onCancel={() => processAndUpload(optimizerFile)}
                    />
                </div>
            </div>
        )}
      </div>
    );
  };

  const moveNavItem = (index: number, direction: 'up' | 'down') => {
      const nextOrder = [...(headerData.navOrder || ["menu", "gallery", "blog", "drinks", "events", "songs"])];
      if (direction === 'up' && index > 0) {
          [nextOrder[index], nextOrder[index - 1]] = [nextOrder[index - 1], nextOrder[index]];
      } else if (direction === 'down' && index < nextOrder.length - 1) {
          [nextOrder[index], nextOrder[index + 1]] = [nextOrder[index + 1], nextOrder[index]];
      }
      updateHeaderData(prev => ({...prev, navOrder: nextOrder}));
  };

  const removeNavItem = (index: number) => {
      const nextOrder = [...(headerData.navOrder || ["menu", "gallery", "blog", "drinks", "events", "songs"])];
      nextOrder.splice(index, 1);
      updateHeaderData(prev => ({...prev, navOrder: nextOrder}));
  };

  const addNavItem = (link: string) => {
      const nextOrder = [...(headerData.navOrder || ["menu", "gallery", "blog", "drinks", "events", "songs"])];
      if (!nextOrder.includes(link)) {
          nextOrder.push(link);
          updateHeaderData(prev => ({...prev, navOrder: nextOrder}));
      }
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
          {id: 'food', icon: '🍔'}, {id: 'config', icon: '⚙️'}
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
                <Toggle label="Festive Badge" checked={heroData.showBadge !== false} onChange={v => updateHeroData(prev => ({...prev, showBadge: v}))} />
                <Input label="Main Heading" value={heroData.headingText} onChange={v => updateHeroData(prev => ({...prev, headingText: v}))} />
                <TextArea label="Subheading Description" value={heroData.subText} onChange={v => updateHeroData(prev => ({...prev, subText: v}))} />
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visual Slides</h4>
                    {heroData.slides.map((s, i) => (
                        <div key={i} className="bg-zinc-800/20 p-6 rounded-2xl border border-zinc-800 flex gap-4">
                             <MediaPicker label={`Slide ${i+1}`} value={s} onChange={v => {
                                 const next = [...heroData.slides]; next[i] = v; updateHeroData(prev => ({...prev, slides: next}));
                             }} />
                        </div>
                    ))}
                </div>
            </SectionCard>
        )}

        {tab === 'nav' && (
            <SectionCard title="Navigation Bar Order">
                <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-widest leading-relaxed">Drag/Sort remove logic: Items listed here appear in the fly menu. Use the arrows to reorder.</p>
                
                <div className="space-y-3 mb-8">
                    {(headerData.navOrder || ["menu", "gallery", "blog", "drinks", "events", "songs"]).map((link, idx) => (
                        <div key={link} className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800 group hover:border-zinc-700 transition-colors">
                            <span className="text-xs font-black uppercase tracking-widest text-zinc-200">{link}</span>
                            <div className="flex gap-2">
                                <button onClick={() => moveNavItem(idx, 'up')} className="bg-zinc-900 p-2.5 rounded-xl hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white" title="Move Up">↑</button>
                                <button onClick={() => moveNavItem(idx, 'down')} className="bg-zinc-900 p-2.5 rounded-xl hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white" title="Move Down">↓</button>
                                <button onClick={() => removeNavItem(idx)} className="bg-zinc-900 p-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors text-zinc-500 border border-transparent hover:border-red-500/20" title="Remove from Menu">×</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-zinc-800">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Add to Menu</h4>
                    <div className="flex flex-wrap gap-2">
                        {["menu", "gallery", "blog", "drinks", "events", "songs"].filter(p => !(headerData.navOrder || ["menu", "gallery", "blog", "drinks", "events", "songs"]).includes(p)).map(page => (
                            <button 
                                key={page} 
                                onClick={() => addNavItem(page)}
                                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                + {page}
                            </button>
                        ))}
                    </div>
                </div>
            </SectionCard>
        )}

        {tab === 'seo' && (
            <div className="space-y-12">
                <SectionCard title="Search Engine Identity">
                    <Input label="Site Title" value={headerData.siteTitle} onChange={v => updateHeaderData(prev => ({...prev, siteTitle: v}))} />
                    <TextArea label="Site Description (Meta)" value={headerData.siteDescription} onChange={v => updateHeaderData(prev => ({...prev, siteDescription: v}))} />
                    <MediaPicker label="Logo URL" value={headerData.logoUrl} onChange={v => updateHeaderData(prev => ({...prev, logoUrl: v}))} />
                </SectionCard>

                <SectionCard title="AI Intelligence SEO Suite">
                    <div className="bg-black/30 p-8 rounded-[2.5rem] border border-zinc-800">
                        <div className="mb-8 text-center">
                            <h4 className="text-xl font-black uppercase italic tracking-tighter mb-2">Automated SEO Optimization</h4>
                            <p className="text-[11px] text-zinc-500 uppercase tracking-widest">Choose an intelligence mode to update your site metadata.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Mode 1: Fast AI (Flash Lite) */}
                            <button 
                                onClick={() => handleAiSeoOptimize('fast')}
                                disabled={aiLoading}
                                className="flex flex-col items-center p-6 bg-zinc-800/50 rounded-3xl border border-zinc-700 hover:border-blue-500 transition-all group"
                            >
                                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <span className="text-sm font-black uppercase tracking-tighter italic text-white mb-1">Lightning Optimize</span>
                                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Fast • Low Latency</span>
                            </button>

                            {/* Mode 2: Trend Grounding (Flash + Search) */}
                            <button 
                                onClick={() => handleAiSeoOptimize('trend')}
                                disabled={aiLoading}
                                className="flex flex-col items-center p-6 bg-zinc-800/50 rounded-3xl border border-zinc-700 hover:border-green-500 transition-all group"
                            >
                                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 text-green-400 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <span className="text-sm font-black uppercase tracking-tighter italic text-white mb-1">Trend-Pulse SEO</span>
                                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Search Grounded • Market Aware</span>
                            </button>

                            {/* Mode 3: Deep Strategic (Pro + Thinking) */}
                            <button 
                                onClick={() => handleAiSeoOptimize('deep')}
                                disabled={aiLoading}
                                className="flex flex-col items-center p-6 bg-zinc-800/50 rounded-3xl border border-zinc-700 hover:border-purple-500 transition-all group"
                            >
                                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                </div>
                                <span className="text-sm font-black uppercase tracking-tighter italic text-white mb-1">Strategic Deep-Dive</span>
                                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Thoughtful Reasoning • High IQ</span>
                            </button>
                        </div>

                        {aiStep && (
                            <div className="mt-8 flex items-center justify-center gap-4 py-4 px-6 bg-zinc-900 rounded-2xl border border-zinc-800 animate-pulse">
                                <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{aiStep}</span>
                            </div>
                        )}

                        {groundingSources.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-zinc-800">
                                <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Verification Sources (Grounded in Web Data)</h5>
                                <div className="flex flex-wrap gap-2">
                                    {groundingSources.map((source, idx) => (
                                        <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-zinc-800/80 rounded-lg text-[9px] text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors border border-zinc-700">
                                            {source.title} ↗
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </SectionCard>
            </div>
        )}

        {tab === 'food' && (
            <SectionCard title="Food Menu Editor">
                <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-widest leading-relaxed">Modify your gourmet bites and platters here.</p>
                {foodMenu.map((cat, ci) => (
                    <div key={ci} className="mb-8 p-6 bg-zinc-800/30 rounded-3xl border border-zinc-800">
                        <Input label="Category" value={cat.category} onChange={v => {
                            const next = [...foodMenu]; next[ci].category = v; updateFoodMenu(next);
                        }} />
                        <div className="space-y-4">
                            {cat.items.map((item, ii) => (
                                <div key={ii} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4 bg-black/20 rounded-xl">
                                    <input className="bg-transparent border-b border-zinc-700 text-sm outline-none p-1" value={item.name} onChange={e => {
                                        const next = [...foodMenu]; next[ci].items[ii].name = e.target.value; updateFoodMenu(next);
                                    }} placeholder="Name" />
                                    <input className="bg-transparent border-b border-zinc-700 text-sm outline-none p-1" value={item.price} onChange={e => {
                                        const next = [...foodMenu]; next[ci].items[ii].price = e.target.value; updateFoodMenu(next);
                                    }} placeholder="Price" />
                                    <input className="bg-transparent border-b border-zinc-700 text-xs text-zinc-500 outline-none p-1" value={item.description} onChange={e => {
                                        const next = [...foodMenu]; next[ci].items[ii].description = e.target.value; updateFoodMenu(next);
                                    }} placeholder="Description" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </SectionCard>
        )}

        {tab === 'config' && (
            <div className="space-y-12">
                <SectionCard title="Image Optimization Engine">
                    <Toggle label="Auto-Optimize Uploads" checked={optimizationSettings.enabled} onChange={v => updateOptimizationSettings(prev => ({...prev, enabled: v}))} />
                    <Input label="PHP Sync Endpoint" value={syncUrl} onChange={v => updateSyncUrl(v)} />
                    <Input label="Auth Key" value={adminPassword} onChange={v => updateAdminPassword(v)} type="password" />
                </SectionCard>
                <button onClick={purgeCache} className="w-full py-5 bg-red-600/10 border border-red-600/30 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all">Destroy Local Cache</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
