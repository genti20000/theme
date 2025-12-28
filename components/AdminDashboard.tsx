
import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';

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
    firebaseConfig, updateFirebaseConfig, saveToHostinger, saveToFirebase, uploadFile, purgeCache,
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
        $files = array_diff(scandir($upload_dir), ['.', '..']);
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
            <button onClick={saveToFirebase} disabled={isDataLoading} className="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Firebase Sync</button>
            <button onClick={saveToHostinger} disabled={isDataLoading} className="bg-pink-600 hover:bg-pink-500 px-10 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest animate-pulse shadow-xl">
                {isDataLoading ? 'Syncing...' : 'Save All Changes'}
            </button>
        </div>
      </div>

      <div className="flex bg-zinc-900/50 border-b border-zinc-800 overflow-x-auto scrollbar-hide px-8 sticky top-[88px] z-40 backdrop-blur-md">
        {['seo', 'hero', 'about', 'features', 'vibe', 'stats', 'testimonials', 'food', 'drinks', 'events', 'faq', 'songs', 'blog', 'gallery', 'terms', 'config'].map(t => (
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

        {tab === 'about' && (
            <SectionCard title="The Soho Highlights">
                <Input label="Main Heading" value={highlightsData.heading} onChange={v => updateHighlightsData(prev => ({...prev, heading: v}))} />
                <TextArea label="Subtext" value={highlightsData.subtext} onChange={v => updateHighlightsData(prev => ({...prev, subtext: v}))} />
                <Input label="Main Background Image" value={highlightsData.mainImageUrl} onChange={v => updateHighlightsData(prev => ({...prev, mainImageUrl: v}))} />
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
                <Input label="Side Circle Image" value={highlightsData.sideImageUrl} onChange={v => updateHighlightsData(prev => ({...prev, sideImageUrl: v}))} />
            </SectionCard>
        )}

        {tab === 'features' && (
            <div className="space-y-12">
                <SectionCard title="The Experience (Top Section)">
                    <Input label="Pink Label" value={featuresData.experience.label} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, label: v}}))} />
                    <Input label="Main Heading" value={featuresData.experience.heading} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, heading: v}}))} />
                    <TextArea label="Description" value={featuresData.experience.text} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, text: v}}))} />
                    <Input label="Background Image" value={featuresData.experience.image} onChange={v => updateFeaturesData(prev => ({...prev, experience: {...prev.experience, image: v}}))} />
                </SectionCard>
                <SectionCard title="Occasions (The Three Cards)">
                    <Input label="Section Heading" value={featuresData.occasions.heading} onChange={v => updateFeaturesData(prev => ({...prev, occasions: {...prev.occasions, heading: v}}))} />
                    <TextArea label="Subtext" value={featuresData.occasions.text} onChange={v => updateFeaturesData(prev => ({...prev, occasions: {...prev.occasions, text: v}}))} />
                    {featuresData.occasions.items.map((item, i) => (
                        <div key={i} className="bg-zinc-800/50 p-6 rounded-2xl mb-4 border border-zinc-700">
                             <Input label="Card Title" value={item.title} onChange={v => {
                                 const next = [...featuresData.occasions.items];
                                 next[i].title = v;
                                 updateFeaturesData(prev => ({...prev, occasions: {...prev.occasions, items: next}}));
                             }} />
                             <TextArea label="Card Content" value={item.text} onChange={v => {
                                 const next = [...featuresData.occasions.items];
                                 next[i].text = v;
                                 updateFeaturesData(prev => ({...prev, occasions: {...prev.occasions, items: next}}));
                             }} />
                        </div>
                    ))}
                </SectionCard>
            </div>
        )}

        {tab === 'vibe' && (
            <SectionCard title="The Vibe (Fitness/Mood)">
                <Input label="Purple Label" value={vibeData.label} onChange={v => updateVibeData(prev => ({...prev, label: v}))} />
                <Input label="Heading" value={vibeData.heading} onChange={v => updateVibeData(prev => ({...prev, heading: v}))} />
                <TextArea label="Subtext" value={vibeData.text} onChange={v => updateVibeData(prev => ({...prev, text: v}))} />
                <Input label="Upper Image 1" value={vibeData.image1} onChange={v => updateVibeData(prev => ({...prev, image1: v}))} />
                <Input label="Upper Image 2" value={vibeData.image2} onChange={v => updateVibeData(prev => ({...prev, image2: v}))} />
                <Input label="Video Background (Optional MP4)" value={vibeData.videoUrl || ''} onChange={v => updateVibeData(prev => ({...prev, videoUrl: v}))} />
                <Input label="Bottom Big Image" value={vibeData.bigImage} onChange={v => updateVibeData(prev => ({...prev, bigImage: v}))} />
                <Input label="Bottom Big Heading" value={vibeData.bottomHeading} onChange={v => updateVibeData(prev => ({...prev, bottomHeading: v}))} />
                <TextArea label="Bottom Big Text" value={vibeData.bottomText} onChange={v => updateVibeData(prev => ({...prev, bottomText: v}))} />
            </SectionCard>
        )}

        {tab === 'stats' && (
            <SectionCard title="The Counter (Battery)">
                <Input label="Stat Prefix" value={batteryData.statPrefix} onChange={v => updateBatteryData(prev => ({...prev, statPrefix: v}))} />
                <Input label="Stat Number" value={batteryData.statNumber} onChange={v => updateBatteryData(prev => ({...prev, statNumber: v}))} />
                <Input label="Stat Suffix" value={batteryData.statSuffix} onChange={v => updateBatteryData(prev => ({...prev, statSuffix: v}))} />
                <TextArea label="Sub-text" value={batteryData.subText} onChange={v => updateBatteryData(prev => ({...prev, subText: v}))} />
            </SectionCard>
        )}

        {tab === 'testimonials' && (
            <SectionCard title="Reviews Feed">
                <Input label="Section Heading" value={testimonialsData.heading} onChange={v => updateTestimonialsData(prev => ({...prev, heading: v}))} />
                <TextArea label="Sub-text" value={testimonialsData.subtext} onChange={v => updateTestimonialsData(prev => ({...prev, subtext: v}))} />
                {testimonialsData.items.map((item, i) => (
                    <div key={i} className="bg-zinc-800/50 p-6 rounded-2xl mb-4 border border-zinc-700">
                        <Input label="Author Name" value={item.name} onChange={v => {
                            const next = [...testimonialsData.items]; next[i].name = v;
                            updateTestimonialsData(prev => ({...prev, items: next}));
                        }} />
                        <TextArea label="Quote" value={item.quote} onChange={v => {
                            const next = [...testimonialsData.items]; next[i].quote = v;
                            updateTestimonialsData(prev => ({...prev, items: next}));
                        }} />
                        <Input label="Avatar URL" value={item.avatar} onChange={v => {
                            const next = [...testimonialsData.items]; next[i].avatar = v;
                            updateTestimonialsData(prev => ({...prev, items: next}));
                        }} />
                        <button onClick={() => updateTestimonialsData(prev => ({...prev, items: prev.items.filter((_, idx) => idx !== i)}))} className="text-red-500 text-[10px] font-black uppercase">Remove Review</button>
                    </div>
                ))}
                <button onClick={() => updateTestimonialsData(prev => ({...prev, items: [...prev.items, {name: 'New Star', quote: 'Epic night!', avatar: '', rating: 5}]}))} className="w-full py-4 border-2 border-dashed border-zinc-800 text-xs text-zinc-500 font-black rounded-2xl">+ ADD REVIEW</button>
            </SectionCard>
        )}

        {tab === 'food' && (
            <SectionCard title="Performance Fuel (Menu)">
                {foodMenu.map((cat, ci) => (
                    <div key={ci} className="mb-10 p-6 border border-zinc-800 rounded-3xl bg-zinc-900/50">
                        <div className="flex gap-4 items-end mb-6">
                            <Input label="Category Name" value={cat.category} onChange={v => {
                                const next = [...foodMenu]; next[ci].category = v; updateFoodMenu(next);
                            }} />
                            <button onClick={() => updateFoodMenu(foodMenu.filter((_, idx) => idx !== ci))} className="mb-6 bg-red-900/20 text-red-500 p-3 rounded-xl">×</button>
                        </div>
                        <div className="space-y-4">
                            {cat.items.map((item, ii) => (
                                <div key={ii} className="grid grid-cols-12 gap-4 items-start">
                                    <div className="col-span-4"><input className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-xs" value={item.name} onChange={e => {
                                        const next = [...foodMenu]; next[ci].items[ii].name = e.target.value; updateFoodMenu(next);
                                    }} placeholder="Item Name" /></div>
                                    <div className="col-span-6"><input className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-xs" value={item.description} onChange={e => {
                                        const next = [...foodMenu]; next[ci].items[ii].description = e.target.value; updateFoodMenu(next);
                                    }} placeholder="Description" /></div>
                                    <div className="col-span-1"><input className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-xs" value={item.price} onChange={e => {
                                        const next = [...foodMenu]; next[ci].items[ii].price = e.target.value; updateFoodMenu(next);
                                    }} placeholder="£" /></div>
                                    <div className="col-span-1"><button onClick={() => {
                                        const next = [...foodMenu]; next[ci].items = next[ci].items.filter((_, idx) => idx !== ii); updateFoodMenu(next);
                                    }} className="text-red-500 p-2">×</button></div>
                                </div>
                            ))}
                            <button onClick={() => {
                                const next = [...foodMenu]; next[ci].items.push({name: '', description: '', price: ''}); updateFoodMenu(next);
                            }} className="w-full py-2 bg-zinc-800 text-[10px] font-bold rounded-lg">+ ADD ITEM TO {cat.category}</button>
                        </div>
                    </div>
                ))}
                <button onClick={() => updateFoodMenu([...foodMenu, {category: 'New Category', items: []}])} className="w-full py-4 border-2 border-dashed border-zinc-800 text-xs text-zinc-500 font-black rounded-2xl hover:border-pink-500 hover:text-pink-500">+ ADD NEW CATEGORY</button>
            </SectionCard>
        )}

        {tab === 'drinks' && (
            <SectionCard title="Libation Library">
                 <Input label="Hero Header Image" value={drinksData.headerImageUrl} onChange={v => updateDrinksData(prev => ({...prev, headerImageUrl: v}))} />
                 <SectionCard title="Packages (The Gold Box)">
                    <Input label="Title" value={drinksData.packagesData.title} onChange={v => updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, title: v}}))} />
                    <Input label="Subtitle" value={drinksData.packagesData.subtitle} onChange={v => updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, subtitle: v}}))} />
                    {drinksData.packagesData.items.map((pkg: any, i: number) => (
                        <div key={i} className="mb-4 bg-zinc-800 p-4 rounded-xl">
                            <Input label="Package Name" value={pkg.name} onChange={v => {
                                const next = [...drinksData.packagesData.items]; next[i].name = v;
                                updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, items: next}}));
                            }} />
                            <Input label="Price" value={pkg.price} onChange={v => {
                                const next = [...drinksData.packagesData.items]; next[i].price = v;
                                updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, items: next}}));
                            }} />
                            <TextArea label="Includes" value={pkg.description} onChange={v => {
                                const next = [...drinksData.packagesData.items]; next[i].description = v;
                                updateDrinksData(prev => ({...prev, packagesData: {...prev.packagesData, items: next}}));
                            }} />
                        </div>
                    ))}
                 </SectionCard>
            </SectionCard>
        )}

        {tab === 'events' && (
            <SectionCard title="Event Templates">
                <Input label="Hero Heading" value={eventsData.hero.title} onChange={v => updateEventsData(prev => ({...prev, hero: {...prev.hero, title: v}}))} />
                <Input label="Hero Subheading" value={eventsData.hero.subtitle} onChange={v => updateEventsData(prev => ({...prev, hero: {...prev.hero, subtitle: v}}))} />
                <Input label="Hero Image" value={eventsData.hero.image} onChange={v => updateEventsData(prev => ({...prev, hero: {...prev.hero, image: v}}))} />
                <div className="space-y-12 mt-12">
                    {eventsData.sections.map((sec, i) => (
                        <div key={sec.id} className="p-8 border border-zinc-800 rounded-[2.5rem] bg-zinc-900/50">
                            <Input label="Section Title" value={sec.title} onChange={v => {
                                const next = [...eventsData.sections]; next[i].title = v; updateEventsData(prev => ({...prev, sections: next}));
                            }} />
                            <Input label="Subtitle (Pink)" value={sec.subtitle} onChange={v => {
                                const next = [...eventsData.sections]; next[i].subtitle = v; updateEventsData(prev => ({...prev, sections: next}));
                            }} />
                            <TextArea label="Full Description" value={sec.description} onChange={v => {
                                const next = [...eventsData.sections]; next[i].description = v; updateEventsData(prev => ({...prev, sections: next}));
                            }} />
                            <Input label="Side Image URL" value={sec.imageUrl} onChange={v => {
                                const next = [...eventsData.sections]; next[i].imageUrl = v; updateEventsData(prev => ({...prev, sections: next}));
                            }} />
                            <button onClick={() => updateEventsData(prev => ({...prev, sections: prev.sections.filter((_, idx) => idx !== i)}))} className="text-red-500 font-black uppercase text-[10px]">Delete Section</button>
                        </div>
                    ))}
                    <button onClick={() => updateEventsData(prev => ({...prev, sections: [...prev.sections, {id: Date.now().toString(), title: 'New Event', subtitle: 'Celebrate', description: '', imageUrl: '', features: []}]}))} className="w-full py-4 border-2 border-dashed border-zinc-800 text-xs text-zinc-500 font-black rounded-2xl">+ ADD NEW EVENT SECTION</button>
                </div>
            </SectionCard>
        )}

        {tab === 'terms' && (
            <SectionCard title="The Small Print (Terms)">
                {termsData.map((term, i) => (
                    <div key={i} className="mb-6 p-6 bg-zinc-800 rounded-2xl border border-zinc-700">
                        <Input label="Policy Title" value={term.title} onChange={v => {
                            const next = [...termsData]; next[i].title = v; updateTermsData(next);
                        }} />
                        <TextArea label="Policy Content" value={term.content} onChange={v => {
                            const next = [...termsData]; next[i].content = v; updateTermsData(next);
                        }} />
                        <button onClick={() => updateTermsData(termsData.filter((_, idx) => idx !== i))} className="text-red-500 font-black uppercase text-[10px]">Delete Policy</button>
                    </div>
                ))}
                <button onClick={() => updateTermsData([...termsData, {title: 'New Policy', content: ''}])} className="w-full py-4 border-2 border-dashed border-zinc-800 text-xs text-zinc-500 font-black rounded-2xl">+ ADD POLICY</button>
            </SectionCard>
        )}

        {tab === 'gallery' && (
            <SectionCard title="Visual Archive">
                <Input label="Gallery Heading" value={galleryData.heading} onChange={v => updateGalleryData(prev => ({...prev, heading: v}))} />
                <TextArea label="Subtext" value={galleryData.subtext} onChange={v => updateGalleryData(prev => ({...prev, subtext: v}))} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {galleryData.images.map((img, i) => (
                        <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-zinc-800">
                            <img src={img.url} className="w-full h-full object-cover" alt="" />
                            <button onClick={() => updateGalleryData(prev => ({...prev, images: prev.images.filter((_, idx) => idx !== i)}))} className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </div>
                    ))}
                    <div className="aspect-square border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center bg-zinc-900/50">
                        <input type="file" multiple ref={fileRef} className="hidden" onChange={handleBatchUpload} />
                        <button onClick={() => fileRef.current?.click()} className="text-[11px] font-black uppercase text-zinc-500 hover:text-pink-500 transition-colors">+ Upload Many</button>
                    </div>
                </div>
            </SectionCard>
        )}

        {tab === 'songs' && (
            <SectionCard title={`Library (${songs.length} Tracks)`}>
                <div className="max-h-[600px] overflow-y-auto pr-4 space-y-3 mb-8 scrollbar-hide">
                    {songs.slice(0, 100).map((s, i) => (
                        <div key={i} className="flex gap-4 bg-zinc-800/20 p-3 rounded-xl border border-zinc-800 items-center">
                            <input className="bg-transparent border-b border-zinc-700 flex-1 outline-none text-sm text-white" value={s.title} onChange={e => {
                                updateSongs(prev => {
                                    const next = [...prev];
                                    next[i] = { ...next[i], title: e.target.value };
                                    return next;
                                });
                            }} />
                            <input className="bg-transparent border-b border-zinc-700 flex-1 outline-none text-sm text-zinc-400" value={s.artist} onChange={e => {
                                updateSongs(prev => {
                                    const next = [...prev];
                                    next[i] = { ...next[i], artist: e.target.value };
                                    return next;
                                });
                            }} />
                            <button onClick={() => updateSongs(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 px-2 font-black">×</button>
                        </div>
                    ))}
                    <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest mt-4">Only showing first 100 for performance</p>
                </div>
                <button onClick={() => updateSongs(prev => [{id: Date.now().toString(), title: 'New Anthem', artist: 'LKC Star'}, ...prev])} className="w-full py-5 bg-pink-600/10 border border-pink-600 text-pink-500 rounded-2xl font-black uppercase tracking-widest hover:bg-pink-600 hover:text-white transition-all">+ Add New Entry</button>
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
                <SectionCard title="Firebase Persistence">
                    <Input label="Firebase URL (https://lkc-xxx.firebaseio.com/)" value={firebaseConfig.databaseURL} onChange={v => updateFirebaseConfig(prev => ({...prev, databaseURL: v}))} />
                    <Input label="Secret Key (Auth)" value={firebaseConfig.apiKey} onChange={v => updateFirebaseConfig(prev => ({...prev, apiKey: v}))} type="password" />
                </SectionCard>
                <button onClick={purgeCache} className="w-full py-5 bg-red-600/10 border border-red-600 text-red-500 rounded-2xl font-black uppercase tracking-widest">Purge Local Storage (Emergency Only)</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
