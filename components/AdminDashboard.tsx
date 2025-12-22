import React, { useState, useRef, useEffect } from 'react';
import { useData, Song, MenuCategory, MenuItem, DrinkCategory, EventSection, BlogPost } from '../context/DataContext';

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

const GoogleDriveModal: React.FC<{ onSelect: (url: string) => void; onClose: () => void }> = ({ onSelect, onClose }) => {
    const [driveLink, setDriveLink] = useState('');
    const [error, setError] = useState('');

    const handleImport = () => {
        setError('');
        const regExp = /(?:\/d\/|id=)([\w-]+)/;
        const match = driveLink.match(regExp);
        if (match && match[1]) {
            const fileId = match[1];
            const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
            onSelect(directUrl);
        } else {
            setError('Invalid Google Drive link. Please ensure it is a "Share" link.');
        }
    };

    return (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-900 w-full max-w-md rounded-3xl border border-zinc-800 p-8 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.74 3.522l-.005.01L2.25 13.032l3.46 5.991 5.485-9.5H22.18l-3.465-6zM5.13 19.38l3.465 6h10.97l3.465-6zM12.01 10.82l-5.485 9.5 3.465 6 5.485-9.5z" />
                        </svg>
                        Google Drive
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <p className="text-gray-400 text-sm mb-6">Paste the "Share" link. Ensure file access is <strong>"Anyone with the link"</strong>.</p>
                <div className="space-y-4">
                    <input type="text" placeholder="https://drive.google.com/file/d/..." className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition-all text-sm" value={driveLink} onChange={(e) => setDriveLink(e.target.value)} />
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <button onClick={handleImport} className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-3 rounded-xl transition-all uppercase tracking-widest text-xs">Import from Drive</button>
                </div>
            </div>
        </div>
    );
};

