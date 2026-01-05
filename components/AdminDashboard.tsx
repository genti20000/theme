
import React, { useState, useRef, useEffect } from 'react';
import { useData, DrinkCategory } from '../context/DataContext';

const SectionCard: React.FC<{ title: string; children: React.ReactNode; enabled?: boolean; onToggle?: (v: boolean) => void }> = ({ title, children, enabled, onToggle }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8 shadow-sm">
    <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
      <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
          <span className={`w-3 h-3 ${enabled !== false ? 'bg-pink-500 animate-pulse' : 'bg-zinc-600'} rounded-full`}></span>
          {title}
      </h3>
      {onToggle && (
        <Toggle label="Enabled" checked={enabled !== false} onChange={onToggle} />
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
      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${checked ? 'bg-pink-600 shadow-[0_0_10px_rgba(219,39,119,0.4)]' : 'bg-zinc-800'}`}
    >
      <div className={`absolute top-1 bottom-1 w-4 rounded-full bg-white transition-all duration-300 ${checked ? 'left-7' : 'left-1'}`} />
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
      <textarea rows={6} className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-green-500 font-mono outline-none focus:border-pink-500 transition-all text-xs leading-tight" value={value || ''} onChange={(v) => onChange(v)} />
    </div>
  );

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [tab, setTab] = useState('seo');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeLibraryCallback, setActiveLibraryCallback] = useState<(url: string) => void>(() => (url: string) => {});
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

  const MediaPicker: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => {
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
      <div className="mb-6">
        <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</label>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-32 h-32 bg-zinc-800 rounded-2xl border border-zinc-700 flex-shrink-0 overflow-hidden relative group">
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
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white outline-none focus:border-pink-500 transition-all font-medium text-xs" placeholder="URL Address" value={value || ''} onChange={(e) => onChange(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={() => inputRef.current?.click()} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-black uppercase py-2.5 rounded-xl border border-zinc-700 transition-all">Upload Local</button>
              <button onClick={openLibrary} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-black uppercase py-2.5 rounded-xl border border-zinc-700 transition-all">From Storage</button>
            </div>
            <input type="file" ref={inputRef} onChange={handleUpload} className="hidden" />
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

  const phpSnippet = `<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$auth_key = 'Bearer ${adminPassword}';
$data_file = 'site_data.json';
$upload_dir = 'uploads/';

$headers = getallheaders();
$auth = $headers['Authorization'] ?? '';
if ($auth !== $auth_key) { http_response_code(401); die(json_encode(['success'=>false, 'error'=>'Auth Failed'])); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        if (!is_dir($upload_dir)) mkdir($upload_dir, 0755);
        $name = time().'_'.basename($_FILES['file']['name']);
        if (move_uploaded_file($_FILES['file']['tmp_name'], $upload_dir.$name)) {
            echo json_encode(['success'=>true, 'url'=>'https://'.$_SERVER['HTTP_HOST'].'/'.$upload_dir.$name]);
        } else {
            echo json_encode(['success'=>false, 'error'=>'Upload failed']);
        }
    } else {
        $input = file_get_contents('php://input');
        if (file_put_contents($data_file, $input)) {
            echo json_encode(['success'=>true]);
        } else {
            echo json_encode(['success'=>false, 'error'=>'Write failed']);
        }
    }
} else {
    if (isset($_GET['list'])) {
        $files = is_dir($upload_dir) ? array_diff(scandir($upload_dir), ['.', '..']) : [];
        $result = [];
        foreach($files as $f) $result[] = ['name'=>$f, 'url'=>'https://'.$_SERVER['HTTP_HOST'].'/'.$upload_dir.$f];
        echo json_encode(['success'=>true, 'files'=>$result]);
    } else {
        if (file_exists($data_file)) {
            echo file_get_contents($data_file);
        } else {
            echo json_encode(['error'=>'no data']);
        }
    }
}
?>`;

  const moveNavItem = (index: number, direction: 'up' | 'down') => {
      const nextOrder = [...(headerData.navOrder || [])];
      if (direction === 'up' && index > 0) {
          [nextOrder[index], nextOrder[index - 1]] = [nextOrder[index - 1], nextOrder[index]];
      } else if (direction === 'down' && index < nextOrder.length - 1) {
          [nextOrder[index], nextOrder[index + 1]] = [nextOrder[index + 1], nextOrder[index]];
      }
      updateHeaderData(prev => ({...prev, navOrder: nextOrder}));
  };

  const DrinkCategoryEditor = ({ title, data, setter }: { title: string, data: DrinkCategory[], setter: (val: DrinkCategory[]) => void }) => (
    <div className="mb-10">
        <h4 className="text-lg font-black text-pink-500 uppercase mb-4">{title}</h4>
        {data.map((cat, ci) => (
            <div key={ci} className="bg-zinc-800/30 p-4 rounded-2xl mb-4 border border-zinc-800">
                <div className="flex gap-4 items-end mb-4">
                    <Input label="Category" value={cat.category} onChange={v => {
                        const next = [...data]; next[ci].category = v; setter(next);
                    }} />
                    <button onClick={() => setter(data.filter((_, idx) => idx !== ci))} className="mb-6 bg-red-900/20 text-red-500 p-3 rounded-xl">×</button>
                </div>
                {cat.items.map((item, ii) => (
                    <div key={ii} className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <div className="col-span-4"><input className="w-full bg-zinc-900 p-2 rounded text-xs text-white" value={item.name} onChange={e => {
                            const next = [...data]; next[ci].items[ii].name = e.target.value; setter(next);
                        }} placeholder="Name" /></div>
                        <div className="col-span-5"><input className="w-full bg-zinc-900 p-2 rounded text-xs text-white" value={item.description || ''} onChange={e => {
                            const next = [...data]; next[ci].items[ii].description = e.target.value; setter(next);
                        }} placeholder="Desc" /></div>
                        <div className="col-span-2"><input className="w-full bg-zinc-900 p-2 rounded text-xs text-white" value={typeof item.price === 'object' ? JSON.stringify(item.price) : item.price} onChange={e => {
                            const next = [...data];
                            try {
                                next[ci].items[ii].price = e.target.value.startsWith('{') ? JSON.parse(e.target.value) : e.target.value;
                            } catch(err) { next[ci].items[ii].price = e.target.value; }
                            setter(next);
                        }} placeholder="Price" /></div>
                        <button onClick={() => {
                            const next = [...data]; next[ci].items = next[ci].items.filter((_, idx) => idx !== ii); setter(next);
                        }} className="col-span-1 text-red-500">×</button>
                    </div>
                ))}
                <button onClick={() => {
                    const next = [...data]; next[ci].items.push({name: 'New Item', price: '0.00'}); setter(next);
                }} className="text-[10px] font-black uppercase text-zinc-500 mt-2 hover:text-white">+ Add Item</button>
            </div>
        ))}
        <button onClick={() => setter([...data, {category: 'New Cat', items: []}])} className="w-full py-2 border border-zinc-700 rounded-xl text-[10px] uppercase font-black text-zinc-500">+ Add Category</button>
    </div>
  );

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
      {/* Media Library Modal - IMPROVED GRID: Not Stacked */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10">
          <div className="bg-zinc-900 w-full max-w-6xl h-[85vh] rounded-[3rem] border border-zinc-800 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">LKC <span className="text-pink-500">Media Library</span></h3>
              <button onClick={() => setIsLibraryOpen(false)} className="bg-zinc-800 p-3 rounded-full hover:bg-zinc-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            {/* Robust Grid Layout: Ensures horizontal layout across all viewports */}
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
              {storageFiles.map((file, idx) => (
                <button 
                  key={idx} 
                  onClick={() => activeLibraryCallback(file.url)}
                  className="aspect-square bg-zinc-800 rounded-3xl overflow-hidden border border-zinc-700 hover:border-pink-500 transition-all relative group shadow-lg hover:shadow-pink-500/20"
                >
                  {file.url.toLowerCase().match(/\.(mp4|webm|mov)$/) ? (
                    <video src={file.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={file.url} className="w-full h-full object-cover" alt={file.name} loading="lazy" />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                    <span className="bg-pink-500 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full mb-2">Select</span>
                    <span className="text-white text-[8px] font-bold truncate w-full px-1">{file.name}</span>
                  </div>
                </button>
              ))}
              {storageFiles.length === 0 && <div className="col-span-full py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-sm">No assets found on server.</div>}
            </div>
          </div>
        </div>
      )}

      <div className="bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-50 p-6 flex justify-between items-center px-10">
        <h2 className="text-2xl font-black uppercase tracking-tighter">London <span className="text-pink-500">Karaoke</span> Club</h2>
        <div className="flex gap-4">
            <button onClick={saveToHostinger} disabled={isDataLoading} className="bg-pink-600 hover:bg-pink-500 px-10 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest animate-pulse shadow-xl">
                {isDataLoading ? 'Syncing...' : 'Save All Changes'}
            </button>
        </div>
      </div>

      <div className="flex bg-zinc-900/50 border-b border-zinc-800 overflow-x-auto scrollbar-hide px-8 sticky top-[88px] z-40 backdrop-blur-md">
        {['seo', 'nav', 'hero', 'about', 'features', 'vibe', 'stats', 'food', 'drinks', 'events', 'blog', 'faq', 'info', 'gallery', 'terms', 'config'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-5 uppercase font-black text-[10px] tracking-widest transition-all relative flex-shrink-0 ${tab === t ? 'text-pink-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {t}
                {tab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500"></div>}
            </button>
        ))}
      </div>

      <div className="container mx-auto p-10 max-w-5xl">
        {tab === 'seo' && (
            <SectionCard title="Global Identity">
                <Input label="Site Browser Title" value={headerData.siteTitle} onChange={v => updateHeaderData(prev => ({...prev, siteTitle: v}))} />
                <TextArea label="SEO Meta Description" value={headerData.siteDescription} onChange={v => updateHeaderData(prev => ({...prev, siteDescription: v}))} />
                <MediaPicker label="Logo Media" value={headerData.logoUrl} onChange={v => updateHeaderData(prev => ({...prev, logoUrl: v}))} />
                <MediaPicker label="Favicon Media" value={headerData.faviconUrl} onChange={v => updateHeaderData(prev => ({...prev, faviconUrl: v}))} />
            </SectionCard>
        )}

        {tab === 'nav' && (
            <SectionCard title="Header Navigation Order">
                <p className="text-[10px] text-zinc-500 mb-8 uppercase tracking-widest">Reorder how links appear in the header "wings". The list is split automatically (left wing / right wing).</p>
                <div className="space-y-3">
                    {(headerData.navOrder || ["menu", "gallery", "blog", "drinks", "events", "songs"]).map((item, idx) => (
                        <div key={item} className="flex items-center justify-between bg-zinc-800 p-4 rounded-2xl border border-zinc-700">
                            <span className="font-black uppercase text-xs tracking-widest text-zinc-300">{item}</span>
                            <div className="flex gap-2">
                                <button onClick={() => moveNavItem(idx, 'up')} className="bg-zinc-700 p-2 rounded-lg hover:bg-pink-500 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
                                </button>
                                <button onClick={() => moveNavItem(idx, 'down')} className="bg-zinc-700 p-2 rounded-lg hover:bg-pink-500 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>
        )}

        {tab === 'hero' && (
            <SectionCard title="Main Stage Hero">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <Toggle label="Show Festive Badge" checked={heroData.showBadge !== false} onChange={v => updateHeroData(prev => ({...prev, showBadge: v}))} />
                  <Toggle label="Show Action Buttons" checked={heroData.showButtons !== false} onChange={v => updateHeroData(prev => ({...prev, showButtons: v}))} />
                </div>
                <Input label="Festive Badge Text" value={heroData.badgeText} onChange={v => updateHeroData(prev => ({...prev, badgeText: v}))} />
                <Input label="Hero Title" value={heroData.headingText} onChange={v => updateHeroData(prev => ({...prev, headingText: v}))} />
                <TextArea label="Subheading" value={heroData.subText} onChange={v => updateHeroData(prev => ({...prev, subText: v}))} />
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-500 uppercase">Slide Backgrounds</label>
                    {heroData.slides.map((s, i) => (
                        <div key={i} className="bg-zinc-800/20 p-4 rounded-2xl border border-zinc-800">
                            <MediaPicker label={`Slide ${i + 1} (Desktop)`} value={s} onChange={v => {
                                updateHeroData(prev => {
                                  const next = [...prev.slides];
                                  next[i] = v;
                                  return { ...prev, slides: next };
                                });
                            }} />
                            <MediaPicker label={`Slide ${i + 1} (Mobile Version)`} value={heroData.mobileSlides?.[i] || ''} onChange={v => {
                                updateHeroData(prev => {
                                    const next = [...(prev.mobileSlides || [])];
                                    next[i] = v;
                                    return {...prev, mobileSlides: next};
                                });
                            }} />
                            <button onClick={() => updateHeroData(prev => ({...prev, slides: prev.slides.filter((_, idx) => idx !== i), mobileSlides: prev.mobileSlides?.filter((_, idx) => idx !== i)}))} className="text-red-500 text-[10px] font-black uppercase">Remove Slide</button>
                        </div>
                    ))}
                    <button onClick={() => updateHeroData(prev => ({...prev, slides: [...prev.slides, ''], mobileSlides: [...(prev.mobileSlides || []), '']}))} className="w-full py-4 border-2 border-dashed border-zinc-800 text-xs text-zinc-500 font-black rounded-2xl hover:border-pink-500 hover:text-pink-500 transition-all">+ ADD NEW SLIDE</button>
                </div>
            </SectionCard>
        )}

        {tab === 'about' && (
            <SectionCard title="The Soho Highlights" enabled={highlightsData.enabled} onToggle={v => updateHighlightsData(prev => ({...prev, enabled: v}))}>
                <Input label="Main Heading" value={highlightsData.heading} onChange={v => updateHighlightsData(prev => ({...prev, heading: v}))} />
                <TextArea label="Subtext" value={highlightsData.subtext} onChange={v => updateHighlightsData(prev => ({...prev, subtext: v}))} />
                <MediaPicker label="Main Section Image (Desktop)" value={highlightsData.mainImageUrl} onChange={v => updateHighlightsData(prev => ({...prev, mainImageUrl: v}))} />
                <MediaPicker label="Main Section Image (Mobile Version)" value={highlightsData.mobileMainImageUrl || ''} onChange={v => updateHighlightsData(prev => ({...prev, mobileMainImageUrl: v}))} />
                <Input label="Features Title" value={highlightsData.featureListTitle} onChange={v => updateHighlightsData(prev => ({...prev, featureListTitle: v}))} />
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-500 uppercase">Features List</label>
                    {highlightsData.featureList.map((f, i) => (
                        <div key={i} className="flex gap-4">
                            <input className="flex-1 bg-zinc-800 border border-zinc-700 p-3 rounded-xl text-xs text-white" value={f} onChange={e => {
                                updateHighlightsData(prev => {
                                    const next = [...prev.featureList];
                                    next[i] = e.target.value;
                                    return {...prev, featureList: next};
                                });
                            }} />
                            <button onClick={() => updateHighlightsData(prev => ({...prev, featureList: prev.featureList.filter((_, idx) => idx !== i)}))} className="bg-red-900/20 text-red-500 px-4 rounded-xl font-black">×</button>
                        </div>
                    ))}
                    <button onClick={() => updateHighlightsData(prev => ({...prev, featureList: [...prev.featureList, '']}))} className="w-full py-2 bg-zinc-800 text-zinc-500 font-black rounded-xl text-[10px]">+ ADD FEATURE</button>
                </div>
                <MediaPicker label="Side Circle Media" value={highlightsData.sideImageUrl} onChange={v => updateHighlightsData(prev => ({...prev, sideImageUrl: v}))} />
            </SectionCard>
        )}

        {tab === 'features' && (
            <div className="space-y-12">
                <SectionCard title="The Experience" enabled={featuresData.enabled} onToggle={v => updateFeaturesData(prev => ({...prev, enabled: v}))}>
                    <Input label="Label" value={featuresData.experience.label} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, label: v}}))} />
                    <Input label="Heading" value={featuresData.experience.heading} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, heading: v}}))} />
                    <TextArea label="Text" value={featuresData.experience.text} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, text: v}}))} />
                    <MediaPicker label="Section Media (Desktop)" value={featuresData.experience.image} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, image: v}}))} />
                    <MediaPicker label="Section Media (Mobile Version)" value={featuresData.experience.mobileImage || ''} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, mobileImage: v}}))} />
                </SectionCard>
                <SectionCard title="Feature Grid Items">
                    {featuresData.grid.items.map((item, i) => (
                        <div key={i} className="bg-zinc-800/30 p-6 rounded-2xl mb-4 border border-zinc-800">
                             <Input label="Title" value={item.title} onChange={v => {
                                 const next = [...featuresData.grid.items]; next[i].title = v; updateFeaturesData(prev => ({...prev, grid: {...prev.grid, items: next}}));
                             }} />
                             <MediaPicker label="Card Media" value={item.image} onChange={v => {
                                 const next = [...featuresData.grid.items]; next[i].image = v; updateFeaturesData(prev => ({...prev, grid: {...prev.grid, items: next}}));
                             }} />
                        </div>
                    ))}
                </SectionCard>
            </div>
        )}

        {tab === 'vibe' && (
            <SectionCard title="The Vibe" enabled={vibeData.enabled} onToggle={v => updateVibeData(prev => ({...prev, enabled: v}))}>
                <Input label="Heading" value={vibeData.heading} onChange={v => updateVibeData(prev => ({...prev, heading: v}))} />
                <MediaPicker label="Circle Image 1" value={vibeData.image1} onChange={v => updateVibeData(prev => ({...prev, image1: v}))} />
                <MediaPicker label="Circle Image 2" value={vibeData.image2} onChange={v => updateVibeData(prev => ({...prev, image2: v}))} />
                <MediaPicker label="Background Video (Desktop MP4)" value={vibeData.videoUrl || ''} onChange={v => updateVibeData(prev => ({...prev, videoUrl: v}))} />
                <MediaPicker label="Background Video (Mobile Version)" value={vibeData.mobileVideoUrl || ''} onChange={v => updateVibeData(prev => ({...prev, mobileVideoUrl: v}))} />
                <MediaPicker label="Bottom Full Width Media (Desktop)" value={vibeData.bigImage} onChange={v => updateVibeData(prev => ({...prev, bigImage: v}))} />
                <MediaPicker label="Bottom Full Width Media (Mobile Version)" value={vibeData.mobileBigImage || ''} onChange={v => updateVibeData(prev => ({...prev, mobileBigImage: v}))} />
            </SectionCard>
        )}

        {tab === 'stats' && (
            <SectionCard title="LKC Statistics" enabled={batteryData.enabled} onToggle={v => updateBatteryData(prev => ({...prev, enabled: v}))}>
                <Input label="Prefix (e.g. Over)" value={batteryData.statPrefix} onChange={v => updateBatteryData(prev => ({...prev, statPrefix: v}))} />
                <Input label="Number (e.g. 80K)" value={batteryData.statNumber} onChange={v => updateBatteryData(prev => ({...prev, statNumber: v}))} />
                <Input label="Suffix (e.g. Songs)" value={batteryData.statSuffix} onChange={v => updateBatteryData(prev => ({...prev, statSuffix: v}))} />
                <Input label="Subtext" value={batteryData.subText} onChange={v => updateBatteryData(prev => ({...prev, subText: v}))} />
            </SectionCard>
        )}

        {tab === 'food' && (
            <SectionCard title="Food Menu Control">
                {foodMenu.map((cat, ci) => (
                    <div key={ci} className="bg-zinc-800/30 p-6 rounded-2xl mb-6 border border-zinc-800">
                        <div className="flex gap-4 items-end mb-4">
                            <Input label="Category Name" value={cat.category} onChange={v => {
                                const next = [...foodMenu]; next[ci].category = v; updateFoodMenu(next);
                            }} />
                            <button onClick={() => updateFoodMenu(foodMenu.filter((_, idx) => idx !== ci))} className="mb-6 bg-red-900/20 text-red-500 p-3 rounded-xl">×</button>
                        </div>
                        <div className="space-y-4">
                            {cat.items.map((item, ii) => (
                                <div key={ii} className="grid grid-cols-12 gap-3 items-start border-b border-zinc-800/50 pb-4">
                                    <div className="col-span-4"><Input label="Item Name" value={item.name} onChange={v => { const next = [...foodMenu]; next[ci].items[ii].name = v; updateFoodMenu(next); }} /></div>
                                    <div className="col-span-2"><Input label="Price" value={item.price} onChange={v => { const next = [...foodMenu]; next[ci].items[ii].price = v; updateFoodMenu(next); }} /></div>
                                    <div className="col-span-5"><Input label="Description" value={item.description} onChange={v => { const next = [...foodMenu]; next[ci].items[ii].description = v; updateFoodMenu(next); }} /></div>
                                    <button onClick={() => { const next = [...foodMenu]; next[ci].items = next[ci].items.filter((_, idx) => idx !== ii); updateFoodMenu(next); }} className="col-span-1 mt-7 text-red-500">×</button>
                                </div>
                            ))}
                            <button onClick={() => { const next = [...foodMenu]; next[ci].items.push({name: 'New Item', description: '', price: '0.00'}); updateFoodMenu(next); }} className="text-xs font-black uppercase text-zinc-500">+ Add Item</button>
                        </div>
                    </div>
                ))}
                <button onClick={() => updateFoodMenu([...foodMenu, {category: 'New Section', items: []}])} className="w-full py-4 border-2 border-dashed border-zinc-800 text-xs font-black text-zinc-500 rounded-2xl hover:border-pink-500 hover:text-pink-500 transition-all">+ ADD MENU CATEGORY</button>
            </SectionCard>
        )}

        {tab === 'drinks' && (
            <div className="space-y-12">
                <SectionCard title="Drinks Hero & General">
                    <MediaPicker label="Drinks Header Image" value={drinksData.headerImageUrl} onChange={v => updateDrinksData(prev => ({...prev, headerImageUrl: v}))} />
                </SectionCard>
                <SectionCard title="Packages (Special Box)">
                    <Input label="Title" value={drinksData.packagesData.title} onChange={v => updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, title: v}}))} />
                    <Input label="Subtitle" value={drinksData.packagesData.subtitle} onChange={v => updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, subtitle: v}}))} />
                    {drinksData.packagesData.items.map((item, i) => (
                        <div key={i} className="flex gap-4 mb-4 items-end bg-zinc-800/30 p-4 rounded-xl">
                            <Input label="Package Name" value={item.name} onChange={v => { const next = [...drinksData.packagesData.items]; next[i].name = v; updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, items: next}})); }} />
                            <Input label="Price" value={item.price} onChange={v => { const next = [...drinksData.packagesData.items]; next[i].price = v; updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, items: next}})); }} />
                            <button onClick={() => { const next = drinksData.packagesData.items.filter((_, idx) => idx !== i); updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, items: next}})); }} className="mb-6 text-red-500">×</button>
                        </div>
                    ))}
                    <button onClick={() => updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, items: [...prev.packagesData.items, {name: 'New Package', price: '£0'}]}}))} className="w-full py-2 bg-zinc-800 text-[10px] font-black uppercase rounded-xl">+ Add Package</button>
                </SectionCard>
                <DrinkCategoryEditor title="Cocktails" data={drinksData.cocktailsData} setter={v => updateDrinksData(prev => ({...prev, cocktailsData: v}))} />
                <DrinkCategoryEditor title="Wines" data={drinksData.winesData} setter={v => updateDrinksData(prev => ({...prev, winesData: v}))} />
                <DrinkCategoryEditor title="Bottle Service" data={drinksData.bottleServiceData} setter={v => updateDrinksData(prev => ({...prev, bottleServiceData: v}))} />
                <DrinkCategoryEditor title="By The Glass" data={drinksData.byTheGlassData} setter={v => updateDrinksData(prev => ({...prev, byTheGlassData: v}))} />
            </div>
        )}

        {tab === 'events' && (
            <div className="space-y-12">
                <SectionCard title="Events Hero">
                    <Input label="Title" value={eventsData.hero.title} onChange={v => updateEventsData(prev => ({...prev, hero: {...prev.hero, title: v}}))} />
                    <Input label="Subtitle" value={eventsData.hero.subtitle} onChange={v => updateEventsData(prev => ({...prev, hero: {...prev.hero, subtitle: v}}))} />
                    <MediaPicker label="Hero Media" value={eventsData.hero.image} onChange={v => updateEventsData(prev => ({...prev, hero: {...prev.hero, image: v}}))} />
                </SectionCard>
                <SectionCard title="Event Types/Sections">
                    {eventsData.sections.map((section, si) => (
                        <div key={si} className="bg-zinc-800/30 p-6 rounded-2xl mb-8 border border-zinc-800">
                             <div className="flex justify-between items-start mb-4">
                                <h4 className="text-pink-500 font-black uppercase text-sm">Section {si+1}</h4>
                                <button onClick={() => updateEventsData(prev => ({...prev, sections: prev.sections.filter((_, idx) => idx !== si)}))} className="text-red-500 font-bold">Delete</button>
                             </div>
                             <Input label="Section Title" value={section.title} onChange={v => { const next = [...eventsData.sections]; next[si].title = v; updateEventsData(prev => ({...prev, sections: next})); }} />
                             <Input label="Subtitle" value={section.subtitle} onChange={v => { const next = [...eventsData.sections]; next[si].subtitle = v; updateEventsData(prev => ({...prev, sections: next})); }} />
                             <TextArea label="Description" value={section.description} onChange={v => { const next = [...eventsData.sections]; next[si].description = v; updateEventsData(prev => ({...prev, sections: next})); }} />
                             <MediaPicker label="Section Image" value={section.imageUrl} onChange={v => { const next = [...eventsData.sections]; next[si].imageUrl = v; updateEventsData(prev => ({...prev, sections: next})); }} />
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-500">Key Features</label>
                                {section.features.map((f, fi) => (
                                    <div key={fi} className="flex gap-2">
                                        <input className="flex-1 bg-zinc-900 border border-zinc-800 p-2 rounded text-xs text-white" value={f} onChange={e => {
                                            const next = [...eventsData.sections]; next[si].features[fi] = e.target.value; updateEventsData(prev => ({...prev, sections: next}));
                                        }} />
                                        <button onClick={() => { const next = [...eventsData.sections]; next[si].features = next[si].features.filter((_, idx) => idx !== fi); updateEventsData(prev => ({...prev, sections: next})); }} className="text-red-500">×</button>
                                    </div>
                                ))}
                                <button onClick={() => { const next = [...eventsData.sections]; next[si].features.push('New Feature'); updateEventsData(prev => ({...prev, sections: next})); }} className="text-[10px] uppercase font-black text-zinc-600">+ Add Feature</button>
                             </div>
                        </div>
                    ))}
                    <button onClick={() => updateEventsData(prev => ({...prev, sections: [...prev.sections, {id: Date.now().toString(), title: 'New Event', subtitle: 'Celebrate', description: '', imageUrl: '', features: []}]}))} className="w-full py-4 border-2 border-dashed border-zinc-800 text-xs font-black text-zinc-500 rounded-2xl hover:border-pink-500 hover:text-pink-500 transition-all">+ ADD EVENT SECTION</button>
                </SectionCard>
            </div>
        )}

        {tab === 'blog' && (
            <SectionCard title="LKC Blog/Stories Feed">
                <Input label="Main Heading" value={blogData.heading} onChange={v => updateBlogData(prev => ({...prev, heading: v}))} />
                <TextArea label="Subheading" value={blogData.subtext} onChange={v => updateBlogData(prev => ({...prev, subtext: v}))} />
                <div className="space-y-8 mt-10">
                    {blogData.posts.map((post, pi) => (
                        <div key={pi} className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-800 relative group">
                            <button onClick={() => updateBlogData(prev => ({...prev, posts: prev.posts.filter((_, idx) => idx !== pi)}))} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">Delete Post</button>
                            <Input label="Post Title" value={post.title} onChange={v => { const next = [...blogData.posts]; next[pi].title = v; updateBlogData(prev => ({...prev, posts: next})); }} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Date" value={post.date} onChange={v => { const next = [...blogData.posts]; next[pi].date = v; updateBlogData(prev => ({...prev, posts: next})); }} />
                                <MediaPicker label="Featured Media" value={post.imageUrl} onChange={v => { const next = [...blogData.posts]; next[pi].imageUrl = v; updateBlogData(prev => ({...prev, posts: next})); }} />
                            </div>
                            <TextArea label="Excerpt (Summary)" value={post.excerpt} onChange={v => { const next = [...blogData.posts]; next[pi].excerpt = v; updateBlogData(prev => ({...prev, posts: next})); }} />
                            <TextArea label="Full Article Content" value={post.content} onChange={v => { const next = [...blogData.posts]; next[pi].content = v; updateBlogData(prev => ({...prev, posts: next})); }} />
                        </div>
                    ))}
                    <button onClick={() => updateBlogData(prev => ({...prev, posts: [...prev.posts, {id: Date.now().toString(), title: 'New Story', date: '2024-XX-XX', excerpt: '', content: '', imageUrl: ''}]}))} className="w-full py-4 border-2 border-dashed border-zinc-800 text-xs font-black text-zinc-500 rounded-2xl hover:border-pink-500 hover:text-pink-500 transition-all">+ CREATE NEW BLOG POST</button>
                </div>
            </SectionCard>
        )}

        {tab === 'info' && (
            <SectionCard title="Information Sections" enabled={infoSectionData.enabled} onToggle={v => updateInfoSectionData(prev => ({...prev, enabled: v}))}>
                <Input label="Main Section Heading" value={infoSectionData.heading} onChange={v => updateInfoSectionData(prev => ({...prev, heading: v}))} />
                {infoSectionData.sections.map((sec, si) => (
                    <div key={si} className="bg-zinc-800/30 p-4 rounded-xl mb-4 border border-zinc-800">
                        <Input label="Title" value={sec.title} onChange={v => { const next = [...infoSectionData.sections]; next[si].title = v; updateInfoSectionData(prev => ({...prev, sections: next})); }} />
                        <TextArea label="Content" value={sec.content} onChange={v => { const next = [...infoSectionData.sections]; next[si].content = v; updateInfoSectionData(prev => ({...prev, sections: next})); }} />
                        <button onClick={() => updateInfoSectionData(prev => ({...prev, sections: prev.sections.filter((_, idx) => idx !== si)}))} className="text-red-500 text-[10px] uppercase font-bold">Remove Section</button>
                    </div>
                ))}
                <button onClick={() => updateInfoSectionData(prev => ({...prev, sections: [...prev.sections, {title: 'New Info', content: ''}]}))} className="w-full py-2 bg-zinc-800 mb-8 rounded-xl text-[10px] font-black">+ Add Section</button>
                <Input label="Footer Title" value={infoSectionData.footerTitle} onChange={v => updateInfoSectionData(prev => ({...prev, footerTitle: v}))} />
                <TextArea label="Footer Text" value={infoSectionData.footerText} onChange={v => updateInfoSectionData(prev => ({...prev, footerText: v}))} />
                <Input label="Footer Highlight" value={infoSectionData.footerHighlight} onChange={v => updateInfoSectionData(prev => ({...prev, footerHighlight: v}))} />
            </SectionCard>
        )}

        {tab === 'terms' && (
            <SectionCard title="Terms & Conditions Management">
                {termsData.map((term, ti) => (
                    <div key={ti} className="bg-zinc-800/30 p-6 rounded-2xl mb-6 border border-zinc-800 relative group">
                        <button onClick={() => updateTermsData(termsData.filter((_, idx) => idx !== ti))} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                        <Input label="Clause Title" value={term.title} onChange={v => { const next = [...termsData]; next[ti].title = v; updateTermsData(next); }} />
                        <TextArea label="Clause Content" value={term.content} onChange={v => { const next = [...termsData]; next[ti].content = v; updateTermsData(next); }} />
                    </div>
                ))}
                <button onClick={() => updateTermsData([...termsData, {title: 'New Term', content: ''}])} className="w-full py-4 border-2 border-dashed border-zinc-800 text-xs font-black text-zinc-500 rounded-2xl hover:border-pink-500 hover:text-pink-500 transition-all">+ ADD NEW TERM</button>
            </SectionCard>
        )}

        {tab === 'faq' && (
            <SectionCard title="Frequently Asked Questions" enabled={faqData.enabled} onToggle={v => updateFaqData(prev => ({...prev, enabled: v}))}>
                <Input label="Heading" value={faqData.heading} onChange={v => updateFaqData(prev => ({...prev, heading: v}))} />
                <TextArea label="Subtext" value={faqData.subtext} onChange={v => updateFaqData(prev => ({...prev, subtext: v}))} />
                {faqData.items.map((item, idx) => (
                    <div key={idx} className="bg-zinc-800/30 p-4 rounded-xl mb-4 border border-zinc-800">
                        <Input label="Question" value={item.question} onChange={v => {
                            const next = [...faqData.items]; next[idx].question = v; updateFaqData(prev => ({...prev, items: next}));
                        }} />
                        <TextArea label="Answer" value={item.answer} onChange={v => {
                            const next = [...faqData.items]; next[idx].answer = v; updateFaqData(prev => ({...prev, items: next}));
                        }} />
                        <button onClick={() => updateFaqData(prev => ({...prev, items: prev.items.filter((_, i) => i !== idx)}))} className="text-red-500 text-[10px] font-bold uppercase">Delete FAQ</button>
                    </div>
                ))}
                <button onClick={() => updateFaqData(prev => ({...prev, items: [...prev.items, {question: 'New Question', answer: ''}]}))} className="w-full py-2 bg-zinc-800 rounded-xl text-[10px] font-black">+ Add FAQ Item</button>
            </SectionCard>
        )}

        {tab === 'gallery' && (
            <>
            <SectionCard title="Gallery Options">
                <div className="flex items-center gap-4">
                    <input type="checkbox" checked={galleryData.showOnHome} onChange={e => updateGalleryData(prev => ({...prev, showOnHome: e.target.checked}))} className="w-5 h-5 accent-pink-500" />
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-300">Show Gallery Preview on Home Page</label>
                </div>
            </SectionCard>
            <SectionCard title="Visual Archive">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {galleryData.images.map((img, i) => (
                        <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
                            <img src={img.url} className="w-full h-full object-cover" alt="" />
                            <button onClick={() => updateGalleryData(prev => ({...prev, images: prev.images.filter((_, idx) => idx !== i)}))} className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </div>
                    ))}
                    <div className="aspect-square border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center bg-zinc-900/50 hover:border-pink-500 group transition-all">
                        <input type="file" multiple ref={batchFileRef} className="hidden" onChange={handleBatchUpload} />
                        <button onClick={() => batchFileRef.current?.click()} className="text-[11px] font-black uppercase text-zinc-500 group-hover:text-pink-500 transition-colors">Batch Upload</button>
                    </div>
                </div>
            </SectionCard>
            </>
        )}

        {tab === 'config' && (
            <div className="space-y-12">
                <SectionCard title="Custom Scripts (Head/Body)">
                    <CodeArea label="Header Scripts (Inside <head>)" value={headerData.customScripts?.header || ''} onChange={v => updateHeaderData(prev => ({...prev, customScripts: {...prev.customScripts, header: v}}))} />
                    <CodeArea label="Footer Scripts (Before </body>)" value={headerData.customScripts?.footer || ''} onChange={v => updateHeaderData(prev => ({...prev, customScripts: {...prev.customScripts, footer: v}}))} />
                </SectionCard>

                <SectionCard title="Server PHP Snippet">
                    <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-widest leading-relaxed">Ensure your subdomain db.php script matches the snippet below for proper media handling.</p>
                    <div className="bg-black p-8 rounded-[2rem] border border-zinc-800 overflow-x-auto relative mb-6">
                        <pre className="text-[10px] text-green-500 font-mono leading-tight">{phpSnippet}</pre>
                        <button onClick={() => { navigator.clipboard.writeText(phpSnippet); alert("Copied!"); }} className="absolute top-6 right-6 bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-xl text-[10px] font-black">COPY PHP</button>
                    </div>
                </SectionCard>

                <SectionCard title="Connectivity">
                    <Input label="PHP Sync URL" value={syncUrl} onChange={v => updateSyncUrl(v)} />
                    <Input label="Auth Key (Admin Password)" value={adminPassword} onChange={v => updateAdminPassword(v)} type="password" />
                </SectionCard>

                <button onClick={purgeCache} className="w-full py-5 bg-red-600/10 border border-red-600 text-red-500 rounded-2xl font-black uppercase tracking-widest">Reset Local Cache</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
