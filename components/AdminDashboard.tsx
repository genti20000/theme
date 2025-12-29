
import React, { useState, useRef, useEffect } from 'react';
import { useData, DrinkCategory } from '../context/DataContext';

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8 shadow-sm">
    <h3 className="text-2xl font-black text-white mb-8 border-b border-zinc-800 pb-4 flex items-center gap-3 uppercase tracking-tighter">
        <span className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></span>
        {title}
    </h3>
    {children}
  </div>
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
      <textarea rows={6} className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-green-500 font-mono outline-none focus:border-pink-500 transition-all text-xs leading-tight" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [tab, setTab] = useState('seo');
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
            <SectionCard title="The Soho Highlights">
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
                <SectionCard title="The Experience (Top Section)">
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
            <SectionCard title="The Vibe">
                <Input label="Heading" value={vibeData.heading} onChange={v => updateVibeData(prev => ({...prev, heading: v}))} />
                <MediaPicker label="Circle Image 1" value={vibeData.image1} onChange={v => updateVibeData(prev => ({...prev, image1: v}))} />
                <MediaPicker label="Circle Image 2" value={vibeData.image2} onChange={v => updateVibeData(prev => ({...prev, image2: v}))} />
                <MediaPicker label="Background Video (Desktop MP4)" value={vibeData.videoUrl || ''} onChange={v => updateVibeData(prev => ({...prev, videoUrl: v}))} />
                <MediaPicker label="Background Video (Mobile Version)" value={vibeData.mobileVideoUrl || ''} onChange={v => updateVibeData(prev => ({...prev, mobileVideoUrl: v}))} />
                <MediaPicker label="Bottom Full Width Media (Desktop)" value={vibeData.bigImage} onChange={v => updateVibeData(prev => ({...prev, bigImage: v}))} />
                <MediaPicker label="Bottom Full Width Media (Mobile Version)" value={vibeData.mobileBigImage || ''} onChange={v => updateVibeData(prev => ({...prev, mobileBigImage: v}))} />
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
