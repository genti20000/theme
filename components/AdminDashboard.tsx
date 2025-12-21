
import React, { useState, useRef, useEffect } from 'react';
import { useData, Song, MenuCategory, MenuItem } from '../context/DataContext';

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
    <h3 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-2">{title}</h3>
    {children}
  </div>
);

const InputGroup: React.FC<{ label: string; value: string; onChange: (val: string) => void; type?: string }> = ({ label, value, onChange, type = 'text' }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
    <input 
      type={type}
      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-400"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ImageUploader: React.FC<{ onUpload: (url: string) => void; label?: string }> = ({ onUpload, label = "Upload" }) => {
    const { uploadFile } = useData();
    const [uploading, setUploading] = useState(false);
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
        <div className="flex items-center gap-2">
            <button onClick={() => fileRef.current?.click()} className="bg-zinc-700 text-xs px-3 py-1.5 rounded text-white hover:bg-zinc-600">
                {uploading ? '...' : label}
            </button>
            <input type="file" ref={fileRef} className="hidden" onChange={handleUpload} />
        </div>
    );
};

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { 
    saveAllToSupabase, isDataLoading, config, updateConfig,
    songs, updateSongs, heroData, updateHeroData, footerData, updateFooterData,
    foodMenu, updateFoodMenu, vibeData, updateVibeData, testimonialsData, updateTestimonialsData,
    galleryData, updateGalleryData, adminPassword, updateAdminPassword, exportDatabase, importDatabase,
    syncUrl, updateSyncUrl, saveToHostinger, loadFromHostinger
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

  const handleExportDB = () => {
    const data = exportDatabase();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lkc_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDB = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        if (event.target?.result) {
            importDatabase(event.target.result as string);
        }
    };
    reader.readAsText(file);
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        if (!is_dir($uploadDir)) { mkdir($uploadDir, 0755, true); }
        $ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
        $fileName = time() . '_' . uniqid() . '.' . $ext;
        $target = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $dir = dirname($_SERVER['PHP_SELF']);
            $url = "$protocol://$host" . ($dir === '/' ? '' : $dir) . "/$target";
            echo json_encode(['success' => true, 'url' => $url]);
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
    if (file_exists($dataFile)) {
        header('Content-Type: application/json');
        echo file_get_contents($dataFile);
    } else {
        echo json_encode(['error' => 'No data found']);
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
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">LKC Control Center</h2>
        <div className="flex gap-2">
            <button onClick={saveToHostinger} disabled={isDataLoading} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-[0_0_10px_rgba(37,99,235,0.4)]">{isDataLoading ? '...' : 'SYNC HOSTINGER'}</button>
            <button onClick={saveAllToSupabase} disabled={isDataLoading} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-[0_0_10px_rgba(22,163,74,0.4)]">{isDataLoading ? '...' : 'CLOUD SAVE'}</button>
        </div>
      </div>

      <div className="flex bg-zinc-900 border-b border-zinc-800 overflow-x-auto scrollbar-hide">
        {['general', 'gallery', 'songs', 'reviews', 'food', 'database'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-8 py-4 capitalize font-bold transition-colors whitespace-nowrap ${activeTab === t ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}>{t}</button>
        ))}
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        {activeTab === 'general' && (
            <SectionCard title="Hero & Branding">
                <InputGroup label="Main Heading" value={heroData.headingText} onChange={v => updateHeroData({...heroData, headingText: v})} />
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Hero Image</label>
                    <ImageUploader onUpload={url => updateHeroData({...heroData, backgroundImageUrl: url})} label="Upload Local Image" />
                    <p className="text-xs text-zinc-500 mt-1">Uploaded images are stored in your Hostinger 'uploads/' folder.</p>
                </div>
            </SectionCard>
        )}

        {activeTab === 'gallery' && (
            <SectionCard title="Manage Gallery">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {galleryData.images.map((img, idx) => (
                        <div key={img.id} className="relative aspect-square border border-zinc-700 rounded-lg overflow-hidden group">
                            <img src={img.url} className="w-full h-full object-cover" />
                            <button 
                                onClick={() => updateGalleryData({...galleryData, images: galleryData.images.filter((_, i) => i !== idx)})}
                                className="absolute top-1 right-1 bg-red-600 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                    <div className="aspect-square border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center">
                        <ImageUploader onUpload={url => updateGalleryData({...galleryData, images: [...galleryData.images, { id: Date.now().toString(), url, caption: '' }]})} label="+ Add to Gallery" />
                    </div>
                </div>
            </SectionCard>
        )}

        {activeTab === 'songs' && (
            <SectionCard title="Song Library">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b border-zinc-800 text-gray-400"><th className="pb-2">Title</th><th className="pb-2">Artist</th><th className="pb-2">Audio</th><th className="pb-2"></th></tr></thead>
                    <tbody>{songs.map(s => (
                        <tr key={s.id} className="border-b border-zinc-800/50">
                            <td className="py-2"><input value={s.title} onChange={e => updateSongs(songs.map(x => x.id === s.id ? {...x, title: e.target.value} : x))} className="bg-transparent w-full outline-none focus:text-yellow-400"/></td>
                            <td className="py-2"><input value={s.artist} onChange={e => updateSongs(songs.map(x => x.id === s.id ? {...x, artist: e.target.value} : x))} className="bg-transparent w-full outline-none focus:text-yellow-400"/></td>
                            <td className="py-2">
                                <span className="text-xs truncate block max-w-[100px]">{s.fileUrl ? 'MP3 Linked' : 'No Audio'}</span>
                            </td>
                            <td className="py-2 text-right"><ImageUploader onUpload={url => updateSongs(songs.map(x => x.id === s.id ? {...x, fileUrl: url} : x))} label="Upload MP3" /></td>
                        </tr>
                    ))}</tbody>
                </table>
                <button onClick={() => updateSongs([...songs, { id: Date.now().toString(), title: 'New Song', artist: 'Unknown' }])} className="mt-4 text-yellow-400 text-sm font-bold">+ Add Row</button>
            </SectionCard>
        )}

        {activeTab === 'database' && (
            <div className="space-y-8">
                <SectionCard title="Hostinger Local Setup (Backend Script)">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400">This script handles both site data and local image uploads to your Hostinger server.</p>
                        <div className="bg-black p-4 rounded-lg border border-zinc-700 overflow-x-auto relative">
                            <pre className="text-[10px] text-green-400 leading-tight">{phpCode}</pre>
                            <button onClick={() => { navigator.clipboard.writeText(phpCode); alert("PHP Code copied!"); }} className="absolute top-2 right-2 text-[10px] bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded text-white font-bold">Copy Script</button>
                        </div>
                        <InputGroup label="Sync URL (e.g. https://londonkaraoke.club/db.php)" value={syncUrl} onChange={v => updateSyncUrl(v)} />
                    </div>
                </SectionCard>
                <SectionCard title="Admin Security">
                    <InputGroup label="Dashboard Password" value={adminPassword} onChange={v => updateAdminPassword(v)} />
                </SectionCard>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
