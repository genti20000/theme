import React, { useState, useRef, useEffect } from 'react';
import { useData, MenuItem, Song, Booking, GalleryItem, VideoItem } from '../context/DataContext';

interface AdminDashboardProps {}

// --- Reusable Components ---

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

const JsonEditor: React.FC<{ data: any; onSave: (newData: any) => void; label: string }> = ({ data, onSave, label }) => {
    const [jsonStr, setJsonStr] = useState(JSON.stringify(data, null, 2));
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        setJsonStr(JSON.stringify(data, null, 2));
    }, [data]);

    const handleChange = (val: string) => {
        setJsonStr(val);
        try {
            JSON.parse(val);
            setIsValid(true);
        } catch (e) {
            setIsValid(false);
        }
    };

    const handleApply = () => {
        try {
            const parsed = JSON.parse(jsonStr);
            onSave(parsed);
            alert('Data structure updated!');
        } catch (e) {
            alert('Invalid JSON');
        }
    };

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-300">{label} (Advanced Editor)</label>
                <button 
                    onClick={handleApply} 
                    disabled={!isValid}
                    className={`text-xs px-3 py-1 rounded ${isValid ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-red-900 text-red-200 cursor-not-allowed'}`}
                >
                    Apply Changes
                </button>
            </div>
            <textarea 
                className={`w-full bg-zinc-950 border ${isValid ? 'border-zinc-700' : 'border-red-500'} rounded-lg px-4 py-3 text-xs font-mono text-green-400 focus:outline-none h-64`}
                value={jsonStr}
                onChange={(e) => handleChange(e.target.value)}
            />
            {!isValid && <p className="text-red-500 text-xs mt-1">Invalid JSON format</p>}
        </div>
    );
};

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
            try {
                const bucket = dbConfig.storageBucket || 'iii';
                const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const path = `uploads/${Date.now()}_${cleanName}`;
                
                const url = await uploadToSupabase(file, path, bucket);
                if (url) {
                    onUpload(url);
                } else {
                    alert("Upload failed. Check console.");
                }
            } catch (e) {
                console.error("Upload error", e);
            } finally {
                setUploading(false);
            }
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
                        ...
                    </>
                ) : (
                    <>
                       {label}
                    </>
                )}
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,video/*,audio/*"
                multiple={multiple}
            />
        </div>
    );
};

const ImageField: React.FC<{ url: string; onUpdate: (url: string) => void }> = ({ url, onUpdate }) => {
    return (
        <div className="flex gap-4 items-start bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/50">
            <div className="w-16 h-16 bg-black rounded overflow-hidden flex-shrink-0 border border-zinc-700">
                {url && url.match(/\.(mp4|webm|mov)$/i) ? (
                    <video src={url} className="w-full h-full object-cover" muted />
                ) : (
                    <img src={url} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                )}
            </div>
            <div className="flex-1 space-y-2">
                <input 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-xs text-gray-300 focus:border-yellow-400 outline-none"
                    value={url}
                    onChange={(e) => onUpdate(e.target.value)}
                    placeholder="https://..."
                />
                <div className="flex justify-end items-center mt-2">
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
    updateFoodMenu, updateDrinksData, updateHeaderData, updateHeroData,
    updateHighlightsData, updateFeaturesData, updateVibeData, updateTestimonialsData,
    updateBatteryData, updateFooterData, updateGalleryData, updateEventsData, updateDbConfig,
    updateSongs, updateBookings, updateBlogs, updateTheme,
    foodMenu, drinksData, headerData, heroData, highlightsData, featuresData,
    vibeData, testimonialsData, batteryData, footerData, galleryData, eventsData,
    dbConfig, songs, bookings, blogs, theme,
    saveAllToSupabase
  } = useData();
  const [activeTab, setActiveTab] = useState<string>('header');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [bulkSongsText, setBulkSongsText] = useState('');

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
      if (confirm("Flush cache?")) {
          localStorage.clear();
          window.location.reload();
      }
  };

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

  // Helper Wrappers
  const handleHeroChange = (field: string, value: any) => { updateHeroData({ ...heroData, [field]: value }); };
  const handleHighlightsChange = (field: string, value: any) => { updateHighlightsData({ ...highlightsData, [field]: value }); };
  const handleVibeChange = (field: string, value: any) => { updateVibeData({ ...vibeData, [field]: value }); };
  const handleBatteryChange = (field: string, value: any) => { updateBatteryData({ ...batteryData, [field]: value }); };
  const handleFooterChange = (field: string, value: any) => { updateFooterData({ ...footerData, [field]: value }); };

  
  if (!isAuthenticated) return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div><label className="block text-gray-400 text-sm mb-2">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg" placeholder="Enter admin password"/></div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg">Login</button>
          </form>
           <div className="mt-6 text-center text-zinc-600 text-xs">Hint: admin123</div>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-yellow-400">LKC Backend (S3)</h2>
          <div className="flex gap-4 items-center">
             <button onClick={handleSave} disabled={saveStatus === 'saving'} className={`text-sm font-bold py-2 px-6 rounded-full transition-all flex items-center gap-2 shadow-md ${saveStatus === 'saved' ? 'bg-green-500 text-white cursor-default' : 'bg-yellow-400 hover:bg-yellow-500 text-black hover:scale-105'}`}>
                {saveStatus === 'saving' ? 'Syncing to S3...' : saveStatus === 'saved' ? 'Synced!' : 'Save All Changes'}
             </button>
             <button onClick={handleFlushCache} className="text-xs text-orange-400 hover:text-orange-300 underline">Flush Cache</button>
            <button onClick={() => setIsAuthenticated(false)} className="text-sm text-gray-400 hover:text-white">Logout</button>
          </div>
        </div>
        <div className="container mx-auto px-6 flex gap-6 text-sm font-semibold overflow-x-auto no-scrollbar pb-0">
             {['header', 'hero', 'menu', 'drinks', 'songs', 'highlights', 'features', 'vibe', 'testimonials', 'battery', 'footer', 'events', 'gallery', 'database'].map((tab) => (
                 <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 border-b-2 transition-colors whitespace-nowrap capitalize ${activeTab === tab ? 'border-yellow-400 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>{tab}</button>
             ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header Settings */}
        {activeTab === 'header' && <SectionCard title="Header Settings" description=""><ImageField url={headerData.logoUrl} onUpdate={(v) => updateHeaderData({...headerData, logoUrl: v})} /></SectionCard>}
        
        {/* Hero Settings */}
        {activeTab === 'hero' && (
            <SectionCard title="Homepage Hero" description="">
                 <InputGroup label="Badge Text" value={heroData.badgeText} onChange={(v) => handleHeroChange('badgeText', v)} />
                 <InputGroup label="Main Heading" value={heroData.headingText} onChange={(v) => handleHeroChange('headingText', v)} />
                 <InputGroup label="Sub Text" value={heroData.subText} onChange={(v) => handleHeroChange('subText', v)} />
                 <InputGroup label="Button Text" value={heroData.buttonText} onChange={(v) => handleHeroChange('buttonText', v)} />
                 <div className="border-t border-zinc-800 pt-6 mt-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-4">Slideshow</label>
                    <div className="space-y-2 mb-4">
                        {(heroData.slides || [heroData.backgroundImageUrl]).map((slide, i) => (
                            <div key={i} className="flex gap-2 items-center bg-zinc-950 p-2 rounded"><span className="text-gray-500 w-4">{i+1}</span><div className="flex-1"><ImageField url={slide} onUpdate={(v) => { const newSlides = [...heroData.slides]; newSlides[i] = v; handleHeroChange('slides', newSlides); }} /></div></div>
                        ))}
                    </div>
                 </div>
            </SectionCard>
        )}

        {/* Menu (Food) Settings */}
        {activeTab === 'menu' && (
            <SectionCard title="Food Menu" description="Edit food categories and items.">
                <JsonEditor data={foodMenu} onSave={updateFoodMenu} label="Food Menu JSON" />
            </SectionCard>
        )}

        {/* Drinks Settings */}
        {activeTab === 'drinks' && (
            <SectionCard title="Drinks Menu" description="Edit drinks, packages, and bottle service.">
                <div className="mb-6"><label className="block text-sm font-semibold text-gray-300 mb-2">Header Image</label><ImageField url={drinksData.headerImageUrl || ''} onUpdate={(v) => updateDrinksData({...drinksData, headerImageUrl: v})} /></div>
                <JsonEditor data={drinksData} onSave={updateDrinksData} label="Drinks Data JSON" />
            </SectionCard>
        )}

        {/* Highlights Settings */}
        {activeTab === 'highlights' && (
            <SectionCard title="Highlights Section" description="">
                <InputGroup label="Heading" value={highlightsData.heading} onChange={(v) => handleHighlightsChange('heading', v)} />
                <InputGroup label="Subtext" value={highlightsData.subtext} onChange={(v) => handleHighlightsChange('subtext', v)} />
                <div className="mb-4"><label className="block text-sm font-semibold text-gray-300 mb-2">Main Image</label><ImageField url={highlightsData.mainImageUrl} onUpdate={(v) => handleHighlightsChange('mainImageUrl', v)} /></div>
                <div className="mb-4"><label className="block text-sm font-semibold text-gray-300 mb-2">Side Image</label><ImageField url={highlightsData.sideImageUrl} onUpdate={(v) => handleHighlightsChange('sideImageUrl', v)} /></div>
                <JsonEditor data={highlightsData.featureList} onSave={(v) => handleHighlightsChange('featureList', v)} label="Feature List" />
            </SectionCard>
        )}

        {/* Features Settings */}
        {activeTab === 'features' && (
            <SectionCard title="Features Section" description="Experience, Occasions, and Grid.">
                <JsonEditor data={featuresData} onSave={updateFeaturesData} label="Features Data JSON" />
            </SectionCard>
        )}

        {/* Vibe Settings */}
        {activeTab === 'vibe' && (
            <SectionCard title="The Vibe (Fitness)" description="">
                <InputGroup label="Heading" value={vibeData.heading} onChange={(v) => handleVibeChange('heading', v)} />
                <InputGroup label="Text" value={vibeData.text} onChange={(v) => handleVibeChange('text', v)} type="textarea" />
                <div className="mb-4"><label className="block text-sm font-semibold text-gray-300 mb-2">Video URL</label><ImageField url={vibeData.videoUrl || ''} onUpdate={(v) => handleVibeChange('videoUrl', v)} /></div>
                <div className="mb-4"><label className="block text-sm font-semibold text-gray-300 mb-2">Big Bottom Image</label><ImageField url={vibeData.bigImage} onUpdate={(v) => handleVibeChange('bigImage', v)} /></div>
                <InputGroup label="Bottom Heading" value={vibeData.bottomHeading} onChange={(v) => handleVibeChange('bottomHeading', v)} />
                <InputGroup label="Bottom Text" value={vibeData.bottomText} onChange={(v) => handleVibeChange('bottomText', v)} type="textarea" />
            </SectionCard>
        )}

        {/* Testimonials Settings */}
        {activeTab === 'testimonials' && (
            <SectionCard title="Testimonials" description="Manage reviews.">
                <InputGroup label="Heading" value={testimonialsData.heading} onChange={(v) => updateTestimonialsData({...testimonialsData, heading: v})} />
                <InputGroup label="Subtext" value={testimonialsData.subtext} onChange={(v) => updateTestimonialsData({...testimonialsData, subtext: v})} />
                <JsonEditor data={testimonialsData.items} onSave={(v) => updateTestimonialsData({...testimonialsData, items: v})} label="Reviews JSON" />
            </SectionCard>
        )}

        {/* Battery Settings */}
        {activeTab === 'battery' && (
            <SectionCard title="Stats Section" description="">
                <InputGroup label="Stat Number" value={batteryData.statNumber} onChange={(v) => handleBatteryChange('statNumber', v)} />
                <InputGroup label="Prefix" value={batteryData.statPrefix} onChange={(v) => handleBatteryChange('statPrefix', v)} />
                <InputGroup label="Suffix" value={batteryData.statSuffix} onChange={(v) => handleBatteryChange('statSuffix', v)} />
                <InputGroup label="Subtext" value={batteryData.subText} onChange={(v) => handleBatteryChange('subText', v)} />
            </SectionCard>
        )}

        {/* Footer Settings */}
        {activeTab === 'footer' && (
            <SectionCard title="Footer CTA" description="">
                <InputGroup label="Heading" value={footerData.ctaHeading} onChange={(v) => handleFooterChange('ctaHeading', v)} />
                <InputGroup label="Text" value={footerData.ctaText} onChange={(v) => handleFooterChange('ctaText', v)} type="textarea" />
                <InputGroup label="Button Text" value={footerData.ctaButtonText} onChange={(v) => handleFooterChange('ctaButtonText', v)} />
            </SectionCard>
        )}

        {/* Song Library */}
        {activeTab === 'songs' && (
            <SectionCard title="Song Library" description="Manage the song database.">
                <div className="mb-6 border-b border-zinc-800 pb-6">
                    <h4 className="text-sm font-bold text-white mb-2">Bulk Import</h4>
                    <textarea value={bulkSongsText} onChange={(e) => setBulkSongsText(e.target.value)} placeholder={`Title, Artist, Genre`} className="w-full h-24 bg-zinc-950 border border-zinc-700 rounded p-2 text-xs text-gray-300 mb-2"/>
                    <button onClick={handleBulkImportSongs} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-xs font-bold">Import</button>
                </div>
                <div className="flex justify-between items-center mb-4"><h4 className="text-sm font-bold text-white">Song List</h4><button onClick={handleAddSong} className="bg-green-600 px-3 py-1 rounded text-xs text-white">+ Add</button></div>
                <div className="max-h-96 overflow-y-auto border border-zinc-800 rounded bg-zinc-950">
                    <table className="w-full text-xs text-left text-gray-400">
                        <thead className="bg-zinc-900 text-gray-200 sticky top-0"><tr><th className="px-4 py-2">Title</th><th className="px-4 py-2">Artist</th><th className="px-4 py-2">Audio File</th><th className="px-4 py-2 w-10"></th></tr></thead>
                        <tbody>{songs.map(s => (
                            <tr key={s.id} className="border-b border-zinc-800 hover:bg-zinc-900">
                                <td className="px-4 py-2"><input value={s.title} onChange={(e) => handleUpdateSong(s.id, 'title', e.target.value)} className="bg-transparent w-full outline-none"/></td>
                                <td className="px-4 py-2"><input value={s.artist} onChange={(e) => handleUpdateSong(s.id, 'artist', e.target.value)} className="bg-transparent w-full outline-none"/></td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-2 items-center">
                                        <input value={s.fileUrl || ''} onChange={(e) => handleUpdateSong(s.id, 'fileUrl', e.target.value)} className="bg-transparent w-full outline-none text-blue-400 placeholder-zinc-600" placeholder="https://..." />
                                        <ImageUploader onUpload={(url) => handleUpdateSong(s.id, 'fileUrl', url)} label="Up" />
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-center"><button onClick={() => handleDeleteSong(s.id)} className="text-red-500 font-bold">X</button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            </SectionCard>
        )}

        {/* Database (S3 Only) */}
        {activeTab === 'database' && (
            <SectionCard title="S3 Configuration" description="Configure your S3-compatible storage (Supabase S3) for data persistence.">
                <div className="grid grid-cols-1 gap-6">
                    <InputGroup label="Endpoint" value={dbConfig.s3Endpoint || ''} onChange={(v) => updateDbConfig({...dbConfig, s3Endpoint: v})} />
                    <InputGroup label="Access Key" value={dbConfig.s3AccessKey || ''} onChange={(v) => updateDbConfig({...dbConfig, s3AccessKey: v})} />
                    <InputGroup label="Secret Key" value={dbConfig.s3SecretKey || ''} onChange={(v) => updateDbConfig({...dbConfig, s3SecretKey: v})} type="password" />
                    <InputGroup label="Bucket Name" value={dbConfig.storageBucket || 'iii'} onChange={(v) => updateDbConfig({...dbConfig, storageBucket: v})} />
                </div>
                <div className="mt-4 text-xs text-gray-500">
                    All CMS data is saved to <code>cms_data.json</code> in this bucket when you click "Save All Changes".
                </div>
            </SectionCard>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;