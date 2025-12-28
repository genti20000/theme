
import React, { useState, useRef } from 'react';
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
    <input type={type} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500 transition-all font-medium" value={value || ''} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="mb-6">
    <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</label>
    <textarea rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500 transition-all font-medium leading-relaxed" value={value || ''} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [tab, setTab] = useState('seo');
  const { 
    isDataLoading, headerData, updateHeaderData, heroData, updateHeroData, highlightsData, updateHighlightsData,
    batteryData, updateBatteryData, galleryData, updateGalleryData, blogData, updateBlogData, 
    faqData, updateFaqData, songs, updateSongs, adminPassword, updateAdminPassword, syncUrl, updateSyncUrl,
    firebaseConfig, updateFirebaseConfig, saveToHostinger, uploadFile, purgeCache,
    featuresData, updateFeaturesData, vibeData, updateVibeData, foodMenu, updateFoodMenu,
    drinksData, updateDrinksData, testimonialsData, updateTestimonialsData,
    infoSectionData, updateInfoSectionData, eventsData, updateEventsData,
    termsData, updateTermsData
  } = useData();

  const fileRef = useRef<HTMLInputElement>(null);

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
      <div className="bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-50 p-6 flex justify-between items-center px-10">
        <h2 className="text-2xl font-black uppercase tracking-tighter">London <span className="text-pink-500">Karaoke</span> Club</h2>
        <div className="flex gap-4">
            <button onClick={saveToHostinger} disabled={isDataLoading} className="bg-pink-600 hover:bg-pink-500 px-10 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest animate-pulse shadow-xl">
                {isDataLoading ? 'Syncing...' : 'Save All Changes'}
            </button>
        </div>
      </div>

      <div className="flex bg-zinc-900/50 border-b border-zinc-800 overflow-x-auto scrollbar-hide px-8 sticky top-[88px] z-40 backdrop-blur-md">
        {['seo', 'hero', 'about', 'features', 'vibe', 'stats', 'food', 'drinks', 'events', 'blog', 'faq', 'info', 'gallery', 'terms', 'config'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-5 uppercase font-black text-[10px] tracking-widest transition-all relative flex-shrink-0 ${tab === t ? 'text-pink-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {t}
                {tab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500"></div>}
            </button>
        ))}
      </div>

      <div className="container mx-auto p-10 max-w-5xl">
        {tab === 'info' && (
            <SectionCard title="Info & Locations (Home Section)">
                <Input label="Main Heading" value={infoSectionData.heading} onChange={v => updateInfoSectionData(prev => ({...prev, heading: v}))} />
                <TextArea label="Introduction Paragraph" value={infoSectionData.intro} onChange={v => updateInfoSectionData(prev => ({...prev, intro: v}))} />
                {infoSectionData.sections.map((sec, i) => (
                    <div key={i} className="bg-zinc-800/50 p-6 rounded-2xl mb-4 border border-zinc-700">
                        <Input label="Block Title" value={sec.title} onChange={v => {
                            const next = [...infoSectionData.sections]; next[i].title = v; updateInfoSectionData(prev => ({...prev, sections: next}));
                        }} />
                        <TextArea label="Block Content" value={sec.content} onChange={v => {
                            const next = [...infoSectionData.sections]; next[i].content = v; updateInfoSectionData(prev => ({...prev, sections: next}));
                        }} />
                        <button onClick={() => updateInfoSectionData(prev => ({...prev, sections: prev.sections.filter((_, idx) => idx !== i)}))} className="text-red-500 text-[10px] uppercase font-black">Remove Block</button>
                    </div>
                ))}
                <button onClick={() => updateInfoSectionData(prev => ({...prev, sections: [...prev.sections, {title: 'New Sec', content: ''}]}))} className="w-full py-2 bg-zinc-800 text-zinc-500 rounded-xl text-[10px] font-black mb-6">+ Add Info Block</button>
                <Input label="Footer Title" value={infoSectionData.footerTitle} onChange={v => updateInfoSectionData(prev => ({...prev, footerTitle: v}))} />
                <TextArea label="Footer text" value={infoSectionData.footerText} onChange={v => updateInfoSectionData(prev => ({...prev, footerText: v}))} />
                <Input label="Footer Highlight" value={infoSectionData.footerHighlight} onChange={v => updateInfoSectionData(prev => ({...prev, footerHighlight: v}))} />
            </SectionCard>
        )}
        
        {/* Other tabs remain the same ... */}
        {tab === 'seo' && (
            <SectionCard title="Global Identity">
                <Input label="Site Browser Title" value={headerData.siteTitle} onChange={v => updateHeaderData(prev => ({...prev, siteTitle: v}))} />
                <TextArea label="SEO Meta Description" value={headerData.siteDescription} onChange={v => updateHeaderData(prev => ({...prev, siteDescription: v}))} />
                <Input label="Logo SVG/PNG URL" value={headerData.logoUrl} onChange={v => updateHeaderData(prev => ({...prev, logoUrl: v}))} />
                <Input label="Favicon URL" value={headerData.faviconUrl} onChange={v => updateHeaderData(prev => ({...prev, faviconUrl: v}))} />
            </SectionCard>
        )}

        {tab === 'hero' && (
            <SectionCard title="Main Stage Hero">
                <Input label="Festive Badge Text" value={heroData.badgeText} onChange={v => updateHeroData(prev => ({...prev, badgeText: v}))} />
                <Input label="Hero Title" value={heroData.headingText} onChange={v => updateHeroData(prev => ({...prev, headingText: v}))} />
                <TextArea label="Subheading" value={heroData.subText} onChange={v => updateHeroData(prev => ({...prev, subText: v}))} />
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-500 uppercase">Slide Backgrounds (URLs)</label>
                    {heroData.slides.map((s, i) => (
                        <div key={i} className="flex gap-4">
                            <input className="flex-1 bg-zinc-800 border border-zinc-700 p-3 rounded-xl text-xs text-white" value={s} onChange={e => {
                                updateHeroData(prev => {
                                  const next = [...prev.slides];
                                  next[i] = e.target.value;
                                  return { ...prev, slides: next };
                                });
                            }} />
                            <button onClick={() => updateHeroData(prev => ({...prev, slides: prev.slides.filter((_, idx) => idx !== i)}))} className="bg-red-900/20 text-red-500 px-4 rounded-xl font-black">×</button>
                        </div>
                    ))}
                    <button onClick={() => updateHeroData(prev => ({...prev, slides: [...prev.slides, '']}))} className="w-full py-4 border-2 border-dashed border-zinc-800 text-xs text-zinc-500 font-black rounded-2xl hover:border-pink-500 hover:text-pink-500 transition-all">+ ADD NEW SLIDE</button>
                </div>
            </SectionCard>
        )}

        {tab === 'drinks' && (
            <SectionCard title="Libation Library">
                <Input label="Header Bg Image" value={drinksData.headerImageUrl} onChange={v => updateDrinksData(prev => ({...prev, headerImageUrl: v}))} />
                <SectionCard title="Drinks Packages">
                    <Input label="Title" value={drinksData.packagesData.title} onChange={v => updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, title: v}}))} />
                    <Input label="Subtitle" value={drinksData.packagesData.subtitle} onChange={v => updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, subtitle: v}}))} />
                    {drinksData.packagesData.items.map((pkg: any, i: number) => (
                        <div key={i} className="mb-4 bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700">
                             <Input label="Name" value={pkg.name} onChange={v => {
                                 const next = [...drinksData.packagesData.items]; next[i].name = v;
                                 updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, items: next}}));
                             }} />
                             <Input label="Price" value={pkg.price} onChange={v => {
                                 const next = [...drinksData.packagesData.items]; next[i].price = v;
                                 updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, items: next}}));
                             }} />
                             <TextArea label="Description" value={pkg.description} onChange={v => {
                                 const next = [...drinksData.packagesData.items]; next[i].description = v;
                                 updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, items: next}}));
                             }} />
                             <button onClick={() => {
                                 const next = drinksData.packagesData.items.filter((_, idx) => idx !== i);
                                 updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, items: next}}));
                             }} className="text-red-500 text-[10px] font-black uppercase tracking-widest">Delete Package</button>
                        </div>
                    ))}
                    <button onClick={() => updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, items: [...prev.packagesData.items, {name: 'New Pkg', price: '£100', description: ''}]}}))} className="w-full py-2 bg-zinc-800 text-zinc-500 rounded-xl text-[10px] font-black">+ Add Package</button>
                </SectionCard>
                <DrinkCategoryEditor title="Cocktails" data={drinksData.cocktailsData} setter={val => updateDrinksData(prev => ({...prev, cocktailsData: val}))} />
                <DrinkCategoryEditor title="Wines & Champagne" data={drinksData.winesData} setter={val => updateDrinksData(prev => ({...prev, winesData: val}))} />
                <DrinkCategoryEditor title="Bottle Service" data={drinksData.bottleServiceData} setter={val => updateDrinksData(prev => ({...prev, bottleServiceData: val}))} />
            </SectionCard>
        )}

        {tab === 'faq' && (
            <SectionCard title="FAQ Editor">
                <Input label="FAQ Heading" value={faqData.heading} onChange={v => updateFaqData(prev => ({...prev, heading: v}))} />
                <TextArea label="FAQ Subtext" value={faqData.subtext} onChange={v => updateFaqData(prev => ({...prev, subtext: v}))} />
                {faqData.items.map((item, i) => (
                    <div key={i} className="bg-zinc-800/50 p-6 rounded-2xl mb-4 border border-zinc-700">
                        <Input label="Question" value={item.question} onChange={v => {
                            const next = [...faqData.items]; next[i].question = v; updateFaqData(prev => ({...prev, items: next}));
                        }} />
                        <TextArea label="Answer" value={item.answer} onChange={v => {
                            const next = [...faqData.items]; next[i].answer = v; updateFaqData(prev => ({...prev, items: next}));
                        }} />
                        <button onClick={() => updateFaqData(prev => ({...prev, items: prev.items.filter((_, idx) => idx !== i)}))} className="text-red-500 text-[10px] uppercase font-black">Remove Q&A</button>
                    </div>
                ))}
                <button onClick={() => updateFaqData(prev => ({...prev, items: [...prev.items, {question: 'New Question?', answer: ''}]}))} className="w-full py-2 bg-zinc-800 text-zinc-500 rounded-xl text-[10px] font-black">+ Add FAQ Entry</button>
            </SectionCard>
        )}

        {tab === 'config' && (
            <div className="space-y-12">
                <SectionCard title="Subdomain Sync (files.londonkaraoke.club)">
                    <p className="text-xs text-zinc-500 mb-6 uppercase tracking-widest">Connect to your subdomain files storage</p>
                    <div className="bg-black p-8 rounded-[2rem] border border-zinc-800 overflow-x-auto relative mb-6">
                        <pre className="text-[10px] text-green-500 font-mono leading-tight">{phpSnippet}</pre>
                        <button onClick={() => { navigator.clipboard.writeText(phpSnippet); alert("Copied!"); }} className="absolute top-6 right-6 bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-xl text-[10px] font-black">COPY PHP</button>
                    </div>
                    <Input label="PHP Sync URL (files.londonkaraoke.club/db.php)" value={syncUrl} onChange={v => updateSyncUrl(v)} />
                    <Input label="Auth Key (Admin Password)" value={adminPassword} onChange={v => updateAdminPassword(v)} type="password" />
                </SectionCard>
                <button onClick={purgeCache} className="w-full py-5 bg-red-600/10 border border-red-600 text-red-500 rounded-2xl font-black uppercase tracking-widest">Purge Local Storage (Emergency Only)</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
