
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
  // Added updateAdminPassword to the destructuring list
  const { 
    isDataLoading, headerData, updateHeaderData, heroData, updateHeroData, highlightsData, updateHighlightsData,
    batteryData, updateBatteryData, galleryData, updateGalleryData, blogData, updateBlogData, 
    faqData, updateFaqData, songs, updateSongs, adminPassword, updateAdminPassword, syncUrl, updateSyncUrl,
    firebaseConfig, updateFirebaseConfig, saveToHostinger, saveToFirebase, uploadFile, purgeCache
  } = useData();

  const fileRef = useRef<HTMLInputElement>(null);

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i]);
        if (url) {
            // Functional update now works with corrected interface in DataContext.tsx
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

$db_host = 'localhost';
$db_name = 'u973281047_content_db';
$db_user = 'u973281047_content_user';
$db_pass = 'YOUR_DB_PASSWORD'; // Set this manually!
$auth_key = '${adminPassword}';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $pdo->exec("CREATE TABLE IF NOT EXISTS lkc_settings (id INT PRIMARY KEY DEFAULT 1, data LONGTEXT)");
} catch (PDOException $e) { die(json_encode(['success'=>false, 'error'=>$e->getMessage()])); }

$headers = getallheaders();
$auth = $headers['Authorization'] ?? '';
if ($auth !== "Bearer $auth_key") { http_response_code(401); die(json_encode(['success'=>false])); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    if (isset($_FILES['file'])) {
        $name = time().'_'.$_FILES['file']['name'];
        move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/'.$name);
        echo json_encode(['success'=>true, 'url'=>'https://'.$_SERVER['HTTP_HOST'].'/uploads/'.$name]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO lkc_settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)");
        $stmt->execute([$input]);
        echo json_encode(['success'=>true]);
    }
} else {
    $stmt = $pdo->query("SELECT data FROM lkc_settings WHERE id = 1");
    echo $stmt->fetchColumn() ?: json_encode(['error'=>'no data']);
}
?>`;

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-zinc-900 p-12 rounded-[3rem] border border-zinc-800 w-full max-m-md shadow-2xl">
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
        {['seo', 'hero', 'about', 'stats', 'gallery', 'blog', 'faq', 'songs', 'config'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-8 py-5 uppercase font-black text-[11px] tracking-widest transition-all relative ${tab === t ? 'text-pink-500' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {t}
                {tab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500"></div>}
            </button>
        ))}
      </div>

      <div className="container mx-auto p-10 max-w-5xl">
        {tab === 'seo' && (
            <SectionCard title="Global Identity">
                <Input label="Site Browser Title" value={headerData.siteTitle} onChange={v => updateHeaderData({...headerData, siteTitle: v})} />
                <TextArea label="SEO Meta Description" value={headerData.siteDescription} onChange={v => updateHeaderData({...headerData, siteDescription: v})} />
                <Input label="Logo SVG/PNG URL" value={headerData.logoUrl} onChange={v => updateHeaderData({...headerData, logoUrl: v})} />
                <Input label="Favicon URL" value={headerData.faviconUrl} onChange={v => updateHeaderData({...headerData, faviconUrl: v})} />
            </SectionCard>
        )}

        {tab === 'hero' && (
            <SectionCard title="Main Stage Hero">
                <Input label="Festive Badge Text" value={heroData.badgeText} onChange={v => updateHeroData({...heroData, badgeText: v})} />
                <Input label="Hero Title" value={heroData.headingText} onChange={v => updateHeroData({...heroData, headingText: v})} />
                <TextArea label="Subheading" value={heroData.subText} onChange={v => updateHeroData({...heroData, subText: v})} />
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-500 uppercase">Slide Backgrounds (URLs)</label>
                    {heroData.slides.map((s, i) => (
                        <div key={i} className="flex gap-4">
                            <input className="flex-1 bg-zinc-800 border border-zinc-700 p-3 rounded-xl text-xs" value={s} onChange={e => {
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

        {tab === 'gallery' && (
            <SectionCard title="Visual Archive">
                <Input label="Gallery Heading" value={galleryData.heading} onChange={v => updateGalleryData(prev => ({...prev, heading: v}))} />
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
                            <input className="bg-transparent border-b border-zinc-700 flex-1 outline-none text-sm" value={s.title} onChange={e => {
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
                <SectionCard title="MySQL Sync (Hostinger)">
                    <p className="text-xs text-zinc-500 mb-6 uppercase tracking-widest">Connect to your u973281047_content_db</p>
                    <div className="bg-black p-8 rounded-[2rem] border border-zinc-800 overflow-x-auto relative mb-6">
                        <pre className="text-[10px] text-green-500 font-mono leading-tight">{phpSnippet}</pre>
                        <button onClick={() => { navigator.clipboard.writeText(phpSnippet); alert("Copied!"); }} className="absolute top-6 right-6 bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-xl text-[10px] font-black">COPY PHP</button>
                    </div>
                    <Input label="MySQL Endpoint (londonkaraoke.club/db.php)" value={syncUrl} onChange={v => updateSyncUrl(v)} />
                    <Input label="Admin Sync Password" value={adminPassword} onChange={v => updateAdminPassword(v)} type="password" />
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
