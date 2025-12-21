
import React, { useState, useRef } from 'react';
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
    const { uploadToSupabase } = useData();
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const url = await uploadToSupabase(file, `uploads/${Date.now()}_${file.name}`);
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
    adminPassword, updateAdminPassword, exportDatabase, importDatabase
  } = useData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      setLoginError(false);
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

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <form 
        onSubmit={handleLogin} 
        className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">LKC Admin</h2>
        
        {loginError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-4 text-sm text-center">
            Incorrect password. Please try again.
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Admin Password</label>
          <input 
            type="password" 
            value={passwordInput} 
            autoFocus
            onChange={e => setPasswordInput(e.target.value)} 
            className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg outline-none focus:border-yellow-400 text-white" 
            placeholder="••••••••"
          />
        </div>
        
        <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors mb-4">
          Login to Dashboard
        </button>
        
        <button 
          type="button"
          onClick={() => window.location.href = '/'}
          className="w-full text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors"
        >
          &larr; Back to Website
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = '/'} className="text-zinc-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h2 className="text-xl font-bold">LKC Control Center</h2>
        </div>
        <button 
            onClick={saveAllToSupabase} 
            disabled={isDataLoading}
            className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-full font-bold shadow-lg transition-all"
        >
            {isDataLoading ? 'Saving...' : 'SAVE TO CLOUD'}
        </button>
      </div>

      <div className="flex bg-zinc-900 border-b border-zinc-800 overflow-x-auto scrollbar-hide">
        {['general', 'vibe', 'reviews', 'songs', 'food', 'database'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-8 py-4 capitalize font-bold transition-colors whitespace-nowrap ${activeTab === t ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}>{t}</button>
        ))}
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        {activeTab === 'general' && (
            <>
                <SectionCard title="Hero Content">
                    <InputGroup label="Main Heading" value={heroData.headingText} onChange={v => updateHeroData({...heroData, headingText: v})} />
                    <InputGroup label="Sub-text" value={heroData.subText} onChange={v => updateHeroData({...heroData, subText: v})} />
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Hero Image</label>
                        <ImageUploader onUpload={url => updateHeroData({...heroData, backgroundImageUrl: url})} label="Upload Hero Image" />
                    </div>
                </SectionCard>
                <SectionCard title="Footer">
                    <InputGroup label="CTA Heading" value={footerData.ctaHeading} onChange={v => updateFooterData({...footerData, ctaHeading: v})} />
                </SectionCard>
            </>
        )}

        {activeTab === 'vibe' && (
            <SectionCard title="Vibe Section Settings">
                <InputGroup label="Label" value={vibeData?.label} onChange={v => updateVibeData({...vibeData, label: v})} />
                <InputGroup label="Heading" value={vibeData?.heading} onChange={v => updateVibeData({...vibeData, heading: v})} />
                <InputGroup label="Description" value={vibeData?.text} onChange={v => updateVibeData({...vibeData, text: v})} />
                <InputGroup label="Bottom Heading" value={vibeData?.bottomHeading} onChange={v => updateVibeData({...vibeData, bottomHeading: v})} />
                <InputGroup label="Bottom Text" value={vibeData?.bottomText} onChange={v => updateVibeData({...vibeData, bottomText: v})} />
                <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Main Background Image</label>
                    <ImageUploader onUpload={url => updateVibeData({...vibeData, bigImage: url})} label="Upload Big Image" />
                </div>
            </SectionCard>
        )}

        {activeTab === 'reviews' && (
            <SectionCard title="Testimonials Settings">
                <InputGroup label="Heading" value={testimonialsData?.heading} onChange={v => updateTestimonialsData({...testimonialsData, heading: v})} />
                <InputGroup label="Sub-text" value={testimonialsData?.subtext} onChange={v => updateTestimonialsData({...testimonialsData, subtext: v})} />
                
                <h4 className="font-bold text-gray-400 mt-8 mb-4">Manage Reviews</h4>
                <div className="space-y-6">
                    {testimonialsData?.items?.map((review, idx) => (
                        <div key={idx} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
                             <div className="grid md:grid-cols-2 gap-4">
                                <InputGroup label="Author Name" value={review.name} onChange={v => {
                                    const newItems = [...testimonialsData.items];
                                    newItems[idx].name = v;
                                    updateTestimonialsData({...testimonialsData, items: newItems});
                                }} />
                                <InputGroup label="Date Text" value={review.date} onChange={v => {
                                    const newItems = [...testimonialsData.items];
                                    newItems[idx].date = v;
                                    updateTestimonialsData({...testimonialsData, items: newItems});
                                }} />
                             </div>
                             <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Quote</label>
                                <textarea 
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-400 text-sm"
                                    value={review.quote}
                                    onChange={e => {
                                        const newItems = [...testimonialsData.items];
                                        newItems[idx].quote = e.target.value;
                                        updateTestimonialsData({...testimonialsData, items: newItems});
                                    }}
                                />
                             </div>
                             <button 
                                onClick={() => {
                                    const newItems = testimonialsData.items.filter((_, i) => i !== idx);
                                    updateTestimonialsData({...testimonialsData, items: newItems});
                                }}
                                className="text-red-500 text-xs font-bold hover:underline"
                             >
                                Remove Review
                             </button>
                        </div>
                    ))}
                    <button 
                        onClick={() => {
                            const newItems = [...(testimonialsData?.items || []), { name: "New User", quote: "Great experience!", avatar: "", rating: 5, date: "Just now" }];
                            updateTestimonialsData({...testimonialsData, items: newItems});
                        }}
                        className="w-full py-2 border-2 border-dashed border-zinc-700 rounded-xl text-gray-500 hover:border-yellow-400 hover:text-yellow-400 transition-all text-sm font-bold"
                    >
                        + Add New Review
                    </button>
                </div>
            </SectionCard>
        )}

        {activeTab === 'songs' && (
            <SectionCard title="Song Library">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b border-zinc-800 text-gray-400"><th className="pb-2">Title</th><th className="pb-2">Artist</th><th className="pb-2">Action</th></tr></thead>
                    <tbody>{songs.map(s => (
                        <tr key={s.id} className="border-b border-zinc-800/50">
                            <td className="py-2"><input value={s.title} onChange={e => updateSongs(songs.map(x => x.id === s.id ? {...x, title: e.target.value} : x))} className="bg-transparent w-full outline-none focus:text-yellow-400"/></td>
                            <td className="py-2"><input value={s.artist} onChange={e => updateSongs(songs.map(x => x.id === s.id ? {...x, artist: e.target.value} : x))} className="bg-transparent w-full outline-none focus:text-yellow-400"/></td>
                            <td className="py-2"><ImageUploader onUpload={url => updateSongs(songs.map(x => x.id === s.id ? {...x, fileUrl: url} : x))} label="Upload MP3" /></td>
                        </tr>
                    ))}</tbody>
                </table>
            </SectionCard>
        )}

        {activeTab === 'database' && (
            <div className="space-y-8">
                <SectionCard title="Site Security">
                    <InputGroup label="Admin Password" value={adminPassword} onChange={v => updateAdminPassword(v)} type="text" />
                    <p className="text-xs text-gray-500 mt-2">This is the password used to log into this dashboard.</p>
                </SectionCard>

                <SectionCard title="Local Database Backup">
                    <p className="text-sm text-gray-400 mb-6">Download your entire site configuration as a JSON file to keep a local backup, or upload a previously saved file to restore your site.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={handleExportDB}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-lg flex-1 transition-all flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export Database (.json)
                        </button>
                        <div className="flex-1 relative">
                            <input 
                                type="file" 
                                accept=".json" 
                                onChange={handleImportDB}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <button 
                                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-lg w-full transition-all flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Import Database (.json)
                            </button>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Cloud Sync (Supabase)">
                    <InputGroup label="Project URL" value={config.url} onChange={v => updateConfig({...config, url: v})} />
                    <InputGroup label="Anon / Public Key" value={config.anonKey} onChange={v => updateConfig({...config, anonKey: v})} type="password" />
                    <InputGroup label="Storage Bucket Name" value={config.bucket} onChange={v => updateConfig({...config, bucket: v})} />
                </SectionCard>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
