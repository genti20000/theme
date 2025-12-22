import React, { useState, useRef, useEffect } from 'react';
import { useData, Song, MenuCategory, MenuItem, DrinkCategory, EventSection } from '../context/DataContext';

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 shadow-sm">
    <h3 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-2 flex items-center gap-2">
        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
        {title}
    </h3>
    {children}
  </div>
);

const InputGroup: React.FC<{ label: string; value: string; onChange: (val: string) => void; type?: string; placeholder?: string }> = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
    <input 
      type={type}
      placeholder={placeholder}
      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-400 transition-colors"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const TextAreaGroup: React.FC<{ label: string; value: string; onChange: (val: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
      <textarea 
        placeholder={placeholder}
        rows={3}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-400 transition-colors"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );

const MediaPicker: React.FC<{ onSelect: (url: string) => void; onClose: () => void }> = ({ onSelect, onClose }) => {
    const { fetchServerFiles } = useData();
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServerFiles().then(res => {
            setFiles(res);
            setLoading(false);
        });
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-900 w-full max-w-4xl h-[80vh] rounded-3xl border border-zinc-800 flex flex-col overflow-hidden shadow-2xl animate-fade-in-up">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">Server Media Library</h3>
                    <button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {files.map((f, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => onSelect(f.url)}
                                    className="aspect-square bg-black rounded-xl border border-zinc-800 overflow-hidden hover:border-yellow-400 transition-all group relative"
                                >
                                    {f.type === 'video' ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800">
                                            <svg className="w-10 h-10 text-zinc-600 group-hover:text-yellow-400 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            <span className="text-[10px] text-zinc-500 truncate w-full px-2">{f.name}</span>
                                        </div>
                                    ) : (
                                        <img src={f.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    )}
                                    <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-colors"></div>
                                </button>
                            ))}
                            {files.length === 0 && (
                                <div className="col-span-full text-center text-gray-500 py-10 italic">No files found on server. Try uploading first.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ImageUploader: React.FC<{ onUpload: (url: string) => void; label?: string }> = ({ onUpload, label = "Upload New" }) => {
    const { uploadFile } = useData();
    const [uploading, setUploading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const url = await uploadFile(file);
        if (url) onUpload(url);
        setUploading(false);
    };

    return (
        <div className="flex items-center gap-2 mt-2">
            <button onClick={() => fileRef.current?.click()} className="bg-zinc-700 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded text-white hover:bg-zinc-600 transition-colors">
                {uploading ? '...' : label}
            </button>
            <button onClick={() => setShowPicker(true)} className="bg-zinc-800 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded text-gray-300 hover:bg-zinc-700 transition-colors">
                Browse Server
            </button>
            <input type="file" ref={fileRef} className="hidden" onChange={handleUpload} />
            {showPicker && <MediaPicker onSelect={(url) => { onUpload(url); setShowPicker(false); }} onClose={() => setShowPicker(false)} />}
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
    songs, updateSongs, foodMenu, updateFoodMenu, drinksData, updateDrinksData,
    adminPassword, updateAdminPassword, syncUrl, updateSyncUrl, saveToHostinger, loadFromHostinger, saveAllToSupabase
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

  const phpCode = `<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$dataFile = 'data.json';
$uploadDir = 'uploads/';
$authPass = '${adminPassword}';

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

if ($authHeader !== "Bearer " . $authPass) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];
$dir = dirname($_SERVER['PHP_SELF']);
$baseUrl = "$protocol://$host" . ($dir === '/' ? '' : $dir);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        if (!is_dir($uploadDir)) { mkdir($uploadDir, 0755, true); }
        $ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
        $fileName = time() . '_' . uniqid() . '.' . $ext;
        $target = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
            echo json_encode(['success' => true, 'url' => "$baseUrl/$target"]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Upload failed']);
        }
    } else {
        $input = file_get_contents('php://input');
        if (file_put_contents($dataFile, $input)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Save failed']);
        }
    }
} else {
    if (isset($_GET['list'])) {
        $files = [];
        if (is_dir($uploadDir)) {
            $scanned = scandir($uploadDir);
            foreach ($scanned as $file) {
                if ($file !== '.' && $file !== '..') {
                    $files[] = [
                        'name' => $file,
                        'url' => "$baseUrl/$uploadDir$file",
                        'type' => (preg_match('/\\.(mp4|webm|mov)$/i', $file)) ? 'video' : 'image'
                    ];
                }
            }
        }
        echo json_encode(['success' => true, 'files' => array_reverse($files)]);
    } else {
        if (file_exists($dataFile)) {
            header('Content-Type: application/json');
            echo file_get_contents($dataFile);
        } else {
            echo json_encode(['error' => 'No data found']);
        }
    }
}
?>`;

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">LKC Admin</h2>
        {loginError && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4 text-sm text-center">Incorrect password.</div>}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Password</label>
          <input type="password" value={passwordInput} autoFocus onChange={e => setPasswordInput(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg outline-none focus:border-yellow-400 text-white" placeholder="••••••••" />
        </div>
        <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors mb-4">Login</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20 font-sans">
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50 p-4 flex justify-between items-center px-8">
        <h2 className="text-xl font-black uppercase tracking-tighter">LKC <span className="text-yellow-400">Control</span></h2>
        <div className="flex gap-4">
            <button onClick={saveToHostinger} disabled={isDataLoading} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                {isDataLoading ? 'Processing...' : 'Sync Server'}
            </button>
            <button onClick={saveAllToSupabase} disabled={isDataLoading} className="bg-zinc-800 hover:bg-zinc-700 px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all border border-zinc-700">
                Cloud Backup
            </button>
        </div>
      </div>

      <div className="flex bg-zinc-900 border-b border-zinc-800 overflow-x-auto scrollbar-hide px-4">
        {['home', 'experience', 'vibe', 'events', 'reviews', 'menu', 'library', 'gallery', 'config'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-4 capitalize font-bold text-xs tracking-widest transition-all ${activeTab === t ? 'text-yellow-400 border-b-2 border-yellow-400 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}>
                {t.toUpperCase()}
            </button>
        ))}
      </div>

      <div className="container mx-auto p-6 max-w-5xl">
        
        {activeTab === 'home' && (
            <>
                <SectionCard title="Hero Slider">
                    <div className="space-y-4 mb-6">
                        {(heroData.slides || []).map((slide, idx) => (
                            <div key={idx} className="flex gap-4 items-center bg-zinc-800/50 p-4 rounded-xl border border-zinc-800 group">
                                <div className="w-20 h-20 bg-black rounded-lg overflow-hidden border border-zinc-700 flex-shrink-0">
                                    {slide.toLowerCase().match(/\.(mp4|webm|mov)$/) ? (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-[10px] text-zinc-600">VIDEO</div>
                                    ) : (
                                        <img src={slide} className="w-full h-full object-cover" alt="" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <InputGroup label={`Slide ${idx + 1} URL`} value={slide} onChange={v => {
                                        const next = [...heroData.slides];
                                        next[idx] = v;
                                        updateHeroData({...heroData, slides: next});
                                    }} />
                                    <ImageUploader onUpload={url => {
                                        const next = [...heroData.slides];
                                        next[idx] = url;
                                        updateHeroData({...heroData, slides: next});
                                    }} />
                                </div>
                                <button onClick={() => updateHeroData({...heroData, slides: heroData.slides.filter((_, i) => i !== idx)})} className="text-red-500 hover:text-red-400 p-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                        <button onClick={() => updateHeroData({...heroData, slides: [...(heroData.slides || []), '']})} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-600 hover:text-yellow-400 hover:border-yellow-400 transition-all font-bold">+ ADD NEW SLIDE</button>
                    </div>
                </SectionCard>

                <SectionCard title="Hero Headlines">
                    <InputGroup label="Heading" value={heroData.headingText} onChange={v => updateHeroData({...heroData, headingText: v})} />
                    <TextAreaGroup label="Subtext" value={heroData.subText} onChange={v => updateHeroData({...heroData, subText: v})} />
                    <InputGroup label="Badge (Festive Text)" value={heroData.badgeText} onChange={v => updateHeroData({...heroData, badgeText: v})} />
                    <InputGroup label="Button Text" value={heroData.buttonText} onChange={v => updateHeroData({...heroData, buttonText: v})} />
                </SectionCard>

                <SectionCard title="Highlights & Stats">
                    <InputGroup label="Heading" value={highlightsData.heading} onChange={v => updateHighlightsData({...highlightsData, heading: v})} />
                    <TextAreaGroup label="Subtext" value={highlightsData.subtext} onChange={v => updateHighlightsData({...highlightsData, subtext: v})} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Stat Number" value={batteryData.statNumber} onChange={v => updateBatteryData({...batteryData, statNumber: v})} />
                        <InputGroup label="Stat Label" value={batteryData.statSuffix} onChange={v => updateBatteryData({...batteryData, statSuffix: v})} />
                    </div>
                </SectionCard>
            </>
        )}

        {activeTab === 'experience' && (
            <>
                <SectionCard title="The Experience (Main)">
                    <InputGroup label="Label" value={featuresData.experience.label} onChange={v => updateFeaturesData({...featuresData, experience: {...featuresData.experience, label: v}})} />
                    <InputGroup label="Heading" value={featuresData.experience.heading} onChange={v => updateFeaturesData({...featuresData, experience: {...featuresData.experience, heading: v}})} />
                    <TextAreaGroup label="Description" value={featuresData.experience.text} onChange={v => updateFeaturesData({...featuresData, experience: {...featuresData.experience, text: v}})} />
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Background Image</label>
                        <img src={featuresData.experience.image} className="h-40 w-full object-cover rounded-xl mb-2" alt="" />
                        <ImageUploader onUpload={url => updateFeaturesData({...featuresData, experience: {...featuresData.experience, image: url}})} />
                    </div>
                </SectionCard>

                <SectionCard title="Occasions (Room Types)">
                    <div className="space-y-6">
                        {featuresData.occasions.items.map((item, idx) => (
                            <div key={idx} className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-800">
                                <InputGroup label="Title" value={item.title} onChange={v => {
                                    const next = [...featuresData.occasions.items];
                                    next[idx].title = v;
                                    updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, items: next}});
                                }} />
                                <TextAreaGroup label="Description" value={item.text} onChange={v => {
                                    const next = [...featuresData.occasions.items];
                                    next[idx].text = v;
                                    updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, items: next}});
                                }} />
                                <button onClick={() => {
                                    const next = featuresData.occasions.items.filter((_, i) => i !== idx);
                                    updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, items: next}});
                                }} className="text-red-500 text-xs font-bold uppercase tracking-widest mt-2">Delete Room Type</button>
                            </div>
                        ))}
                        <button onClick={() => updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, items: [...featuresData.occasions.items, {title: 'New Type', text: ''}]}})} className="w-full py-3 bg-zinc-800 rounded-xl text-zinc-400 font-bold hover:text-white">+ ADD OCCASION</button>
                    </div>
                </SectionCard>
            </>
        )}

        {activeTab === 'vibe' && (
            <>
                <SectionCard title="Section Headlines">
                    <InputGroup label="Tagline" value={vibeData.label} onChange={v => updateVibeData({...vibeData, label: v})} />
                    <InputGroup label="Main Heading" value={vibeData.heading} onChange={v => updateVibeData({...vibeData, heading: v})} />
                    <TextAreaGroup label="Description" value={vibeData.text} onChange={v => updateVibeData({...vibeData, text: v})} />
                </SectionCard>
                <SectionCard title="Vibe Media">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Main Large Image</label>
                            <img src={vibeData.bigImage} className="aspect-video w-full object-cover rounded-xl" alt="" />
                            <ImageUploader onUpload={url => updateVibeData({...vibeData, bigImage: url})} />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Background Video (URL)</label>
                            <input className="w-full bg-zinc-800 p-2 rounded border border-zinc-700 text-white" value={vibeData.videoUrl || ''} onChange={e => updateVibeData({...vibeData, videoUrl: e.target.value})} />
                            <ImageUploader onUpload={url => updateVibeData({...vibeData, videoUrl: url})} label="Upload Video" />
                        </div>
                    </div>
                </SectionCard>
            </>
        )}

        {activeTab === 'events' && (
            <>
                <SectionCard title="Events Hero">
                    <InputGroup label="Heading" value={eventsData.hero.title} onChange={v => updateEventsData({...eventsData, hero: {...eventsData.hero, title: v}})} />
                    <TextAreaGroup label="Subtext" value={eventsData.hero.subtitle} onChange={v => updateEventsData({...eventsData, hero: {...eventsData.hero, subtitle: v}})} />
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Hero Image</label>
                        <img src={eventsData.hero.image} className="h-40 w-full object-cover rounded-xl" alt="" />
                        <ImageUploader onUpload={url => updateEventsData({...eventsData, hero: {...eventsData.hero, image: url}})} />
                    </div>
                </SectionCard>

                <SectionCard title="Event Categories">
                    <div className="space-y-8">
                        {eventsData.sections.map((section, idx) => (
                            <div key={section.id} className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-800 relative group">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <InputGroup label="Event Title" value={section.title} onChange={v => {
                                            const next = [...eventsData.sections]; next[idx].title = v; updateEventsData({...eventsData, sections: next});
                                        }} />
                                        <InputGroup label="Tagline" value={section.subtitle} onChange={v => {
                                            const next = [...eventsData.sections]; next[idx].subtitle = v; updateEventsData({...eventsData, sections: next});
                                        }} />
                                        <TextAreaGroup label="Description" value={section.description} onChange={v => {
                                            const next = [...eventsData.sections]; next[idx].description = v; updateEventsData({...eventsData, sections: next});
                                        }} />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Section Image</label>
                                        <img src={section.imageUrl} className="h-48 w-full object-cover rounded-xl" alt="" />
                                        <ImageUploader onUpload={url => {
                                            const next = [...eventsData.sections]; next[idx].imageUrl = url; updateEventsData({...eventsData, sections: next});
                                        }} />
                                    </div>
                                </div>
                                <button onClick={() => updateEventsData({...eventsData, sections: eventsData.sections.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 text-red-500 hover:text-red-400">Remove Section</button>
                            </div>
                        ))}
                        <button onClick={() => updateEventsData({...eventsData, sections: [...eventsData.sections, {id: Date.now().toString(), title: 'New Event', subtitle: '', description: '', imageUrl: '', features: []}]})} className="w-full py-4 bg-zinc-800 rounded-2xl text-zinc-400 font-bold hover:text-white transition-all">+ ADD NEW EVENT TYPE</button>
                    </div>
                </SectionCard>
            </>
        )}

        {activeTab === 'reviews' && (
            <SectionCard title="Manage Testimonials">
                <InputGroup label="Main Heading" value={testimonialsData.heading} onChange={v => updateTestimonialsData({...testimonialsData, heading: v})} />
                <div className="space-y-6 mt-8">
                    {testimonialsData.items.map((item, idx) => (
                        <div key={idx} className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-800 grid md:grid-cols-[100px_1fr] gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <img src={item.avatar || `https://ui-avatars.com/api/?name=${item.name}`} className="w-16 h-16 rounded-full" alt="" />
                                <ImageUploader label="Set Avatar" onUpload={url => {
                                    const next = [...testimonialsData.items]; next[idx].avatar = url; updateTestimonialsData({...testimonialsData, items: next});
                                }} />
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Name" value={item.name} onChange={v => {
                                        const next = [...testimonialsData.items]; next[idx].name = v; updateTestimonialsData({...testimonialsData, items: next});
                                    }} />
                                    <InputGroup label="Date (e.g. a month ago)" value={item.date || ''} onChange={v => {
                                        const next = [...testimonialsData.items]; next[idx].date = v; updateTestimonialsData({...testimonialsData, items: next});
                                    }} />
                                </div>
                                <TextAreaGroup label="Quote" value={item.quote} onChange={v => {
                                    const next = [...testimonialsData.items]; next[idx].quote = v; updateTestimonialsData({...testimonialsData, items: next});
                                }} />
                                <button onClick={() => updateTestimonialsData({...testimonialsData, items: testimonialsData.items.filter((_, i) => i !== idx)})} className="text-red-500 text-[10px] font-black uppercase tracking-widest">Remove Review</button>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => updateTestimonialsData({...testimonialsData, items: [...testimonialsData.items, {name: 'New Reviewer', quote: '', avatar: '', rating: 5, date: 'today'}]})} className="w-full py-4 bg-zinc-800 rounded-xl text-zinc-400 font-black">+ ADD REVIEW</button>
                </div>
            </SectionCard>
        )}

        {activeTab === 'gallery' && (
            <SectionCard title="Manage Gallery">
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
                    {galleryData.images.map((img, idx) => (
                        <div key={img.id} className="relative aspect-square border border-zinc-800 rounded-xl overflow-hidden group">
                            <img src={img.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => updateGalleryData({...galleryData, images: galleryData.images.filter((_, i) => i !== idx)})} className="bg-red-600 text-white p-2 rounded-full shadow-lg">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="aspect-square border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center bg-zinc-900/50">
                        <ImageUploader onUpload={url => updateGalleryData({...galleryData, images: [...galleryData.images, {id: Date.now().toString(), url, caption: ''}]})} label="+ Upload" />
                    </div>
                </div>
            </SectionCard>
        )}

        {activeTab === 'library' && (
            <SectionCard title="Song Library">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-xs text-gray-500">Manage your tracks. MP3 files can be uploaded directly to the server.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="text-gray-500 border-b border-zinc-800 uppercase tracking-widest">
                                <th className="pb-4 font-black">Title</th>
                                <th className="pb-4 font-black">Artist</th>
                                <th className="pb-4 font-black">Audio Asset</th>
                                <th className="pb-4 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {songs.map((s, idx) => (
                                <tr key={s.id} className="group hover:bg-white/5">
                                    <td className="py-4"><input className="bg-transparent text-white outline-none focus:text-yellow-400 w-full" value={s.title} onChange={e => {
                                        const next = [...songs]; next[idx].title = e.target.value; updateSongs(next);
                                    }} /></td>
                                    <td className="py-4"><input className="bg-transparent text-gray-400 outline-none focus:text-yellow-400 w-full" value={s.artist} onChange={e => {
                                        const next = [...songs]; next[idx].artist = e.target.value; updateSongs(next);
                                    }} /></td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${s.fileUrl ? 'bg-green-500' : 'bg-zinc-700'}`}></span>
                                            <span className="text-[10px] text-zinc-500 truncate max-w-[100px]">{s.fileUrl ? 'MP3 Linked' : 'None'}</span>
                                            <ImageUploader label="Upload" onUpload={url => {
                                                const next = [...songs]; next[idx].fileUrl = url; updateSongs(next);
                                            }} />
                                        </div>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button onClick={() => updateSongs(songs.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-400 font-black">X</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={() => updateSongs([...songs, {id: Date.now().toString(), title: 'New Track', artist: 'Unknown'}])} className="w-full mt-6 py-3 border border-dashed border-zinc-800 text-zinc-500 rounded-xl hover:text-yellow-400 hover:border-yellow-400 transition-all font-black uppercase tracking-widest text-[10px]">
                    + ADD NEW TRACK
                </button>
            </SectionCard>
        )}

        {activeTab === 'menu' && (
            <>
                <SectionCard title="Food Menu Sections">
                    <div className="space-y-8">
                        {foodMenu.map((cat, catIdx) => (
                            <div key={catIdx} className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-800">
                                <div className="flex justify-between items-center mb-6">
                                    <InputGroup label="Category Name" value={cat.category} onChange={v => {
                                        const next = [...foodMenu]; next[catIdx].category = v; updateFoodMenu(next);
                                    }} />
                                    <button onClick={() => updateFoodMenu(foodMenu.filter((_, i) => i !== catIdx))} className="text-red-500 text-[10px] font-black uppercase tracking-widest">Delete Category</button>
                                </div>
                                <div className="space-y-4">
                                    {cat.items.map((item, itemIdx) => (
                                        <div key={itemIdx} className="grid grid-cols-[1fr_100px_auto] gap-4 items-center border-b border-zinc-800 pb-2">
                                            <input className="bg-transparent text-sm text-white outline-none" value={item.name} onChange={e => {
                                                const next = [...foodMenu]; next[catIdx].items[itemIdx].name = e.target.value; updateFoodMenu(next);
                                            }} />
                                            <input className="bg-transparent text-sm text-yellow-400 outline-none" value={item.price} onChange={e => {
                                                const next = [...foodMenu]; next[catIdx].items[itemIdx].price = e.target.value; updateFoodMenu(next);
                                            }} />
                                            <button onClick={() => {
                                                const next = [...foodMenu]; next[catIdx].items = next[catIdx].items.filter((_, i) => i !== itemIdx); updateFoodMenu(next);
                                            }} className="text-red-500">x</button>
                                        </div>
                                    ))}
                                    <button onClick={() => {
                                        const next = [...foodMenu]; next[catIdx].items.push({name: 'New Item', price: '0.00', description: ''}); updateFoodMenu(next);
                                    }} className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mt-2">+ Add Item</button>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => updateFoodMenu([...foodMenu, {category: 'New Section', items: []}])} className="w-full py-3 bg-zinc-800 rounded-xl text-zinc-500 font-black">+ ADD MENU SECTION</button>
                    </div>
                </SectionCard>
            </>
        )}

        {activeTab === 'config' && (
            <div className="space-y-8">
                <SectionCard title="Hostinger Sync (The PHP Backend)">
                    <div className="space-y-4">
                        <p className="text-xs text-gray-500">Ensure your <code>db.php</code> is updated with this exact code to support the new features.</p>
                        <div className="bg-black p-6 rounded-2xl border border-zinc-800 overflow-x-auto relative">
                            <pre className="text-[10px] text-green-400 leading-tight font-mono">{phpCode}</pre>
                            <button onClick={() => { navigator.clipboard.writeText(phpCode); alert("PHP Code copied!"); }} className="absolute top-4 right-4 text-[10px] bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-white font-black uppercase tracking-widest">Copy Code</button>
                        </div>
                        <InputGroup label="Sync URL (Hostinger db.php path)" value={syncUrl} onChange={v => updateSyncUrl(v)} />
                        <InputGroup label="Dashboard Password" value={adminPassword} onChange={v => updateAdminPassword(v)} />
                    </div>
                </SectionCard>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;