const MediaPicker: React.FC<{ onSelect: (url: string) => void; onClose: () => void }> = ({ onSelect, onClose }) => {
    const { fetchServerFiles } = useData();
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchServerFiles().then(res => { setFiles(res); setLoading(false); }); }, []);

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
                                <button key={i} onClick={() => onSelect(f.url)} className="aspect-square bg-black rounded-xl border border-zinc-800 overflow-hidden hover:border-yellow-400 transition-all group relative">
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ImageUploader: React.FC<{ onUpload: (url: string) => void; label?: string; multiple?: boolean }> = ({ onUpload, label = "Upload New", multiple = false }) => {
    const { uploadFile } = useData();
    const [uploading, setUploading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [showDrive, setShowDrive] = useState(false);
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
        <div className="flex items-center gap-2 mt-2 flex-wrap">
            <button onClick={() => fileRef.current?.click()} className="bg-zinc-700 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded text-white hover:bg-zinc-600 transition-colors">
                {uploading ? '...' : label}
            </button>
            <button onClick={() => setShowPicker(true)} className="bg-zinc-800 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded text-gray-300 hover:bg-zinc-700 transition-colors">Browse Server</button>
            <button onClick={() => setShowDrive(true)} className="bg-zinc-800 border border-zinc-700 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded text-green-500 hover:bg-green-900/20 hover:border-green-800 transition-colors flex items-center gap-1.5">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M7.74 3.522l-.005.01L2.25 13.032l3.46 5.991 5.485-9.5H22.18l-3.465-6zM5.13 19.38l3.465 6h10.97l3.465-6zM12.01 10.82l-5.485 9.5 3.465 6 5.485-9.5z" /></svg>
                Google Drive
            </button>
            <input type="file" ref={fileRef} className="hidden" multiple={multiple} onChange={handleUpload} />
            {showPicker && <MediaPicker onSelect={(url) => { onUpload(url); setShowPicker(false); }} onClose={() => setShowPicker(false)} />}
            {showDrive && <GoogleDriveModal onSelect={(url) => { onUpload(url); setShowDrive(false); }} onClose={() => setShowDrive(false)} />}
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
    adminPassword, updateAdminPassword, syncUrl, updateSyncUrl, saveToHostinger, loadFromHostinger, saveAllToSupabase, purgeCache
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
            <button onClick={saveToHostinger} disabled={isDataLoading} className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-3 rounded-full text-[12px] font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-pulse active:scale-95">
                {isDataLoading ? 'Saving All...' : 'Save All Changes'}
            </button>
            <button onClick={saveAllToSupabase} disabled={isDataLoading} className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-full text-[10px] font-black tracking-widest uppercase transition-all border border-zinc-700">Cloud Backup</button>
        </div>
      </div>

      <div className="flex bg-zinc-900 border-b border-zinc-800 overflow-x-auto scrollbar-hide px-4">
        {['home', 'experience', 'blog', 'vibe', 'events', 'reviews', 'menu', 'library', 'gallery', 'config'].map(t => (
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
                                    <img src={slide} className="w-full h-full object-cover" alt="" />
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
                        <button onClick={() => updateHeroData({...heroData, slides: [...(heroData.slides || []), '']})} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-600 hover:text-yellow-400 hover:border-yellow-400 transition-all font-bold">+ ADD NEW SLIDE</button>
                    </div>
                </SectionCard>
                <SectionCard title="Hero Headlines">
                    <InputGroup label="Heading" value={heroData.headingText} onChange={v => updateHeroData({...heroData, headingText: v})} />
                    <TextAreaGroup label="Subtext" value={heroData.subText} onChange={v => updateHeroData({...heroData, subText: v})} />
                    <InputGroup label="Badge (Festive Text)" value={heroData.badgeText} onChange={v => updateHeroData({...heroData, badgeText: v})} />
                    <InputGroup label="Button Text" value={heroData.buttonText} onChange={v => updateHeroData({...heroData, buttonText: v})} />
                </SectionCard>
            </>
        )}

        {activeTab === 'blog' && (
            <>
                <SectionCard title="Blog Settings">
                    <InputGroup label="Blog Heading" value={blogData.heading} onChange={v => updateBlogData({...blogData, heading: v})} />
                    <TextAreaGroup label="Blog Subtext" value={blogData.subtext} onChange={v => updateBlogData({...blogData, subtext: v})} />
                </SectionCard>
                <SectionCard title="Manage Posts">
                    <div className="space-y-6">
                        {blogData.posts.map((post, idx) => (
                            <div key={post.id} className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-800 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <InputGroup label="Title" value={post.title} onChange={v => { const next = [...blogData.posts]; next[idx].title = v; updateBlogData({...blogData, posts: next}); }} />
                                    <InputGroup label="Date" value={post.date} onChange={v => { const next = [...blogData.posts]; next[idx].date = v; updateBlogData({...blogData, posts: next}); }} />
                                </div>
                                <TextAreaGroup label="Excerpt" value={post.excerpt} onChange={v => { const next = [...blogData.posts]; next[idx].excerpt = v; updateBlogData({...blogData, posts: next}); }} />
                                <TextAreaGroup label="Full Content (Markdown)" value={post.content} onChange={v => { const next = [...blogData.posts]; next[idx].content = v; updateBlogData({...blogData, posts: next}); }} />
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Post Image</label>
                                    <img src={post.imageUrl} className="h-40 w-full object-cover rounded-xl" />
                                    <ImageUploader onUpload={url => { const next = [...blogData.posts]; next[idx].imageUrl = url; updateBlogData({...blogData, posts: next}); }} />
                                </div>
                                <button onClick={() => updateBlogData({...blogData, posts: blogData.posts.filter((_, i) => i !== idx)})} className="text-red-500 text-xs font-black uppercase tracking-widest">Delete Post</button>
                            </div>
                        ))}
                        <button onClick={() => updateBlogData({...blogData, posts: [...blogData.posts, {id: Date.now().toString(), title: 'New Story', date: new Date().toISOString().split('T')[0], excerpt: '', content: '', imageUrl: 'https://picsum.photos/800/600'}]})} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 font-bold hover:text-yellow-400 transition-all">+ WRITE NEW POST</button>
                    </div>
                </SectionCard>
            </>
        )}

        {activeTab === 'gallery' && (
            <SectionCard title="Manage Gallery">
                <p className="text-xs text-gray-500 mb-6 uppercase tracking-widest">Multi-select files to upload many at once.</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
                    {galleryData.images.map((img, idx) => (
                        <div key={img.id} className="relative aspect-square border border-zinc-800 rounded-xl overflow-hidden group">
                            <img src={img.url} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => updateGalleryData({...galleryData, images: galleryData.images.filter((_, i) => i !== idx)})} className="bg-red-600 text-white p-2 rounded-full shadow-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </div>
                        </div>
                    ))}
                    <div className="aspect-square border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center bg-zinc-900/50">
                        <ImageUploader multiple onUpload={url => updateGalleryData({...galleryData, images: [...galleryData.images, {id: Date.now().toString(), url, caption: ''}]})} label="+ Upload Many" />
                    </div>
                </div>
            </SectionCard>
        )}

        {activeTab === 'config' && (
            <div className="space-y-8">
                <SectionCard title="Device Sync & Performance">
                    <div className="space-y-4">
                        <p className="text-xs text-gray-400 font-medium">If changes aren't appearing on other devices, use the Purge button to force a fresh pull from the server.</p>
                        <button onClick={purgeCache} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all w-full md:w-auto shadow-lg active:scale-95">
                            Purge Device Cache & Reload
                        </button>
                    </div>
                </SectionCard>
                <SectionCard title="Server Sync (PHP Backend)">
                    <div className="space-y-4">
                        <p className="text-xs text-gray-500">Ensure your <code>db.php</code> is updated with this exact code to support all features.</p>
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