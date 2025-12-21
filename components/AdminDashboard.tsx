
import React, { useState, useRef } from 'react';
import { useData, Song, Booking } from '../context/DataContext';

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
      value={value}
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
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const { 
    saveAllToSupabase, isDataLoading, dbConfig, updateDbConfig,
    songs, updateSongs, heroData, updateHeroData, footerData, updateFooterData
  } = useData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
  };

  const handleUpdateSong = (id: string, field: keyof Song, value: string) => {
    updateSongs(songs.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">LKC Admin</h2>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-zinc-800 p-3 rounded mb-4" placeholder="Password"/>
        <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded">Login</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">LKC Control Center</h2>
        <button 
            onClick={saveAllToSupabase} 
            disabled={isDataLoading}
            className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-full font-bold shadow-lg"
        >
            {isDataLoading ? 'Saving...' : 'SAVE ALL CHANGES'}
        </button>
      </div>

      <div className="flex bg-zinc-900 border-b border-zinc-800 overflow-x-auto">
        {['general', 'songs', 'database'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-8 py-4 capitalize font-bold ${activeTab === t ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500'}`}>{t}</button>
        ))}
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        {activeTab === 'general' && (
            <>
                <SectionCard title="Hero Content">
                    <InputGroup label="Heading" value={heroData.headingText} onChange={v => updateHeroData({...heroData, headingText: v})} />
                    <InputGroup label="Subtitle" value={heroData.subText} onChange={v => updateHeroData({...heroData, subText: v})} />
                </SectionCard>
                <SectionCard title="Footer CTA">
                    <InputGroup label="Heading" value={footerData.ctaHeading} onChange={v => updateFooterData({...footerData, ctaHeading: v})} />
                </SectionCard>
            </>
        )}

        {activeTab === 'songs' && (
            <SectionCard title="Song Library">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b border-zinc-800 text-gray-400"><th className="pb-2">Title</th><th className="pb-2">Artist</th><th className="pb-2">Audio</th></tr></thead>
                    <tbody>{songs.map(s => (
                        <tr key={s.id} className="border-b border-zinc-800/50">
                            <td className="py-2"><input value={s.title} onChange={e => handleUpdateSong(s.id, 'title', e.target.value)} className="bg-transparent w-full"/></td>
                            <td className="py-2"><input value={s.artist} onChange={e => handleUpdateSong(s.id, 'artist', e.target.value)} className="bg-transparent w-full"/></td>
                            <td className="py-2">
                                <div className="flex items-center gap-2">
                                    <input value={s.fileUrl || ''} onChange={e => handleUpdateSong(s.id, 'fileUrl', e.target.value)} className="bg-transparent text-xs w-24 truncate" placeholder="No file"/>
                                    <ImageUploader onUpload={url => handleUpdateSong(s.id, 'fileUrl', url)} label="Up" />
                                </div>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </SectionCard>
        )}

        {activeTab === 'database' && (
            <SectionCard title="Supabase Integration">
                <InputGroup label="Supabase URL" value={dbConfig.supabaseUrl} onChange={v => updateDbConfig({...dbConfig, supabaseUrl: v})} />
                <InputGroup label="Supabase Service Role/Anon Key" value={dbConfig.supabaseKey} onChange={v => updateDbConfig({...dbConfig, supabaseKey: v})} type="password" />
                <InputGroup label="Storage Bucket Name" value={dbConfig.storageBucket} onChange={v => updateDbConfig({...dbConfig, storageBucket: v})} />
                <p className="text-xs text-gray-500 mt-4 italic">
                    Note: For data persistence, create a table named 'site_settings' with an 'id' (int4) and 'content' (jsonb) column.
                </p>
            </SectionCard>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
