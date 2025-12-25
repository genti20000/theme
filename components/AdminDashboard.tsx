import React, { useState, useRef, useEffect } from 'react';
import { useData, Song, MenuCategory, MenuItem, DrinkCategory, EventSection, BlogPost, TestimonialItem } from '../context/DataContext';

const SectionCard: React.FC<{ title: string; children: React.ReactNode; badge?: string }> = ({ title, children, badge }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 shadow-2xl relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400 group-hover:bg-pink-500 transition-colors"></div>
    <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
            {title}
        </h3>
        {badge && <span className="bg-zinc-800 text-[10px] font-black px-2 py-1 rounded text-zinc-500 uppercase tracking-widest">{badge}</span>}
    </div>
    {children}
  </div>
);

const InputGroup: React.FC<{ label: string; value: string; onChange: (val: string) => void; type?: string; placeholder?: string }> = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</label>
    <input 
      type={type}
      placeholder={placeholder}
      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400 transition-all text-sm placeholder:text-zinc-700"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const TextAreaGroup: React.FC<{ label: string; value: string; onChange: (val: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
    <div className="mb-4">
      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</label>
      <textarea 
        placeholder={placeholder}
        rows={3}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400 transition-all text-sm resize-none placeholder:text-zinc-700"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );

const ImageUploader: React.FC<{ onUpload: (url: string) => void; label?: string; multiple?: boolean }> = ({ onUpload, label = "Upload", multiple = false }) => {
    const { uploadFile } = useData();
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        for (let i = 0; i < files.length; i++) {
            const url = await uploadFile(files[i]);
            if (url) onUpload(url);
        }
        setUploading(false);
    };

    return (
        <div className="flex items-center gap-2 mt-2">
            <button onClick={() => fileRef.current?.click()} className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all border border-zinc-700">
                {uploading ? 'Processing...' : label}
            </button>
            <input type="file" ref={fileRef} className="hidden" multiple={multiple} onChange={handleUpload} />
        </div>
    );
};

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { 
    isDataLoading, heroData, updateHeroData, highlightsData, updateHighlightsData,
    batteryData, updateBatteryData, featuresData, updateFeaturesData, vibeData, updateVibeData,
    testimonialsData, updateTestimonialsData, eventsData, updateEventsData, galleryData, updateGalleryData,
    blogData, updateBlogData, songs, updateSongs, foodMenu, updateFoodMenu, drinksData, updateDrinksData,
    footerData, updateFooterData, adminPassword, updateAdminPassword, syncUrl, updateSyncUrl, saveToHostinger, loadFromHostinger, purgeCache
  } = useData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      setLoginError(false);
      loadFromHostinger();
    } else {
      setLoginError(true);
      setPasswordInput('');
    }
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800 w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-pink-500"></div>
        <h2 className="text-3xl font-black mb-8 text-center tracking-tighter uppercase">LKC <span className="text-yellow-400">Control</span></h2>
        {loginError && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-xl mb-6 text-xs text-center font-bold">INCORRECT PASSKEY</div>}
        <div className="mb-6">
          <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Access Key</label>
          <input type="password" value={passwordInput} autoFocus onChange={e => setPasswordInput(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none focus:border-yellow-400 text-white transition-all" placeholder="••••••••" />
        </div>
        <button className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-yellow-400 transition-all uppercase tracking-widest text-sm">Enter Dashboard</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20 font-sans selection:bg-yellow-400 selection:text-black">
      {/* Fixed Navigation Header */}
      <div className="bg-black/90 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-50 px-8 h-20 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <h2 className="text-xl font-black uppercase tracking-tighter">LKC <span className="text-yellow-400">CMS</span></h2>
            <div className="h-6 w-[1px] bg-zinc-800"></div>
            <div className="hidden lg:flex gap-1">
                {['home', 'experience', 'vibe', 'blog', 'events', 'menu', 'reviews', 'media', 'config'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${activeTab === t ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
                        {t}
                    </button>
                ))}
            </div>
        </div>
        <div className="flex gap-3">
            <button onClick={saveToHostinger} disabled={isDataLoading} className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] disabled:opacity-50 active:scale-95">
                {isDataLoading ? 'Syncing...' : 'Sync to MySQL'}
            </button>
        </div>
      </div>

      <div className="container mx-auto p-8 max-w-6xl">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
            <div className="animate-fade-in-up">
                <SectionCard title="Hero Slider & Headlines" badge="Hero">
                    <InputGroup label="Main Heading" value={heroData.headingText} onChange={v => updateHeroData({...heroData, headingText: v})} />
                    <TextAreaGroup label="Subtext" value={heroData.subText} onChange={v => updateHeroData({...heroData, subText: v})} />
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputGroup label="Badge Text (Festive)" value={heroData.badgeText} onChange={v => updateHeroData({...heroData, badgeText: v})} />
                        <InputGroup label="Button Text" value={heroData.buttonText} onChange={v => updateHeroData({...heroData, buttonText: v})} />
                    </div>
                    <div className="space-y-4 mt-8">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Slider Media (Images or Videos)</label>
                        {(heroData.slides || []).map((slide, idx) => (
                            <div key={idx} className="flex gap-4 items-center bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                                <div className="w-16 h-16 bg-black rounded-lg overflow-hidden border border-zinc-800 flex-shrink-0">
                                    <img src={slide} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <InputGroup label={`Slide ${idx + 1} URL`} value={slide} onChange={v => {
                                        const next = [...heroData.slides]; next[idx] = v; updateHeroData({...heroData, slides: next});
                                    }} />
                                    <ImageUploader onUpload={url => {
                                        const next = [...heroData.slides]; next[idx] = url; updateHeroData({...heroData, slides: next});
                                    }} />
                                </div>
                                <button onClick={() => updateHeroData({...heroData, slides: heroData.slides.filter((_, i) => i !== idx)})} className="text-red-500 hover:text-red-400 p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                        ))}
                        <button onClick={() => updateHeroData({...heroData, slides: [...(heroData.slides || []), '']})} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-600 hover:text-yellow-400 hover:border-yellow-400 transition-all font-black text-xs tracking-widest">+ ADD SLIDE</button>
                    </div>
                </SectionCard>

                <SectionCard title="Highlights & Stats" badge="Home Content">
                    <InputGroup label="Highlights Heading" value={highlightsData.heading} onChange={v => updateHighlightsData({...highlightsData, heading: v})} />
                    <TextAreaGroup label="Highlights Subtext" value={highlightsData.subtext} onChange={v => updateHighlightsData({...highlightsData, subtext: v})} />
                    <div className="grid md:grid-cols-2 gap-8 my-8">
                        <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Stats Circle</label>
                            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
                                <InputGroup label="Prefix" value={batteryData.statPrefix} onChange={v => updateBatteryData({...batteryData, statPrefix: v})} />
                                <InputGroup label="Number" value={batteryData.statNumber} onChange={v => updateBatteryData({...batteryData, statNumber: v})} />
                                <InputGroup label="Suffix" value={batteryData.statSuffix} onChange={v => updateBatteryData({...batteryData, statSuffix: v})} />
                                <InputGroup label="Description" value={batteryData.subText} onChange={v => updateBatteryData({...batteryData, subText: v})} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Call to Action (Footer)</label>
                            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
                                <InputGroup label="CTA Heading" value={footerData.ctaHeading} onChange={v => updateFooterData({...footerData, ctaHeading: v})} />
                                <TextAreaGroup label="CTA Text" value={footerData.ctaText} onChange={v => updateFooterData({...footerData, ctaText: v})} />
                                <InputGroup label="CTA Button" value={footerData.ctaButtonText} onChange={v => updateFooterData({...footerData, ctaButtonText: v})} />
                            </div>
                        </div>
                    </div>
                </SectionCard>
            </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === 'experience' && (
            <div className="animate-fade-in-up">
                <SectionCard title="Main Experience" badge="Features">
                    <InputGroup label="Heading" value={featuresData.experience.heading} onChange={v => updateFeaturesData({...featuresData, experience: {...featuresData.experience, heading: v}})} />
                    <TextAreaGroup label="Text" value={featuresData.experience.text} onChange={v => updateFeaturesData({...featuresData, experience: {...featuresData.experience, text: v}})} />
                    <div className="mt-4">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Background Image</label>
                        <img src={featuresData.experience.image} className="w-full h-48 object-cover rounded-2xl mb-2" />
                        <ImageUploader onUpload={url => updateFeaturesData({...featuresData, experience: {...featuresData.experience, image: url}})} />
                    </div>
                </SectionCard>

                <SectionCard title="Every Occasion cards" badge="Experience">
                    <div className="grid md:grid-cols-3 gap-4">
                        {(featuresData.occasions.items || []).map((item, idx) => (
                            <div key={idx} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-4">
                                <InputGroup label="Title" value={item.title} onChange={v => {
                                    const next = [...featuresData.occasions.items]; next[idx].title = v; updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, items: next}});
                                }} />
                                <TextAreaGroup label="Description" value={item.text} onChange={v => {
                                    const next = [...featuresData.occasions.items]; next[idx].text = v; updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, items: next}});
                                }} />
                                <button onClick={() => {
                                    const next = featuresData.occasions.items.filter((_, i) => i !== idx);
                                    updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, items: next}});
                                }} className="text-red-500 text-[10px] font-black uppercase tracking-widest">Delete Card</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, items: [...(featuresData.occasions.items || []), {title: '', text: ''}]}})} className="w-full mt-4 py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-600 font-black text-xs tracking-widest uppercase">+ ADD CARD</button>
                </SectionCard>
            </div>
        )}

        {/* VIBE TAB */}
        {activeTab === 'vibe' && (
            <div className="animate-fade-in-up">
                <SectionCard title="Vibe & Fitness" badge="Aesthetics">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <InputGroup label="Main Label" value={vibeData.label} onChange={v => updateVibeData({...vibeData, label: v})} />
                            <InputGroup label="Heading" value={vibeData.heading} onChange={v => updateVibeData({...vibeData, heading: v})} />
                            <TextAreaGroup label="Text Content" value={vibeData.text} onChange={v => updateVibeData({...vibeData, text: v})} />
                            <InputGroup label="Video URL (Optional)" value={vibeData.videoUrl || ''} onChange={v => updateVibeData({...vibeData, videoUrl: v})} />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Overlapping Images</label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <img src={vibeData.image1} className="w-full aspect-square object-cover rounded-xl" />
                                    <ImageUploader label="Set Img 1" onUpload={url => updateVibeData({...vibeData, image1: url})} />
                                </div>
                                <div className="space-y-2">
                                    <img src={vibeData.image2} className="w-full aspect-square object-cover rounded-xl" />
                                    <ImageUploader label="Set Img 2" onUpload={url => updateVibeData({...vibeData, image2: url})} />
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionCard>
            </div>
        )}

        {/* MENU TAB */}
        {activeTab === 'menu' && (
            <div className="animate-fade-in-up">
                <SectionCard title="Food Menu Sections" badge="Kitchen">
                    <div className="space-y-8">
                        {foodMenu.map((category, catIdx) => (
                            <div key={catIdx} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                                <div className="flex gap-4 items-end mb-4">
                                    <div className="flex-1"><InputGroup label="Category Name" value={category.category} onChange={v => { const next = [...foodMenu]; next[catIdx].category = v; updateFoodMenu(next); }} /></div>
                                    <button onClick={() => updateFoodMenu(foodMenu.filter((_, i) => i !== catIdx))} className="mb-4 bg-red-900/20 text-red-500 p-3 rounded-xl border border-red-900/30"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                </div>
                                <div className="space-y-4 pl-4 border-l border-zinc-800">
                                    {category.items.map((item, itemIdx) => (
                                        <div key={itemIdx} className="grid md:grid-cols-4 gap-4 items-end">
                                            <div className="md:col-span-1"><InputGroup label="Name" value={item.name} onChange={v => { const next = [...foodMenu]; next[catIdx].items[itemIdx].name = v; updateFoodMenu(next); }} /></div>
                                            <div className="md:col-span-1"><InputGroup label="Price" value={item.price} onChange={v => { const next = [...foodMenu]; next[catIdx].items[itemIdx].price = v; updateFoodMenu(next); }} /></div>
                                            <div className="md:col-span-1"><InputGroup label="Desc" value={item.description} onChange={v => { const next = [...foodMenu]; next[catIdx].items[itemIdx].description = v; updateFoodMenu(next); }} /></div>
                                            <button onClick={() => { const next = [...foodMenu]; next[catIdx].items = next[catIdx].items.filter((_, i) => i !== itemIdx); updateFoodMenu(next); }} className="mb-4 text-red-500 text-[10px] font-black uppercase">Del</button>
                                        </div>
                                    ))}
                                    <button onClick={() => { const next = [...foodMenu]; next[catIdx].items.push({name: 'New Item', price: '0.00', description: ''}); updateFoodMenu(next); }} className="text-yellow-400 text-[10px] font-black tracking-widest uppercase">+ Add Food Item</button>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => updateFoodMenu([...foodMenu, {category: 'New Section', items: []}])} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-600 font-black text-xs tracking-widest uppercase">+ ADD MENU SECTION</button>
                    </div>
                </SectionCard>
            </div>
        )}

        {/* MEDIA TAB */}
        {activeTab === 'media' && (
            <div className="animate-fade-in-up">
                <SectionCard title="Full Site Gallery" badge="Assets">
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-8">
                        {galleryData.images.map((img, idx) => (
                            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800 group">
                                <img src={img.url} className="w-full h-full object-cover" />
                                <button onClick={() => updateGalleryData({...galleryData, images: galleryData.images.filter((_, i) => i !== idx)})} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </div>
                        ))}
                        <div className="aspect-square border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center">
                            <ImageUploader multiple onUpload={url => updateGalleryData({...galleryData, images: [...galleryData.images, {id: Date.now().toString(), url, caption: ''}]})} label="+" />
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Song Library (Manage Anthems)" badge="Karaoke">
                    <div className="space-y-4">
                        <InputGroup label="Search Existing" value="" onChange={() => {}} placeholder="Filter songs..." />
                        <div className="max-h-60 overflow-y-auto bg-zinc-950 rounded-xl border border-zinc-800">
                            {songs.slice(0, 50).map((song, idx) => (
                                <div key={song.id} className="p-3 border-b border-zinc-900 flex justify-between items-center text-xs">
                                    <span className="text-white font-bold">{song.title} <span className="text-zinc-600 font-normal">by {song.artist}</span></span>
                                    <button onClick={() => updateSongs(songs.filter((_, i) => i !== idx))} className="text-red-500">Remove</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => updateSongs([{id: Date.now().toString(), title: 'New Anthem', artist: 'Artist Name'}, ...songs])} className="w-full py-4 bg-zinc-800 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-zinc-700 transition-all">+ Add New Song Entry</button>
                    </div>
                </SectionCard>
            </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
             <div className="animate-fade-in-up">
                <SectionCard title="Google Testimonials" badge="Social Proof">
                    <div className="grid md:grid-cols-2 gap-6">
                        {(testimonialsData.items || []).map((item, idx) => (
                            <div key={idx} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
                                <InputGroup label="User Name" value={item.name} onChange={v => {
                                    const next = [...testimonialsData.items]; next[idx].name = v; updateTestimonialsData({...testimonialsData, items: next});
                                }} />
                                <TextAreaGroup label="Review Quote" value={item.quote} onChange={v => {
                                    const next = [...testimonialsData.items]; next[idx].quote = v; updateTestimonialsData({...testimonialsData, items: next});
                                }} />
                                <div className="flex justify-between items-center">
                                    <InputGroup label="Rating (1-5)" value={item.rating?.toString() || '5'} onChange={v => {
                                        const next = [...testimonialsData.items]; next[idx].rating = parseInt(v) || 5; updateTestimonialsData({...testimonialsData, items: next});
                                    }} />
                                    <button onClick={() => {
                                        const next = testimonialsData.items.filter((_, i) => i !== idx);
                                        updateTestimonialsData({...testimonialsData, items: next});
                                    }} className="text-red-500 text-[10px] font-black uppercase mt-4">Remove Review</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => updateTestimonialsData({...testimonialsData, items: [...(testimonialsData.items || []), {name: 'Reviewer', quote: '', avatar: '', rating: 5, date: 'recently'}]})} className="w-full mt-6 py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-600 font-black text-xs tracking-widest uppercase">+ ADD TESTIMONIAL</button>
                </SectionCard>
             </div>
        )}

        {/* CONFIG TAB */}
        {activeTab === 'config' && (
            <div className="animate-fade-in-up">
                <SectionCard title="CMS Technical Configuration" badge="Core">
                    <div className="space-y-6">
                        <InputGroup label="Sync Endpoint (Hostinger db.php)" value={syncUrl} onChange={v => updateSyncUrl(v)} />
                        <InputGroup label="CMS Passkey" value={adminPassword} onChange={v => updateAdminPassword(v)} type="password" />
                        <div className="pt-6 border-t border-zinc-800">
                             <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">Danger Zone</p>
                             <button onClick={purgeCache} className="bg-red-900/20 text-red-500 border border-red-900/30 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-900/40 transition-all">
                                Wipe Local Cache & Hard Reset
                             </button>
                        </div>
                    </div>
                </SectionCard>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;