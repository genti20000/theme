import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 shadow-sm">
    <h3 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-2 flex items-center gap-2 uppercase tracking-tighter">
        <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
        {title}
    </h3>
    {children}
  </div>
);

const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string }> = ({ label, value, onChange, type = 'text' }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</label>
    <input type={type} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-pink-500 transition-colors" value={value || ''} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</label>
    <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none focus:border-pink-500 transition-colors" value={value || ''} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const ImageUploader: React.FC<{ onUpload: (url: string) => void; label?: string }> = ({ onUpload, label = "Upload New" }) => {
    const { uploadFile } = useData();
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        const url = await uploadFile(files[0]);
        if (url) onUpload(url);
        setUploading(false);
    };

    return (
        <div className="mt-2">
            <button onClick={() => fileRef.current?.click()} className="bg-zinc-700 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded text-white hover:bg-zinc-600 transition-colors">
                {uploading ? '...' : label}
            </button>
            <input type="file" ref={fileRef} className="hidden" onChange={handleUpload} />
        </div>
    );
};

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [tab, setTab] = useState('seo');
  const { 
    isDataLoading, headerData, updateHeaderData, heroData, updateHeroData, highlightsData, updateHighlightsData,
    featuresData, updateFeaturesData, vibeData, updateVibeData, batteryData, updateBatteryData, 
    testimonialsData, updateTestimonialsData, infoSectionData, updateInfoSectionData, faqData, updateFaqData,
    galleryData, updateGalleryData, blogData, updateBlogData, songs, updateSongs, 
    foodMenu, updateFoodMenu, drinksData, updateDrinksData, adminPassword, syncUrl, updateSyncUrl,
    firebaseConfig, updateFirebaseConfig, saveToHostinger, saveToFirebase, uploadFile, purgeCache
  } = useData();

  const phpCode = `<?php
/**
 * LKC DATABASE BACKEND v4.2
 * Connecting to: u973281047_content_db
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$dbHost = 'localhost';
$dbName = 'u973281047_content_db';
$dbUser = 'u973281047_content_user';
$dbPass = 'YOUR_DB_PASS';
$authPass = '${adminPassword}';

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8", $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("CREATE TABLE IF NOT EXISTS site_settings (id INT PRIMARY KEY DEFAULT 1, content LONGTEXT, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB Error']); exit;
}

$headers = getallheaders();
$auth = $headers['Authorization'] ?? '';
if ($auth !== "Bearer " . $authPass) {
    http_response_code(401); echo json_encode(['success' => false, 'message' => 'Unauthorized']); exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        $target = 'uploads/' . time() . '_' . $_FILES['file']['name'];
        if (move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
            echo json_encode(['success' => true, 'url' => "https://londonkaraoke.club/$target"]);
        }
    } else {
        $input = file_get_contents('php://input');
        $stmt = $pdo->prepare("INSERT INTO site_settings (id, content) VALUES (1, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)");
        if ($stmt->execute([$input])) {
            // Trigger Git Push hook if applicable
            // exec("git add . && git commit -m 'CMS Update' && git push");
            echo json_encode(['success' => true]);
        }
    }
} else {
    $stmt = $pdo->query("SELECT content FROM site_settings WHERE id = 1");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo $row ? $row['content'] : json_encode(['error' => 'No data']);
}
?>`;

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-6 text-center uppercase tracking-tighter">LKC <span className="text-pink-500">CMS</span></h2>
        <input type="password" value={passInput} onChange={e => setPassInput(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl outline-none focus:border-pink-500 text-white mb-4" placeholder="••••••••" />
        <button onClick={() => passInput === adminPassword ? setIsAuthenticated(true) : alert("Wrong")} className="w-full bg-pink-600 text-white font-black py-4 rounded-xl hover:bg-pink-500 transition-all uppercase tracking-widest text-xs">Access Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20 font-sans">
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50 p-4 flex justify-between items-center px-8">
        <h2 className="text-xl font-black uppercase tracking-tighter">LKC <span className="text-pink-500">Admin</span></h2>
        <div className="flex gap-4">
            <button onClick={saveToFirebase} disabled={isDataLoading} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Firebase Sync</button>
            <button onClick={saveToHostinger} disabled={isDataLoading} className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-widest animate-pulse shadow-lg">
                {isDataLoading ? 'Syncing...' : 'Save & Deploy'}
            </button>
        </div>
      </div>

      <div className="flex bg-zinc-900 border-b border-zinc-800 overflow-x-auto scrollbar-hide px-4">
        {['seo', 'hero', 'about', 'features', 'vibe', 'stats', 'reviews', 'faq', 'info', 'blog', 'songs', 'config'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-4 uppercase font-black text-[10px] tracking-widest transition-all ${tab === t ? 'text-pink-500 border-b-2 border-pink-500 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}>
                {t}
            </button>
        ))}
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        {tab === 'seo' && (
            <SectionCard title="Global SEO & Branding">
                <Input label="Site Title (Browser Tab)" value={headerData.siteTitle} onChange={v => updateHeaderData({...headerData, siteTitle: v})} />
                <TextArea label="Meta Description" value={headerData.siteDescription} onChange={v => updateHeaderData({...headerData, siteDescription: v})} />
                <Input label="Logo URL" value={headerData.logoUrl} onChange={v => updateHeaderData({...headerData, logoUrl: v})} />
                <ImageUploader onUpload={v => updateHeaderData({...headerData, logoUrl: v})} label="Upload New Logo" />
            </SectionCard>
        )}

        {tab === 'hero' && (
            <SectionCard title="Hero & Slides">
                <Input label="Festive Badge Text" value={heroData.badgeText} onChange={v => updateHeroData({...heroData, badgeText: v})} />
                <Input label="Main Heading" value={heroData.headingText} onChange={v => updateHeroData({...heroData, headingText: v})} />
                <TextArea label="Subheading" value={heroData.subText} onChange={v => updateHeroData({...heroData, subText: v})} />
                <Input label="CTA Button Text" value={heroData.buttonText} onChange={v => updateHeroData({...heroData, buttonText: v})} />
                <div className="space-y-4 mt-6">
                    <label className="text-[10px] font-black text-gray-500">SLIDE MEDIA (URLs)</label>
                    {heroData.slides.map((s, i) => (
                        <div key={i} className="flex gap-2">
                            <input className="flex-1 bg-zinc-800 border border-zinc-700 p-2 rounded text-xs" value={s} onChange={e => {
                                const next = [...heroData.slides]; next[i] = e.target.value; updateHeroData({...heroData, slides: next});
                            }} />
                            <button onClick={() => updateHeroData({...heroData, slides: heroData.slides.filter((_, idx) => idx !== i)})} className="text-red-500">×</button>
                        </div>
                    ))}
                    <button onClick={() => updateHeroData({...heroData, slides: [...heroData.slides, '']})} className="w-full py-2 border-2 border-dashed border-zinc-800 text-xs text-gray-500">+ ADD SLIDE</button>
                    <ImageUploader onUpload={v => updateHeroData({...heroData, slides: [...heroData.slides, v]})} label="Upload New Slide" />
                </div>
            </SectionCard>
        )}

        {tab === 'about' && (
            <SectionCard title="Highlights Section">
                <Input label="Heading" value={highlightsData.heading} onChange={v => updateHighlightsData({...highlightsData, heading: v})} />
                <TextArea label="Subtext" value={highlightsData.subtext} onChange={v => updateHighlightsData({...highlightsData, subtext: v})} />
                <Input label="Main Image URL" value={highlightsData.mainImageUrl} onChange={v => updateHighlightsData({...highlightsData, mainImageUrl: v})} />
                <ImageUploader onUpload={v => updateHighlightsData({...highlightsData, mainImageUrl: v})} label="Upload Main Image" />
                <Input label="Feature List Title" value={highlightsData.featureListTitle} onChange={v => updateHighlightsData({...highlightsData, featureListTitle: v})} />
                <div className="mt-4">
                    <label className="text-[10px] font-black text-gray-500">FEATURES</label>
                    {highlightsData.featureList.map((f, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <input className="flex-1 bg-zinc-800 border border-zinc-700 p-2 rounded text-xs" value={f} onChange={e => {
                                const next = [...highlightsData.featureList]; next[i] = e.target.value; updateHighlightsData({...highlightsData, featureList: next});
                            }} />
                            <button onClick={() => updateHighlightsData({...highlightsData, featureList: highlightsData.featureList.filter((_, idx) => idx !== i)})} className="text-red-500">×</button>
                        </div>
                    ))}
                    <button onClick={() => updateHighlightsData({...highlightsData, featureList: [...highlightsData.featureList, '']})} className="w-full py-2 border border-zinc-800 text-xs">+ ADD FEATURE</button>
                </div>
                <div className="mt-6">
                    <Input label="Side Image URL" value={highlightsData.sideImageUrl} onChange={v => updateHighlightsData({...highlightsData, sideImageUrl: v})} />
                    <ImageUploader onUpload={v => updateHighlightsData({...highlightsData, sideImageUrl: v})} label="Upload Side Image" />
                </div>
            </SectionCard>
        )}

        {tab === 'features' && (
            <>
                <SectionCard title="Experience Header">
                    <Input label="Label (e.g. THE STAGE)" value={featuresData.experience.label} onChange={v => updateFeaturesData({...featuresData, experience: {...featuresData.experience, label: v}})} />
                    <Input label="Heading" value={featuresData.experience.heading} onChange={v => updateFeaturesData({...featuresData, experience: {...featuresData.experience, heading: v}})} />
                    <TextArea label="Description" value={featuresData.experience.text} onChange={v => updateFeaturesData({...featuresData, experience: {...featuresData.experience, text: v}})} />
                    <Input label="Image URL" value={featuresData.experience.image} onChange={v => updateFeaturesData({...featuresData, experience: {...featuresData.experience, image: v}})} />
                    <ImageUploader onUpload={v => updateFeaturesData({...featuresData, experience: {...featuresData.experience, image: v}})} label="Upload Header Image" />
                </SectionCard>
                <SectionCard title="Occasions & Grid">
                    <Input label="Grid Heading" value={featuresData.grid.heading} onChange={v => updateFeaturesData({...featuresData, grid: {...featuresData.grid, heading: v}})} />
                    {featuresData.grid.items.map((item, i) => (
                        <div key={i} className="p-4 border border-zinc-800 rounded mb-4">
                            <Input label="Title" value={item.title} onChange={v => {
                                const next = [...featuresData.grid.items]; next[i].title = v; updateFeaturesData({...featuresData, grid: {...featuresData.grid, items: next}});
                            }} />
                            <TextArea label="Description" value={item.description} onChange={v => {
                                const next = [...featuresData.grid.items]; next[i].description = v; updateFeaturesData({...featuresData, grid: {...featuresData.grid, items: next}});
                            }} />
                            <Input label="Image URL" value={item.image} onChange={v => {
                                const next = [...featuresData.grid.items]; next[i].image = v; updateFeaturesData({...featuresData, grid: {...featuresData.grid, items: next}});
                            }} />
                            <button onClick={() => updateFeaturesData({...featuresData, grid: {...featuresData.grid, items: featuresData.grid.items.filter((_, idx) => idx !== i)}})} className="text-red-500 text-[10px]">DELETE ITEM</button>
                        </div>
                    ))}
                    <button onClick={() => updateFeaturesData({...featuresData, grid: {...featuresData.grid, items: [...featuresData.grid.items, {title: '', description: '', image: ''}]}})} className="w-full py-2 border border-zinc-800 text-xs">+ ADD GRID ITEM</button>
                </SectionCard>
            </>
        )}

        {tab === 'vibe' && (
            <SectionCard title="The Vibe Section">
                <Input label="Top Label" value={vibeData.label} onChange={v => updateVibeData({...vibeData, label: v})} />
                <Input label="Heading" value={vibeData.heading} onChange={v => updateVibeData({...vibeData, heading: v})} />
                <TextArea label="Subtext" value={vibeData.text} onChange={v => updateVibeData({...vibeData, text: v})} />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Input label="Image 1 URL" value={vibeData.image1} onChange={v => updateVibeData({...vibeData, image1: v})} />
                        <ImageUploader onUpload={v => updateVibeData({...vibeData, image1: v})} />
                    </div>
                    <div>
                        <Input label="Image 2 URL" value={vibeData.image2} onChange={v => updateVibeData({...vibeData, image2: v})} />
                        <ImageUploader onUpload={v => updateVibeData({...vibeData, image2: v})} />
                    </div>
                </div>
                <Input label="Video Background URL (Optional)" value={vibeData.videoUrl || ''} onChange={v => updateVibeData({...vibeData, videoUrl: v})} />
                <div className="mt-6 border-t border-zinc-800 pt-6">
                    <Input label="Big Bottom Image" value={vibeData.bigImage} onChange={v => updateVibeData({...vibeData, bigImage: v})} />
                    <ImageUploader onUpload={v => updateVibeData({...vibeData, bigImage: v})} />
                    <Input label="Bottom Heading" value={vibeData.bottomHeading} onChange={v => updateVibeData({...vibeData, bottomHeading: v})} />
                    <TextArea label="Bottom Text" value={vibeData.bottomText} onChange={v => updateVibeData({...vibeData, bottomText: v})} />
                </div>
            </SectionCard>
        )}

        {tab === 'stats' && (
            <SectionCard title="Library Stats (Battery)">
                <Input label="Stat Prefix" value={batteryData.statPrefix} onChange={v => updateBatteryData({...batteryData, statPrefix: v})} />
                <Input label="Number" value={batteryData.statNumber} onChange={v => updateBatteryData({...batteryData, statNumber: v})} />
                <Input label="Suffix" value={batteryData.statSuffix} onChange={v => updateBatteryData({...batteryData, statSuffix: v})} />
                <Input label="Description Subtext" value={batteryData.subText} onChange={v => updateBatteryData({...batteryData, subText: v})} />
            </SectionCard>
        )}

        {tab === 'reviews' && (
            <SectionCard title="Testimonials">
                <Input label="Heading" value={testimonialsData.heading} onChange={v => updateTestimonialsData({...testimonialsData, heading: v})} />
                <TextArea label="Subtext" value={testimonialsData.subtext} onChange={v => updateTestimonialsData({...testimonialsData, subtext: v})} />
                {testimonialsData.items.map((rev, i) => (
                    <div key={i} className="p-4 border border-zinc-800 rounded mb-4">
                        <Input label="Name" value={rev.name} onChange={v => {
                            const next = [...testimonialsData.items]; next[i].name = v; updateTestimonialsData({...testimonialsData, items: next});
                        }} />
                        <TextArea label="Quote" value={rev.quote} onChange={v => {
                            const next = [...testimonialsData.items]; next[i].quote = v; updateTestimonialsData({...testimonialsData, items: next});
                        }} />
                        <Input label="Rating (1-5)" value={rev.rating?.toString() || '5'} onChange={v => {
                            const next = [...testimonialsData.items]; next[i].rating = parseInt(v); updateTestimonialsData({...testimonialsData, items: next});
                        }} />
                        <button onClick={() => updateTestimonialsData({...testimonialsData, items: testimonialsData.items.filter((_, idx) => idx !== i)})} className="text-red-500 text-[10px]">DELETE REVIEW</button>
                    </div>
                ))}
                <button onClick={() => updateTestimonialsData({...testimonialsData, items: [...testimonialsData.items, {name: 'New Reviewer', quote: '', avatar: '', rating: 5, date: 'now'}]})} className="w-full py-2 border border-zinc-800 text-xs">+ ADD REVIEW</button>
            </SectionCard>
        )}

        {tab === 'info' && (
            <SectionCard title="Main Information Sections">
                <Input label="Main Heading" value={infoSectionData.heading} onChange={v => updateInfoSectionData({...infoSectionData, heading: v})} />
                {infoSectionData.sections.map((s, i) => (
                    <div key={i} className="border border-zinc-800 p-4 rounded-xl mb-4">
                        <Input label={`Section ${i+1} Title`} value={s.title} onChange={v => {
                            const next = [...infoSectionData.sections]; next[i].title = v; updateInfoSectionData({...infoSectionData, sections: next});
                        }} />
                        <TextArea label="Content" value={s.content} onChange={v => {
                            const next = [...infoSectionData.sections]; next[i].content = v; updateInfoSectionData({...infoSectionData, sections: next});
                        }} />
                        <button onClick={() => updateInfoSectionData({...infoSectionData, sections: infoSectionData.sections.filter((_, idx) => idx !== i)})} className="text-red-500 text-[10px]">DELETE SECTION</button>
                    </div>
                ))}
                <button onClick={() => updateInfoSectionData({...infoSectionData, sections: [...infoSectionData.sections, {title: '', content: ''}]})} className="w-full py-2 border-2 border-dashed border-zinc-800 text-xs">+ ADD SECTION</button>
            </SectionCard>
        )}

        {tab === 'faq' && (
            <SectionCard title="Frequently Asked Questions">
                <Input label="Heading" value={faqData.heading} onChange={v => updateFaqData({...faqData, heading: v})} />
                {faqData.items.map((it, i) => (
                    <div key={i} className="mb-6 p-4 bg-zinc-800/20 rounded-xl">
                        <Input label="Question" value={it.question} onChange={v => {
                            const next = [...faqData.items]; next[i].question = v; updateFaqData({...faqData, items: next});
                        }} />
                        <TextArea label="Answer" value={it.answer} onChange={v => {
                            const next = [...faqData.items]; next[i].answer = v; updateFaqData({...faqData, items: next});
                        }} />
                        <button onClick={() => updateFaqData({...faqData, items: faqData.items.filter((_, idx) => idx !== i)})} className="text-red-500 text-[10px]">REMOVE FAQ</button>
                    </div>
                ))}
                <button onClick={() => updateFaqData({...faqData, items: [...faqData.items, {question: '', answer: ''}]})} className="w-full py-3 border-2 border-dashed border-zinc-800 text-xs text-gray-500 font-black uppercase tracking-widest">+ NEW FAQ</button>
            </SectionCard>
        )}

        {tab === 'blog' && (
            <SectionCard title="Blog Feed">
                <Input label="Heading" value={blogData.heading} onChange={v => updateBlogData({...blogData, heading: v})} />
                <TextArea label="Subtext" value={blogData.subtext} onChange={v => updateBlogData({...blogData, subtext: v})} />
                {blogData.posts.map((post, i) => (
                    <div key={i} className="p-4 border border-zinc-800 rounded mb-4">
                        <Input label="Title" value={post.title} onChange={v => {
                            const next = [...blogData.posts]; next[i].title = v; updateBlogData({...blogData, posts: next});
                        }} />
                        <Input label="Date" value={post.date} onChange={v => {
                            const next = [...blogData.posts]; next[i].date = v; updateBlogData({...blogData, posts: next});
                        }} />
                        <TextArea label="Excerpt" value={post.excerpt} onChange={v => {
                            const next = [...blogData.posts]; next[i].excerpt = v; updateBlogData({...blogData, posts: next});
                        }} />
                        <TextArea label="Content" value={post.content} onChange={v => {
                            const next = [...blogData.posts]; next[i].content = v; updateBlogData({...blogData, posts: next});
                        }} />
                        <ImageUploader onUpload={v => {
                            const next = [...blogData.posts]; next[i].imageUrl = v; updateBlogData({...blogData, posts: next});
                        }} label="Upload Post Image" />
                        <button onClick={() => updateBlogData({...blogData, posts: blogData.posts.filter((_, idx) => idx !== i)})} className="text-red-500 text-[10px] mt-4">DELETE POST</button>
                    </div>
                ))}
                <button onClick={() => updateBlogData({...blogData, posts: [...blogData.posts, {id: Date.now().toString(), title: 'New Post', date: 'Dec 25', excerpt: '', content: '', imageUrl: ''}]})} className="w-full py-2 border border-zinc-800 text-xs">+ ADD POST</button>
            </SectionCard>
        )}

        {tab === 'songs' && (
            <SectionCard title="Karaoke Library Management">
                <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-widest">Managing {songs.length} songs.</p>
                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2 mb-6 scrollbar-hide">
                    {songs.map((s, i) => (
                        <div key={i} className="flex gap-2 bg-zinc-800/30 p-2 rounded text-xs border border-zinc-800">
                            <input className="bg-transparent outline-none flex-1 border-b border-zinc-700" value={s.title} onChange={e => {
                                const next = [...songs]; next[i].title = e.target.value; updateSongs(next);
                            }} />
                            <input className="bg-transparent outline-none flex-1 border-b border-zinc-700" value={s.artist} onChange={e => {
                                const next = [...songs]; next[i].artist = e.target.value; updateSongs(next);
                            }} />
                            <button onClick={() => updateSongs(songs.filter((_, idx) => idx !== i))} className="text-red-500 px-2 font-black">×</button>
                        </div>
                    ))}
                </div>
                <button onClick={() => updateSongs([{id: Date.now().toString(), title: 'New Song', artist: 'Artist'}, ...songs])} className="w-full py-4 bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-700 transition-colors">+ ADD TRACK TO LIBRARY</button>
            </SectionCard>
        )}

        {tab === 'config' && (
            <>
                <SectionCard title="Firebase Setup">
                    <Input label="Realtime Database URL" value={firebaseConfig.databaseURL} onChange={v => updateFirebaseConfig({...firebaseConfig, databaseURL: v})} />
                    <Input label="Auth Secret / API Key" value={firebaseConfig.apiKey} onChange={v => updateFirebaseConfig({...firebaseConfig, apiKey: v})} type="password" />
                </SectionCard>
                <SectionCard title="Hostinger MySQL Sync">
                    <div className="bg-black p-4 rounded border border-zinc-800 mb-4 overflow-x-auto">
                        <pre className="text-[10px] text-green-500 leading-tight font-mono">{phpCode}</pre>
                    </div>
                    <Input label="Endpoint URL (e.g. https://londonkaraoke.club/db.php)" value={syncUrl} onChange={v => updateSyncUrl(v)} />
                </SectionCard>
                <SectionCard title="System">
                    <button onClick={purgeCache} className="bg-red-600/10 border border-red-600 text-red-500 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all w-full">Purge Local Cache & Force Reload</button>
                </SectionCard>
            </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
