
import React, { useState, useRef, useEffect } from 'react';
import { useData, MenuItem, Song, Booking, GalleryItem, VideoItem } from '../context/DataContext';

interface AdminDashboardProps {}

// Helper function for Base64 conversion
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

type AdminTab = 'header' | 'hero' | 'events' | 'songs' | 'bookings' | 'files' | 'highlights' | 'features' | 'vibe' | 'gallery' | 'testimonials' | 'food' | 'drinks' | 'battery' | 'footer' | 'database';

// Reusable Components
const SectionCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg mb-8">
    <div className="mb-6 border-b border-zinc-800 pb-4">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
    {children}
  </div>
);

const InputGroup: React.FC<{ label: string; value: string; onChange: (val: string) => void; type?: 'text' | 'textarea' | 'password' }> = ({ label, value, onChange, type = 'text' }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
    {type === 'textarea' ? (
      <textarea 
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white focus:border-yellow-400 outline-none transition-colors min-h-[100px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input 
        type={type}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white focus:border-yellow-400 outline-none transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </div>
);

const ImageUploader: React.FC<{ onUpload: (url: string) => void; label?: string; multiple?: boolean; onBulkUpload?: (files: File[]) => void }> = ({ onUpload, label = "Upload Image", multiple = false, onBulkUpload }) => {
    const { dbConfig, uploadToSupabase } = useData();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (multiple && onBulkUpload) {
            onBulkUpload(Array.from(files));
            return;
        }

        const file = files[0];
        if (file) {
            setUploading(true);
            
            // 1. Try Supabase Upload first
            if (dbConfig.supabaseUrl && dbConfig.supabaseKey) {
                try {
                    const bucket = dbConfig.storageBucket || 'public';
                    // Sanitize filename
                    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                    const path = `uploads/${Date.now()}_${cleanName}`;
                    
                    const url = await uploadToSupabase(file, path, bucket);
                    if (url) {
                        onUpload(url);
                        setUploading(false);
                        return;
                    }
                } catch (e) {
                    console.error("Supabase upload failed, falling back", e);
                }
            }

            // 2. Fallback to Simulation / Server Path
            setTimeout(async () => {
                try {
                    // Simulation of server path for this environment if no Supabase
                    const fakeServerUrl = `https://londonkaraoke.club/${dbConfig.photoFolder || 'uploads/'}${file.name}`;
                    // In a real app, you would POST to dbConfig.uploadScriptUrl here
                    onUpload(fakeServerUrl);
                } catch (err) {
                    console.error(err);
                    alert("Failed to read file");
                }
                setUploading(false);
            }, 800);
        }
    };

    return (
        <div>
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-xs py-2 px-3 rounded border border-zinc-600 transition-colors whitespace-nowrap flex items-center gap-2"
            >
                {uploading ? (
                    <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Uploading...
                    </>
                ) : (
                    <>
                       {label} {dbConfig.supabaseUrl ? '(Supabase)' : (dbConfig.uploadScriptUrl ? '(Server)' : '')}
                    </>
                )}
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,video/*"
                multiple={multiple}
            />
        </div>
    );
};

const MultiUploader: React.FC<{ onUploadComplete: (urls: {url: string, type: 'image' | 'video'}[]) => void, useSupabase?: boolean }> = ({ onUploadComplete, useSupabase = false }) => {
    const { dbConfig, uploadToSupabase } = useData();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBulkUpload = async (files: File[]) => {
        setUploading(true);
        setProgress(0);
        const uploadedItems: {url: string, type: 'image' | 'video'}[] = [];
        
        const total = files.length;
        let current = 0;

        for (const file of files) {
            const isVideo = file.type.startsWith('video/');
            const type = isVideo ? 'video' : 'image';
            
            try {
                let finalUrl = '';
                if (useSupabase) {
                    const bucket = dbConfig.storageBucket || 'public'; 
                    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                    const path = `uploads/${Date.now()}_${cleanName}`;
                    const url = await uploadToSupabase(file, path, bucket);
                    if (url) finalUrl = url;
                } else {
                    const folder = isVideo ? (dbConfig.videoFolder || 'uploads/videos/') : (dbConfig.photoFolder || 'uploads/photos/');
                    finalUrl = `https://londonkaraoke.club/${folder}${file.name}`;
                }

                if (finalUrl) {
                    uploadedItems.push({ url: finalUrl, type });
                }
            } catch (e) {}
            
            current++;
            setProgress(Math.round((current / total) * 100));
        }
        
        onUploadComplete(uploadedItems);
        setUploading(false);
        setProgress(0);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) handleBulkUpload(Array.from(e.target.files));
    }

    return (
        <div className="w-full">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-sm font-semibold py-8 rounded-xl border-2 border-dashed border-zinc-700 hover:border-yellow-400 transition-colors flex flex-col items-center justify-center gap-2"
                disabled={uploading}
            >
                {uploading ? (
                    <>
                        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading {progress}%...</span>
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>Click to Upload Files {useSupabase ? '(to Supabase)' : '(Server Link)'}</span>
                    </>
                )}
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleChange} 
                className="hidden" 
                accept="image/*,video/*"
                multiple
            />
            {uploading && (
                <div className="mt-2 w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-yellow-400 h-2.5 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            )}
        </div>
    );
}

const ImageField: React.FC<{ url: string; onUpdate: (url: string) => void }> = ({ url, onUpdate }) => {
    const SERVER_PATH = 'https://londonkaraoke.club/uploads/';
    const isServerFile = url.startsWith(SERVER_PATH);
    const [mode, setMode] = useState<'url' | 'server'>(isServerFile ? 'server' : 'url');
    
    const getFilename = (fullUrl: string) => {
        if (fullUrl.startsWith(SERVER_PATH)) {
            return fullUrl.replace(SERVER_PATH, '');
        }
        return '';
    };

    return (
        <div className="flex gap-4 items-start bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/50">
            <div className="w-16 h-16 bg-black rounded overflow-hidden flex-shrink-0 border border-zinc-700">
                {url.match(/\.(mp4|webm|mov)$/i) ? (
                    <video src={url} className="w-full h-full object-cover" muted />
                ) : (
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                )}
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex gap-2 mb-2 border-b border-zinc-800 pb-2">
                    <button 
                        onClick={() => setMode('url')} 
                        className={`text-xs px-2 py-1 rounded ${mode === 'url' ? 'bg-zinc-700 text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                        URL
                    </button>
                    <button 
                        onClick={() => setMode('server')} 
                        className={`text-xs px-2 py-1 rounded ${mode === 'server' ? 'bg-purple-900/50 text-purple-200 border border-purple-500/50' : 'text-gray-500 hover:text-white'}`}
                    >
                        Server File
                    </button>
                </div>

                {mode === 'url' ? (
                    <input 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-xs text-gray-300 focus:border-yellow-400 outline-none"
                        value={url}
                        onChange={(e) => onUpdate(e.target.value)}
                        placeholder="https://..."
                    />
                ) : (
                    <div className="flex items-center gap-0 w-full bg-zinc-800 border border-zinc-700 rounded overflow-hidden focus-within:border-yellow-400">
                        <span className="bg-zinc-900 text-gray-500 text-[10px] px-2 py-2 border-r border-zinc-700 select-none hidden md:block">
                            .../uploads/
                        </span>
                        <input 
                            className="w-full bg-transparent px-3 py-2 text-xs text-yellow-400 outline-none placeholder-zinc-600"
                            value={getFilename(url)}
                            onChange={(e) => onUpdate(`${SERVER_PATH}${e.target.value}`)}
                            placeholder="filename.jpg"
                        />
                    </div>
                )}

                <div className="flex justify-between items-center mt-2">
                     <span className="text-[10px] text-gray-600">
                        {mode === 'server' ? 'Direct link to hosting file' : 'External link or Base64'}
                     </span>
                    <ImageUploader onUpload={onUpdate} label="Upload" />
                </div>
            </div>
        </div>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { 
    foodMenu, updateFoodMenu, 
    drinksData, updateDrinksData, 
    headerData, updateHeaderData,
    heroData, updateHeroData,
    highlightsData, updateHighlightsData,
    featuresData, updateFeaturesData,
    vibeData, updateVibeData,
    testimonialsData, updateTestimonialsData,
    batteryData, updateBatteryData,
    footerData, updateFooterData,
    galleryData, updateGalleryData,
    eventsData, updateEventsData,
    dbConfig, updateDbConfig,
    songs, updateSongs,
    bookings, updateBookings,
    resetToDefaults,
    fetchSupabaseFiles,
    deleteSupabaseFile,
    saveAllToSupabase
  } = useData();
  const [activeTab, setActiveTab] = useState<AdminTab>('header');

  // Save State
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Song Bulk Import
  const [bulkSongsText, setBulkSongsText] = useState('');

  // File Manager State
  const [fileList, setFileList] = useState<{name: string, url: string}[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  useEffect(() => {
      if (activeTab === 'files') {
          loadFiles();
      }
  }, [activeTab]);

  const loadFiles = async () => {
      setIsLoadingFiles(true);
      try {
          const bucket = dbConfig.storageBucket || 'public';
          // Fetch from root and uploads/ to show everything
          const rootFiles = await fetchSupabaseFiles(bucket, ''); 
          const uploadFiles = await fetchSupabaseFiles(bucket, 'uploads');
          
          // Combine and dedupe
          const combined = [...rootFiles, ...uploadFiles];
          const uniqueFiles = Array.from(new Map(combined.map(item => [item.name, item])).values());
          
          setFileList(uniqueFiles);
      } catch (e) {
          console.error("Failed to load files", e);
      } finally {
          setIsLoadingFiles(false);
      }
  };

  const handleDeleteFile = async (name: string) => {
      if (!confirm(`Delete ${name} permanently?`)) return;
      const bucket = dbConfig.storageBucket || 'public';
      // Determine if file is in subfolder based on name or try both?
      // deleteSupabaseFile takes a path.
      let path = name;
      // Heuristic: if it looks like just a filename, assume root, otherwise use path
      
      const success = await deleteSupabaseFile(path, bucket);
      if (success) {
          loadFiles(); // Refresh list
      } else {
          alert("Failed to delete file.");
      }
  };

  const handleTestSupabase = async () => {
      try {
          const result = await fetchSupabaseFiles(dbConfig.storageBucket || 'public', '');
          alert(`Connection Successful! Found ${result.length} files in bucket '${dbConfig.storageBucket || 'public'}'.`);
      } catch (e) {
          console.error(e);
          alert("Connection Failed. Check console for details.");
      }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };
  
  const handleSave = async () => {
    setSaveStatus('saving');
    await saveAllToSupabase();
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };
  
  const handleFlushCache = () => {
      if (confirm("Are you sure you want to flush the local cache? This will remove all saved data and reload the admin panel.")) {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith('lkc_')) {
                  keysToRemove.push(key);
              }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
          window.location.reload();
      }
  };

  // Download Handlers
  const handleDownloadSQL = () => {
      let sql = `CREATE DATABASE IF NOT EXISTS \`${dbConfig.name}\`;\nUSE \`${dbConfig.name}\`;\n\n`;
      sql += `CREATE TABLE IF NOT EXISTS songs (id VARCHAR(255) PRIMARY KEY, title VARCHAR(255), artist VARCHAR(255), genre VARCHAR(100), language VARCHAR(50));\n`;
      sql += `CREATE TABLE IF NOT EXISTS bookings (id VARCHAR(255) PRIMARY KEY, customer_name VARCHAR(255), email VARCHAR(255), phone VARCHAR(50), date DATE, time VARCHAR(10), guests INT, room VARCHAR(100), status VARCHAR(50));\n`;
      sql += `CREATE TABLE IF NOT EXISTS app_settings (key VARCHAR(255) PRIMARY KEY, value JSON);\n\n`;
      
      // Dump Songs
      songs.forEach(s => {
          sql += `INSERT INTO songs VALUES ('${s.id}', '${s.title.replace(/'/g, "''")}', '${s.artist.replace(/'/g, "''")}', '${s.genre || ''}', '${s.language || ''}');\n`;
      });
      // Dump Bookings
      bookings.forEach(b => {
          sql += `INSERT INTO bookings VALUES ('${b.id}', '${b.customerName.replace(/'/g, "''")}', '${b.email}', '${b.phone}', '${b.date}', '${b.time}', ${b.guests}, '${b.room}', '${b.status}');\n`;
      });

      const blob = new Blob([sql], { type: 'text/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lkc_setup.sql';
      a.click();
  };

  const handleDownloadUploadScript = () => {
      const php = `<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '${dbConfig.photoFolder || 'uploads/'}';
    // Check if it's video
    if (strpos($_FILES['file']['type'], 'video') !== false) {
        $uploadDir = '${dbConfig.videoFolder || 'uploads/videos/'}';
    }
    
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $filename = basename($_FILES['file']['name']);
    $targetFile = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
        echo json_encode(['url' => 'https://' . $_SERVER['HTTP_HOST'] . '/' . $targetFile]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or upload error.']);
}
?>`;
      const blob = new Blob([php], { type: 'text/x-php' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'upload.php';
      a.click();
  };

  // --- Handlers ---
  const handleHeroChange = (field: string, value: any) => { updateHeroData({ ...heroData, [field]: value }); };
  const handleHighlightsChange = (field: string, value: any) => { updateHighlightsData({ ...highlightsData, [field]: value }); };
  
  const handleUpdateSong = (id: string, field: keyof Song, value: string) => {
      updateSongs(songs.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const handleAddSong = () => { updateSongs([...songs, { id: Date.now().toString(), title: 'New Song', artist: 'Artist', genre: 'Pop', language: 'English' }]); };
  const handleDeleteSong = (id: string) => { if(confirm("Delete?")) updateSongs(songs.filter(s => s.id !== id)); };
  const handleBulkImportSongs = () => {
      const lines = bulkSongsText.split('\n');
      const newSongsImported: Song[] = [];
      lines.forEach(line => {
          const parts = line.split(',');
          if (parts.length >= 2) newSongsImported.push({ id: Date.now().toString() + Math.random(), title: parts[0].trim(), artist: parts[1].trim(), genre: parts[2]?.trim() || 'Pop', language: 'English' });
      });
      updateSongs([...songs, ...newSongsImported]);
      setBulkSongsText('');
      alert(`Imported ${newSongsImported.length} songs.`);
  };
  const handleAddBooking = () => { updateBookings([...bookings, { id: Date.now().toString(), customerName: 'New Guest', email: '', phone: '', date: new Date().toISOString().split('T')[0], time: '20:00', guests: 4, room: 'Standard', status: 'pending' }]); };
  const handleDeleteBooking = (id: string) => { if(confirm("Delete?")) updateBookings(bookings.filter(b => b.id !== id)); };
  const handleUpdateBooking = (id: string, field: keyof Booking, value: any) => { updateBookings(bookings.map(b => b.id === id ? { ...b, [field]: value } : b)); };
  
  const handleAddSlide = () => { handleHeroChange('slides', [...(heroData.slides || []), 'https://picsum.photos/seed/newslide/1600/900']); };
  const handleRemoveSlide = (index: number) => { const newSlides = [...(heroData.slides || [])]; newSlides.splice(index, 1); handleHeroChange('slides', newSlides); };
  const handleUpdateSlide = (index: number, value: string) => { const newSlides = [...(heroData.slides || [])]; newSlides[index] = value; handleHeroChange('slides', newSlides); }
  const handleAddGalleryImage = () => { updateGalleryData({ ...galleryData, images: [...galleryData.images, { id: Date.now().toString(), url: 'https://picsum.photos/seed/new/800/800', caption: 'New Image' }] }); }
  const handleDeleteGalleryImage = (index: number) => { if(confirm("Remove?")) { const newImgs = [...galleryData.images]; newImgs.splice(index, 1); updateGalleryData({ ...galleryData, images: newImgs }); } }
  const handleUpdateVideo = (index: number, field: string, value: string) => { const newVids = [...(galleryData.videos || [])]; if(newVids[index]) { newVids[index] = { ...newVids[index], [field]: value }; updateGalleryData({ ...galleryData, videos: newVids }); } }
  const handleAddGalleryVideo = () => { updateGalleryData({ ...galleryData, videos: [...(galleryData.videos || []), { id: Date.now().toString(), url: '', thumbnail: '', title: 'New Video' }] }); }
  const handleDeleteGalleryVideo = (index: number) => { if(confirm("Remove?")) { const newVids = [...(galleryData.videos || [])]; newVids.splice(index, 1); updateGalleryData({ ...galleryData, videos: newVids }); } }

  
  const handleBulkUploadComplete = (items: {url: string, type: 'image' | 'video'}[]) => {
      const newImages = [...galleryData.images];
      const newVideos = [...(galleryData.videos || [])];
      items.forEach(item => {
          if (item.type === 'image') newImages.push({ id: Date.now().toString() + Math.random(), url: item.url, caption: 'New Upload' });
          else newVideos.push({ id: Date.now().toString() + Math.random(), url: item.url, thumbnail: '', title: 'New Upload' });
      });
      updateGalleryData({ ...galleryData, images: newImages, videos: newVideos });
      alert(`Uploaded ${items.length} items successfully.`);
  };
  const handleFileUploadComplete = () => {
      loadFiles(); 
  }
  
  if (!isAuthenticated) return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="block text-gray-400 text-sm mb-2">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:border-yellow-400" placeholder="Enter admin password"/></div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-colors">Login</button>
          </form>
           <div className="mt-6 text-center text-zinc-600 text-xs">Hint: admin123</div>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-yellow-400">LKC Backend</h2>
          <div className="flex gap-4 items-center">
             <button onClick={handleSave} disabled={saveStatus === 'saving'} className={`text-sm font-bold py-2 px-6 rounded-full transition-all flex items-center gap-2 shadow-md ${saveStatus === 'saved' ? 'bg-green-500 text-white cursor-default' : 'bg-yellow-400 hover:bg-yellow-500 text-black hover:scale-105'}`}>
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved Successfully' : 'Save All Changes'}
             </button>
             <div className="h-6 w-px bg-zinc-700 mx-2"></div>
             <button onClick={handleFlushCache} className="text-xs text-orange-400 hover:text-orange-300 underline mr-4">Flush Cache</button>
             <button onClick={resetToDefaults} className="text-xs text-red-400 hover:text-red-300 underline">Reset Data</button>
            <button onClick={() => setIsAuthenticated(false)} className="text-sm text-gray-400 hover:text-white">Logout</button>
          </div>
        </div>
        <div className="container mx-auto px-6 flex gap-6 text-sm font-semibold overflow-x-auto no-scrollbar">
             {['header', 'hero', 'events', 'songs', 'bookings', 'files', 'highlights', 'features', 'vibe', 'gallery', 'testimonials', 'food', 'drinks', 'battery', 'footer', 'database'].map((tab) => (
                 <button key={tab} onClick={() => setActiveTab(tab as AdminTab)} className={`pb-3 border-b-2 transition-colors whitespace-nowrap capitalize ${activeTab === tab ? 'border-yellow-400 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>{tab}</button>
             ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {activeTab === 'files' && (
            <div className="space-y-8">
                <SectionCard title="File Manager (Supabase)" description="Manage images and videos stored in your Supabase storage bucket.">
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Upload Files to Storage</label>
                        <MultiUploader onUploadComplete={handleFileUploadComplete} useSupabase={true} />
                    </div>
                    
                    <div className="border-t border-zinc-800 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-white">Storage Contents</h4>
                            <div className="flex gap-4 items-center">
                                <span className="text-xs text-gray-500">If list is empty, check RLS Policies on Supabase!</span>
                                <button onClick={loadFiles} className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-white">Refresh</button>
                            </div>
                        </div>
                        
                        {isLoadingFiles ? (
                            <div className="text-center py-10 text-gray-500">Loading files...</div>
                        ) : fileList.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 bg-zinc-950/30 rounded-lg">No files found in bucket.</div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {fileList.map((file) => (
                                    <div key={file.name} className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden group relative">
                                        <div className="aspect-square bg-black flex items-center justify-center overflow-hidden">
                                            {file.url.toLowerCase().match(/\.(mp4|webm|mov)$/) ? (
                                                <video src={file.url} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="p-2 text-xs truncate text-gray-400">{file.name}</div>
                                        
                                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <button 
                                                onClick={() => {navigator.clipboard.writeText(file.url); alert("Copied URL!");}}
                                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded"
                                            >
                                                Copy URL
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteFile(file.name)}
                                                className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </SectionCard>
            </div>
        )}

        {/* Header Settings */}
        {activeTab === 'header' && <SectionCard title="Header Settings" description=""><ImageField url={headerData.logoUrl} onUpdate={(v) => updateHeaderData({...headerData, logoUrl: v})} /></SectionCard>}
        
        {/* Hero Settings */}
        {activeTab === 'hero' && (
            <SectionCard title="Homepage Hero" description="">
                 <InputGroup label="Badge Text" value={heroData.badgeText} onChange={(v) => handleHeroChange('badgeText', v)} />
                 <InputGroup label="Main Heading" value={heroData.headingText} onChange={(v) => handleHeroChange('headingText', v)} />
                 <InputGroup label="Subtext" value={heroData.subText} onChange={(v) => handleHeroChange('subText', v)} type="textarea" />
                 <InputGroup label="Button Text" value={heroData.buttonText} onChange={(v) => handleHeroChange('buttonText', v)} />
                 <div className="border-t border-zinc-800 pt-6 mt-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-4">Slideshow</label>
                    <div className="space-y-2 mb-4">
                        {(heroData.slides || [heroData.backgroundImageUrl]).map((slide, i) => (
                            <div key={i} className="flex gap-2 items-center bg-zinc-950 p-2 rounded"><span className="text-gray-500 w-4">{i+1}</span><div className="flex-1"><ImageField url={slide} onUpdate={(v) => handleUpdateSlide(i, v)} /></div><button onClick={() => handleRemoveSlide(i)} className="text-red-500 font-bold px-2">X</button></div>
                        ))}
                    </div>
                    <button onClick={handleAddSlide} className="w-full py-2 border-2 border-dashed border-zinc-700 text-gray-400 hover:text-yellow-400 rounded text-sm">+ Add Slide</button>
                 </div>
            </SectionCard>
        )}

        {/* Events Page Settings */}
        {activeTab === 'events' && (
            <SectionCard title="Events Page" description="Manage the content for Birthday Parties, Hen Dos, and Corporate Events.">
                <div className="mb-8">
                    <h4 className="font-bold text-yellow-400 mb-4">Events Hero</h4>
                    <InputGroup label="Title" value={eventsData.hero.title} onChange={(v) => updateEventsData({...eventsData, hero: {...eventsData.hero, title: v}})} />
                    <InputGroup label="Subtitle" value={eventsData.hero.subtitle} onChange={(v) => updateEventsData({...eventsData, hero: {...eventsData.hero, subtitle: v}})} />
                    <div className="mb-4"><label className="block text-sm font-semibold text-gray-300 mb-2">Hero Image</label><ImageField url={eventsData.hero.image} onUpdate={(v) => updateEventsData({...eventsData, hero: {...eventsData.hero, image: v}})} /></div>
                </div>
                
                <div className="space-y-8">
                    {eventsData.sections.map((section, idx) => (
                        <div key={section.id} className="bg-zinc-950 p-4 rounded border border-zinc-800">
                            <h4 className="font-bold text-white mb-4 capitalize">{section.id} Section</h4>
                            <InputGroup label="Title" value={section.title} onChange={(v) => {
                                const newSections = [...eventsData.sections];
                                newSections[idx] = { ...section, title: v };
                                updateEventsData({ ...eventsData, sections: newSections });
                            }} />
                            <InputGroup label="Subtitle" value={section.subtitle} onChange={(v) => {
                                const newSections = [...eventsData.sections];
                                newSections[idx] = { ...section, subtitle: v };
                                updateEventsData({ ...eventsData, sections: newSections });
                            }} />
                            <InputGroup label="Description" value={section.description} onChange={(v) => {
                                const newSections = [...eventsData.sections];
                                newSections[idx] = { ...section, description: v };
                                updateEventsData({ ...eventsData, sections: newSections });
                            }} type="textarea" />
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Section Image</label>
                                <ImageField url={section.imageUrl} onUpdate={(v) => {
                                    const newSections = [...eventsData.sections];
                                    newSections[idx] = { ...section, imageUrl: v };
                                    updateEventsData({ ...eventsData, sections: newSections });
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>
        )}

        {/* Song Library */}
        {activeTab === 'songs' && (
            <SectionCard title="Song Library" description="Manage the song database. Use bulk import for large lists.">
                <div className="mb-6 border-b border-zinc-800 pb-6">
                    <h4 className="text-sm font-bold text-white mb-2">Bulk Import</h4>
                    <p className="text-xs text-gray-500 mb-2">Format: Title, Artist, Genre (optional). One song per line.</p>
                    <textarea 
                        value={bulkSongsText}
                        onChange={(e) => setBulkSongsText(e.target.value)}
                        placeholder={`e.g.\nBohemian Rhapsody, Queen, Rock\nWonderwall, Oasis`}
                        className="w-full h-32 bg-zinc-950 border border-zinc-700 rounded p-2 text-xs text-gray-300 mb-2"
                    />
                    <button onClick={handleBulkImportSongs} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-xs font-bold">Import Songs</button>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-white">Song List ({songs.length})</h4>
                    <button onClick={handleAddSong} className="bg-green-600 px-3 py-1 rounded text-xs text-white hover:bg-green-500">+ Add Song</button>
                </div>
                <div className="max-h-96 overflow-y-auto border border-zinc-800 rounded bg-zinc-950">
                    <table className="w-full text-xs text-left text-gray-400">
                        <thead className="bg-zinc-900 text-gray-200 sticky top-0"><tr><th className="px-4 py-2">Title</th><th className="px-4 py-2">Artist</th><th className="px-4 py-2">Genre</th><th className="px-4 py-2 w-10"></th></tr></thead>
                        <tbody>{songs.map(s => (<tr key={s.id} className="border-b border-zinc-800 hover:bg-zinc-900"><td className="px-4 py-2"><input value={s.title} onChange={(e) => handleUpdateSong(s.id, 'title', e.target.value)} className="bg-transparent w-full outline-none"/></td><td className="px-4 py-2"><input value={s.artist} onChange={(e) => handleUpdateSong(s.id, 'artist', e.target.value)} className="bg-transparent w-full outline-none"/></td><td className="px-4 py-2"><input value={s.genre || ''} onChange={(e) => handleUpdateSong(s.id, 'genre', e.target.value)} className="bg-transparent w-full outline-none"/></td><td className="px-4 py-2 text-center"><button onClick={() => handleDeleteSong(s.id)} className="text-red-500 hover:text-red-400 font-bold">X</button></td></tr>))}</tbody>
                    </table>
                </div>
            </SectionCard>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
            <SectionCard title="Bookings" description="Manage reservations. (Note: Primarily use Square for real bookings, this is for manual tracking)">
                <div className="flex justify-end mb-4">
                    <button onClick={handleAddBooking} className="bg-green-600 px-3 py-1 rounded text-xs text-white hover:bg-green-500">+ New Booking</button>
                </div>
                <div className="overflow-x-auto border border-zinc-800 rounded bg-zinc-950">
                    <table className="w-full text-xs text-left text-gray-400">
                        <thead className="bg-zinc-900 text-gray-200">
                            <tr><th className="p-3">Name</th><th className="p-3">Date</th><th className="p-3">Time</th><th className="p-3">Guests</th><th className="p-3">Room</th><th className="p-3">Status</th><th className="p-3"></th></tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id} className="border-b border-zinc-800 hover:bg-zinc-900">
                                    <td className="p-3"><input value={b.customerName} onChange={(e) => handleUpdateBooking(b.id, 'customerName', e.target.value)} className="bg-transparent w-full outline-none" /></td>
                                    <td className="p-3"><input type="date" value={b.date} onChange={(e) => handleUpdateBooking(b.id, 'date', e.target.value)} className="bg-transparent w-full outline-none" /></td>
                                    <td className="p-3"><input type="time" value={b.time} onChange={(e) => handleUpdateBooking(b.id, 'time', e.target.value)} className="bg-transparent w-full outline-none" /></td>
                                    <td className="p-3"><input type="number" value={b.guests} onChange={(e) => handleUpdateBooking(b.id, 'guests', parseInt(e.target.value))} className="bg-transparent w-12 outline-none" /></td>
                                    <td className="p-3"><input value={b.room} onChange={(e) => handleUpdateBooking(b.id, 'room', e.target.value)} className="bg-transparent w-full outline-none" /></td>
                                    <td className="p-3">
                                        <select value={b.status} onChange={(e) => handleUpdateBooking(b.id, 'status', e.target.value)} className="bg-zinc-800 rounded p-1">
                                            <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-3 text-center"><button onClick={() => handleDeleteBooking(b.id)} className="text-red-500 font-bold">X</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>
        )}

        {/* Highlights */}
        {activeTab === 'highlights' && (
            <SectionCard title="Highlights Section" description="">
                <InputGroup label="Heading" value={highlightsData.heading} onChange={(v) => handleHighlightsChange('heading', v)} />
                <InputGroup label="Subtext" value={highlightsData.subtext} onChange={(v) => handleHighlightsChange('subtext', v)} type="textarea" />
                <div className="mb-4"><label className="block text-sm font-semibold text-gray-300 mb-2">Main Image</label><ImageField url={highlightsData.mainImageUrl} onUpdate={(v) => handleHighlightsChange('mainImageUrl', v)} /></div>
                <div className="mb-4"><label className="block text-sm font-semibold text-gray-300 mb-2">Side Image (Circle)</label><ImageField url={highlightsData.sideImageUrl} onUpdate={(v) => handleHighlightsChange('sideImageUrl', v)} /></div>
            </SectionCard>
        )}

        {/* Features */}
        {activeTab === 'features' && (
            <SectionCard title="Features Section" description="Manage the 'Experience' and 'Occasions' text.">
                <InputGroup label="Experience Heading" value={featuresData.experience.heading} onChange={(v) => updateFeaturesData({...featuresData, experience: {...featuresData.experience, heading: v}})} />
                <InputGroup label="Experience Text" value={featuresData.experience.text} onChange={(v) => updateFeaturesData({...featuresData, experience: {...featuresData.experience, text: v}})} type="textarea" />
                <div className="mb-4"><label className="block text-sm font-semibold text-gray-300 mb-2">Experience Image</label><ImageField url={featuresData.experience.image} onUpdate={(v) => updateFeaturesData({...featuresData, experience: {...featuresData.experience, image: v}})} /></div>
            </SectionCard>
        )}

        {/* Vibe */}
        {activeTab === 'vibe' && (
            <SectionCard title="The Vibe (Fitness/Atmosphere)" description="">
                <InputGroup label="Top Heading" value={vibeData.heading} onChange={(v) => updateVibeData({...vibeData, heading: v})} />
                <InputGroup label="Top Text" value={vibeData.text} onChange={(v) => updateVibeData({...vibeData, text: v})} type="textarea" />
                <div className="mb-4"><label className="block text-sm font-semibold text-gray-300 mb-2">Big Bottom Image</label><ImageField url={vibeData.bigImage} onUpdate={(v) => updateVibeData({...vibeData, bigImage: v})} /></div>
            </SectionCard>
        )}

        {/* Gallery */}
        {activeTab === 'gallery' && (
            <SectionCard title="Gallery Management" description="Add or remove images and videos from the gallery page.">
                <InputGroup label="Gallery Page Heading" value={galleryData.heading} onChange={(v) => updateGalleryData({ ...galleryData, heading: v })} />
                <InputGroup label="Gallery Page Subtext" value={galleryData.subtext} onChange={(v) => updateGalleryData({ ...galleryData, subtext: v })} type="textarea" />
                
                <div className="mt-8 border-t border-zinc-800 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-lg font-bold text-white">Images</label>
                        <div className="flex gap-2">
                            <MultiUploader onUploadComplete={handleBulkUploadComplete} useSupabase={true} />
                            <button onClick={handleAddGalleryImage} className="bg-green-600 px-3 py-1 rounded text-sm text-white hover:bg-green-500">+ Add Image</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {galleryData.images.map((img, i) => (
                            <div key={img.id} className="bg-zinc-950 p-2 rounded border border-zinc-800 relative group">
                                <div className="aspect-square bg-black mb-2 overflow-hidden rounded">
                                    <img src={img.url} className="w-full h-full object-cover" />
                                </div>
                                <input value={img.caption} onChange={(e) => {const newImgs = [...galleryData.images]; newImgs[i].caption = e.target.value; updateGalleryData({...galleryData, images: newImgs})}} className="w-full bg-transparent text-xs border-b border-zinc-700 outline-none pb-1" placeholder="Caption" />
                                <button onClick={() => handleDeleteGalleryImage(i)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 border-t border-zinc-800 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-lg font-bold text-white">Videos</label>
                        <button onClick={handleAddGalleryVideo} className="bg-green-600 px-3 py-1 rounded text-sm text-white hover:bg-green-500">+ Add Video</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(galleryData.videos || []).map((vid, i) => (
                            <div key={vid.id} className="bg-zinc-950 p-3 rounded border border-zinc-800 relative group">
                                <div className="mb-2"><label className="text-xs text-gray-500">Video URL</label><input value={vid.url} onChange={(e) => handleUpdateVideo(i, 'url', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" /></div>
                                <div className="mb-2"><label className="text-xs text-gray-500">Thumbnail URL</label><input value={vid.thumbnail} onChange={(e) => handleUpdateVideo(i, 'thumbnail', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" /></div>
                                <div className="mb-2"><label className="text-xs text-gray-500">Title</label><input value={vid.title} onChange={(e) => handleUpdateVideo(i, 'title', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" /></div>
                                <button onClick={() => handleDeleteGalleryVideo(i)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">X</button>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionCard>
        )}

        {/* Testimonials */}
        {activeTab === 'testimonials' && (
            <SectionCard title="Testimonials" description="Update customer reviews.">
                <InputGroup label="Heading" value={testimonialsData.heading} onChange={(v) => updateTestimonialsData({...testimonialsData, heading: v})} />
                <InputGroup label="Subtext" value={testimonialsData.subtext} onChange={(v) => updateTestimonialsData({...testimonialsData, subtext: v})} />
                <div className="mt-4 space-y-4">
                    {testimonialsData.items.map((item, i) => (
                        <div key={i} className="bg-zinc-950 p-4 rounded border border-zinc-800">
                            <div className="mb-2 font-bold text-sm text-gray-400">Review {i+1}</div>
                            <InputGroup label="Name" value={item.name} onChange={(v) => {const newItems = [...testimonialsData.items]; newItems[i].name = v; updateTestimonialsData({...testimonialsData, items: newItems})}} />
                            <InputGroup label="Quote" value={item.quote} onChange={(v) => {const newItems = [...testimonialsData.items]; newItems[i].quote = v; updateTestimonialsData({...testimonialsData, items: newItems})}} type="textarea" />
                        </div>
                    ))}
                </div>
            </SectionCard>
        )}

        {/* Food Menu */}
        {activeTab === 'food' && (
            <SectionCard title="Food Menu (JSON)" description="Edit the food menu structure directly. Be careful with syntax.">
                <textarea 
                    className="w-full h-96 bg-zinc-950 font-mono text-xs text-green-400 p-4 rounded border border-zinc-700"
                    value={JSON.stringify(foodMenu, null, 2)}
                    onChange={(e) => { try { updateFoodMenu(JSON.parse(e.target.value)); } catch(e) {} }}
                />
            </SectionCard>
        )}

        {/* Drinks Menu */}
        {activeTab === 'drinks' && (
            <SectionCard title="Drinks Menu (JSON)" description="Edit the drinks menu structure directly.">
                <textarea 
                    className="w-full h-96 bg-zinc-950 font-mono text-xs text-green-400 p-4 rounded border border-zinc-700"
                    value={JSON.stringify(drinksData, null, 2)}
                    onChange={(e) => { try { updateDrinksData(JSON.parse(e.target.value)); } catch(e) {} }}
                />
            </SectionCard>
        )}

        {/* Battery */}
        {activeTab === 'battery' && (
            <SectionCard title="Stats Section" description="">
                <InputGroup label="Stat Number (e.g. 80K+)" value={batteryData.statNumber} onChange={(v) => updateBatteryData({...batteryData, statNumber: v})} />
                <InputGroup label="Subtext" value={batteryData.subText} onChange={(v) => updateBatteryData({...batteryData, subText: v})} />
            </SectionCard>
        )}

        {/* Footer */}
        {activeTab === 'footer' && (
            <SectionCard title="Footer CTA" description="">
                <InputGroup label="CTA Heading" value={footerData.ctaHeading} onChange={(v) => updateFooterData({...footerData, ctaHeading: v})} />
                <InputGroup label="CTA Text" value={footerData.ctaText} onChange={(v) => updateFooterData({...footerData, ctaText: v})} />
                <InputGroup label="Button Text" value={footerData.ctaButtonText} onChange={(v) => updateFooterData({...footerData, ctaButtonText: v})} />
            </SectionCard>
        )}

        {/* Database */}
        {activeTab === 'database' && (
            <SectionCard title="Database & Backend Config" description="Configure connection settings for your hosting environment.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-yellow-400 mb-4">MySQL Settings (Optional)</h4>
                        <InputGroup label="Database Host" value={dbConfig.host} onChange={(v) => updateDbConfig({...dbConfig, host: v})} />
                        <InputGroup label="Database Name" value={dbConfig.name} onChange={(v) => updateDbConfig({...dbConfig, name: v})} />
                        <InputGroup label="Database User" value={dbConfig.user} onChange={(v) => updateDbConfig({...dbConfig, user: v})} />
                        <InputGroup label="Database Password" value={dbConfig.pass} onChange={(v) => updateDbConfig({...dbConfig, pass: v})} type="password" />
                        
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Upload Handler URL (PHP)</label>
                            <input value={dbConfig.uploadScriptUrl} onChange={(v) => updateDbConfig({...dbConfig, uploadScriptUrl: v.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white" placeholder="https://your-site.com/upload.php" />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-green-400 mb-4">Supabase Settings</h4>
                        <InputGroup label="Project URL" value={dbConfig.supabaseUrl || ''} onChange={(v) => updateDbConfig({...dbConfig, supabaseUrl: v})} />
                        <InputGroup label="Anon Key" value={dbConfig.supabaseKey || ''} onChange={(v) => updateDbConfig({...dbConfig, supabaseKey: v})} type="password" />
                        <InputGroup label="Storage Bucket Name" value={dbConfig.storageBucket || 'public'} onChange={(v) => updateDbConfig({...dbConfig, storageBucket: v})} />
                        <button onClick={handleTestSupabase} className="mt-4 bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm w-full">Test Connection</button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800">
                    <h4 className="font-bold text-blue-400 mb-4">S3 Compatibility Settings (Supabase)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputGroup label="Endpoint" value={dbConfig.s3Endpoint || ''} onChange={(v) => updateDbConfig({...dbConfig, s3Endpoint: v})} />
                        <InputGroup label="Access Key" value={dbConfig.s3AccessKey || ''} onChange={(v) => updateDbConfig({...dbConfig, s3AccessKey: v})} />
                        <InputGroup label="Secret Key" value={dbConfig.s3SecretKey || ''} onChange={(v) => updateDbConfig({...dbConfig, s3SecretKey: v})} type="password" />
                    </div>
                </div>
                
                <div className="mt-8 flex gap-4 border-t border-zinc-800 pt-6">
                    <button onClick={handleDownloadSQL} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-sm">Download SQL Setup</button>
                    <button onClick={handleDownloadUploadScript} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded text-sm">Download Upload Handler (PHP)</button>
                </div>
            </SectionCard>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
