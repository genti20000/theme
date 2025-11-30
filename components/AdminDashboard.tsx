
import React, { useState, useRef } from 'react';
import { useData, MenuItem } from '../context/DataContext';
import { GoogleGenAI, Modality } from "@google/genai";

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

type AdminTab = 'header' | 'hero' | 'highlights' | 'features' | 'vibe' | 'testimonials' | 'food' | 'drinks' | 'gallery' | 'battery' | 'footer' | 'database';

// Reusable Components
const SectionCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
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

const ImageUploader: React.FC<{ onUpload: (base64: string) => void; label?: string }> = ({ onUpload, label = "Upload Image" }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) {
                alert("File too large (max 4MB)");
                return;
            }
            try {
                const base64 = await blobToBase64(file);
                onUpload(base64);
            } catch (err) {
                console.error(err);
                alert("Failed to upload image");
            }
        }
    };

    return (
        <div>
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-xs py-2 px-3 rounded border border-zinc-600 transition-colors whitespace-nowrap"
            >
                {label} (Base64)
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
            />
        </div>
    );
};

const ImageField: React.FC<{ url: string; onUpdate: (url: string) => void }> = ({ url, onUpdate }) => {
    const SERVER_PATH = 'https://londonkaraoke.club/uploads/';
    // Auto-detect if the URL is a server file to set the initial mode
    const isServerFile = url.startsWith(SERVER_PATH);
    const [mode, setMode] = useState<'url' | 'server'>(isServerFile ? 'server' : 'url');
    
    // Extract filename if url matches server path, otherwise empty
    const getFilename = (fullUrl: string) => {
        if (fullUrl.startsWith(SERVER_PATH)) {
            return fullUrl.replace(SERVER_PATH, '');
        }
        return '';
    };

    return (
        <div className="flex gap-4 items-start bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/50">
            <div className="w-16 h-16 bg-black rounded overflow-hidden flex-shrink-0 border border-zinc-700">
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
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
                        Server File (/uploads/)
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
                        {mode === 'server' ? 'Type filename from your hosting /uploads folder' : 'Enter external link'}
                     </span>
                    <ImageUploader onUpload={onUpdate} label="Convert File" />
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
    dbConfig, updateDbConfig,
    resetToDefaults 
  } = useData();
  const [activeTab, setActiveTab] = useState<AdminTab>('header');

  // AI Generation State for Hero
  const [generatedBackgrounds, setGeneratedBackgrounds] = useState<string[]>([]);
  const [isGeneratingBackgrounds, setIsGeneratingBackgrounds] = useState(false);
  
  // Save State
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // DB Connection Test State
  const [dbStatus, setDbStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };
  
  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate saving delay for user feedback (Data is already synced via Context/LocalStorage)
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };
  
  const handleTestDbConnection = () => {
      setDbStatus('connecting');
      setTimeout(() => {
          if (dbConfig.host && dbConfig.user) {
              setDbStatus('connected');
          } else {
              setDbStatus('error');
          }
      }, 1500);
  }

  const handleDownloadSQL = () => {
    const sqlContent = `
-- Database Setup for London Karaoke Club
CREATE DATABASE IF NOT EXISTS \`${dbConfig.name}\`;
USE \`${dbConfig.name}\`;

-- Hero Section
CREATE TABLE IF NOT EXISTS hero_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    badge_text VARCHAR(255),
    heading_text VARCHAR(255),
    sub_text TEXT,
    button_text VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS hero_slides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url TEXT,
    display_order INT
);

-- Food Menu
CREATE TABLE IF NOT EXISTS food_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    display_order INT
);

CREATE TABLE IF NOT EXISTS food_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255),
    description TEXT,
    price VARCHAR(50),
    note VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES food_categories(id) ON DELETE CASCADE
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url TEXT,
    caption VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Data Dump based on current state
INSERT INTO hero_settings (badge_text, heading_text, sub_text, button_text) VALUES 
('${heroData.badgeText.replace(/'/g, "''")}', '${heroData.headingText.replace(/'/g, "''")}', '${heroData.subText.replace(/'/g, "''")}', '${heroData.buttonText.replace(/'/g, "''")}');

-- (You can run this SQL in phpMyAdmin to create the structure)
    `;
    
    const blob = new Blob([sqlContent], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lkc_setup.sql';
    a.click();
  };

  const handleDownloadPHP = () => {
      const phpContent = `<?php
$host = "${dbConfig.host}";
$username = "${dbConfig.user}";
$password = "${dbConfig.pass}";
$dbname = "${dbConfig.name}";

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>`;
      const blob = new Blob([phpContent], { type: 'text/x-php' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'db_connect.php';
      a.click();
  };


  // --- Handlers ---
  const handleHeroChange = (field: string, value: any) => {
      updateHeroData({ ...heroData, [field]: value });
  };

  const handleHighlightsChange = (field: string, value: any) => {
      updateHighlightsData({ ...highlightsData, [field]: value });
  };

  const handleFoodChange = (catIndex: number, itemIndex: number, field: keyof MenuItem, value: string) => {
    const newMenu = [...foodMenu];
    newMenu[catIndex].items[itemIndex] = { ...newMenu[catIndex].items[itemIndex], [field]: value };
    updateFoodMenu(newMenu);
  };

  const handleAddFoodItem = (catIndex: number) => {
    const newMenu = [...foodMenu];
    newMenu[catIndex].items.push({ name: 'New Item', description: 'Description here', price: '0' });
    updateFoodMenu(newMenu);
  };

  const handleDeleteFoodItem = (catIndex: number, itemIndex: number) => {
      if(!confirm("Delete this item?")) return;
      const newMenu = [...foodMenu];
      newMenu[catIndex].items.splice(itemIndex, 1);
      updateFoodMenu(newMenu);
  }

  const handleGenerateBackgrounds = async () => {
    setIsGeneratingBackgrounds(true);
    setGeneratedBackgrounds([]);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        // Define 3 distinct styles/moods based on the current hero text
        const baseContext = heroData.headingText || "Karaoke Club";
        const prompts = [
            `Photorealistic wide shot of a high-energy karaoke club scene in London. ${baseContext}. Neon pink and blue laser lights, happy crowd, cyberpunk party atmosphere. 8k resolution, cinematic lighting, 16:9 aspect ratio.`,
            `Interior design photography of a luxury private karaoke suite. ${baseContext}. Plush velvet sofas, gold accents, dim moody lighting, champagne on table. Sophisticated, exclusive, elegant. 8k resolution, 16:9 aspect ratio.`,
            `Abstract digital art wallpaper for a music venue. ${baseContext}. Vibrant sound waves, musical notes, neon geometric shapes against a dark background, dynamic motion. Modern, artistic, 8k resolution, 16:9 aspect ratio.`
        ];

        const newImages: string[] = [];

        await Promise.all(prompts.map(async (prompt) => {
             try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [{ text: prompt }] },
                    config: { responseModalities: [Modality.IMAGE] }
                });
                
                // Find image part
                if (response.candidates?.[0]?.content?.parts) {
                    for (const part of response.candidates[0].content.parts) {
                        if (part.inlineData) {
                            newImages.push(`data:image/png;base64,${part.inlineData.data}`);
                            break;
                        }
                    }
                }
             } catch (err) {
                 console.error("Failed to generate one image variation", err);
             }
        }));
        
        if (newImages.length > 0) {
            setGeneratedBackgrounds(newImages);
        } else {
            alert("Failed to generate images. Please try again.");
        }

    } catch (error) {
        console.error("Generation failed", error);
        alert("An error occurred while connecting to the AI service.");
    } finally {
        setIsGeneratingBackgrounds(false);
    }
  };

  const handleAddSlide = () => {
      const currentSlides = heroData.slides || [heroData.backgroundImageUrl];
      handleHeroChange('slides', [...currentSlides, 'https://picsum.photos/seed/newslide/1600/900']);
  };

  const handleRemoveSlide = (index: number) => {
      const currentSlides = heroData.slides || [heroData.backgroundImageUrl];
      const newSlides = [...currentSlides];
      newSlides.splice(index, 1);
      handleHeroChange('slides', newSlides);
  };

  const handleUpdateSlide = (index: number, value: string) => {
      const currentSlides = heroData.slides || [heroData.backgroundImageUrl];
      const newSlides = [...currentSlides];
      newSlides[index] = value;
      handleHeroChange('slides', newSlides);
  }

  const handleAddGalleryImage = () => {
      const newImages = [...galleryData.images, { id: Date.now().toString(), url: 'https://picsum.photos/seed/new/800/800', caption: 'New Image' }];
      updateGalleryData({ ...galleryData, images: newImages });
  }

  const handleDeleteGalleryImage = (index: number) => {
      if(!confirm("Remove this image?")) return;
      const newImages = [...galleryData.images];
      newImages.splice(index, 1);
      updateGalleryData({ ...galleryData, images: newImages });
  }


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:border-yellow-400"
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
           <div className="mt-6 text-center text-zinc-600 text-xs">
            Hint: admin123
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-yellow-400">LKC Backend</h2>
          <div className="flex gap-4 items-center">
             <button 
                onClick={handleSave} 
                disabled={saveStatus === 'saving'}
                className={`text-sm font-bold py-2 px-6 rounded-full transition-all flex items-center gap-2 shadow-md ${
                    saveStatus === 'saved' 
                    ? 'bg-green-500 text-white cursor-default' 
                    : 'bg-yellow-400 hover:bg-yellow-500 text-black hover:scale-105'
                }`}
             >
                {saveStatus === 'saving' && (
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {saveStatus === 'saved' && (
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {saveStatus === 'idle' && 'Save All Changes'}
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'saved' && 'Saved Successfully'}
             </button>
             
             <div className="h-6 w-px bg-zinc-700 mx-2"></div>

             <button onClick={resetToDefaults} className="text-xs text-red-400 hover:text-red-300 underline">
                Reset Data
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-sm text-gray-400 hover:text-white">
                Logout
            </button>
          </div>
        </div>
        <div className="container mx-auto px-6 flex gap-6 text-sm font-semibold overflow-x-auto no-scrollbar">
             {['header', 'hero', 'highlights', 'features', 'vibe', 'gallery', 'testimonials', 'food', 'drinks', 'battery', 'footer', 'database'].map((tab) => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as AdminTab)}
                    className={`pb-3 border-b-2 transition-colors whitespace-nowrap capitalize ${activeTab === tab ? 'border-yellow-400 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                 >
                    {tab}
                 </button>
             ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">

        {activeTab === 'header' && (
            <div className="space-y-8">
                <SectionCard title="Header Settings" description="Manage the site logo and header elements.">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Logo Image</label>
                    <ImageField url={headerData.logoUrl} onUpdate={(v) => updateHeaderData({...headerData, logoUrl: v})} />
                </SectionCard>
            </div>
        )}
        
        {activeTab === 'hero' && (
            <div className="space-y-8">
                <SectionCard title="Homepage Hero" description="Update the main visuals and text of your landing page.">
                     <div className="grid md:grid-cols-2 gap-6">
                         <InputGroup label="Badge Text" value={heroData.badgeText} onChange={(v) => handleHeroChange('badgeText', v)} />
                         <InputGroup label="Button Text" value={heroData.buttonText} onChange={(v) => handleHeroChange('buttonText', v)} />
                     </div>
                     <InputGroup label="Main Heading" value={heroData.headingText} onChange={(v) => handleHeroChange('headingText', v)} />
                     <InputGroup label="Subtext" value={heroData.subText} onChange={(v) => handleHeroChange('subText', v)} type="textarea" />
                     
                     <div className="border-t border-zinc-800 pt-6">
                        <label className="block text-sm font-semibold text-gray-300 mb-4">Hero Slideshow Images</label>
                        
                        <div className="space-y-4 mb-4">
                            {(heroData.slides || [heroData.backgroundImageUrl]).map((slide, index) => (
                                <div key={index} className="flex gap-4 items-start bg-zinc-950/50 p-2 rounded border border-zinc-800">
                                    <div className="text-xs text-gray-500 py-2 w-6 text-center">{index + 1}</div>
                                    <div className="flex-1">
                                        <ImageField url={slide} onUpdate={(v) => handleUpdateSlide(index, v)} />
                                    </div>
                                    <button onClick={() => handleRemoveSlide(index)} className="text-red-500 hover:bg-red-900/20 p-2 rounded self-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            onClick={handleAddSlide}
                            className="w-full py-2 border-2 border-dashed border-zinc-700 rounded text-gray-400 hover:border-yellow-400 hover:text-yellow-400 text-sm font-semibold"
                        >
                            + Add New Slide
                        </button>


                        {/* AI Background Generator */}
                        <div className="mt-8 bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                             <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-yellow-400">AI Background Suggestions</h4>
                                    <p className="text-xs text-gray-500">Generate 3 variants (Party, Luxury, Abstract) based on your heading.</p>
                                </div>
                                <button 
                                    onClick={handleGenerateBackgrounds} 
                                    disabled={isGeneratingBackgrounds}
                                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 text-white text-xs font-bold py-2 px-4 rounded-full transition-all flex items-center gap-2"
                                >
                                    {isGeneratingBackgrounds ? (
                                        <span className="block w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                                    ) : (
                                        <span>✨</span>
                                    )}
                                    {isGeneratingBackgrounds ? 'Generating...' : 'Generate New Options'}
                                </button>
                             </div>
                             
                             {generatedBackgrounds.length > 0 && (
                                 <div className="grid grid-cols-3 gap-4">
                                     {generatedBackgrounds.map((bg, idx) => (
                                         <div key={idx} className="group relative cursor-pointer" onClick={() => {
                                             // Add as a new slide
                                             const currentSlides = heroData.slides || [heroData.backgroundImageUrl];
                                             handleHeroChange('slides', [...currentSlides, bg]);
                                         }}>
                                             <img src={bg} className="w-full h-24 object-cover rounded border-2 border-transparent group-hover:border-yellow-400 transition-all" />
                                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                                                 <span className="text-xs font-bold text-white">Add as Slide</span>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </div>
                     </div>
                </SectionCard>
            </div>
        )}

        {activeTab === 'highlights' && (
             <div className="space-y-8">
                <SectionCard title="Highlights Section" description="Manage the 'Get the party started' section.">
                    <InputGroup label="Heading" value={highlightsData.heading} onChange={(v) => handleHighlightsChange('heading', v)} />
                    <InputGroup label="Subtext" value={highlightsData.subtext} onChange={(v) => handleHighlightsChange('subtext', v)} type="textarea" />
                    
                    <div className="grid md:grid-cols-2 gap-8 mt-6">
                        <div>
                             <label className="block text-sm font-semibold text-gray-300 mb-2">Main Image</label>
                             <ImageField url={highlightsData.mainImageUrl} onUpdate={(v) => handleHighlightsChange('mainImageUrl', v)} />
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-300 mb-2">Side Circle Image</label>
                             <ImageField url={highlightsData.sideImageUrl} onUpdate={(v) => handleHighlightsChange('sideImageUrl', v)} />
                        </div>
                    </div>

                    <div className="mt-6 border-t border-zinc-800 pt-6">
                         <InputGroup label="List Title" value={highlightsData.featureListTitle} onChange={(v) => handleHighlightsChange('featureListTitle', v)} />
                         <label className="block text-sm font-semibold text-gray-300 mb-2 mt-4">Feature List Items (One per line)</label>
                         <textarea 
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm focus:border-yellow-400 outline-none min-h-[150px]"
                            value={highlightsData.featureList.join('\n')}
                            onChange={(e) => handleHighlightsChange('featureList', e.target.value.split('\n'))}
                         />
                    </div>
                </SectionCard>
             </div>
        )}

        {activeTab === 'features' && (
             <div className="space-y-8">
                <SectionCard title="Experience Section" description="Top section with large background image">
                     <InputGroup label="Label" value={featuresData.experience.label} onChange={(v) => updateFeaturesData({...featuresData, experience: {...featuresData.experience, label: v}})} />
                     <InputGroup label="Heading" value={featuresData.experience.heading} onChange={(v) => updateFeaturesData({...featuresData, experience: {...featuresData.experience, heading: v}})} />
                     <InputGroup label="Text" value={featuresData.experience.text} onChange={(v) => updateFeaturesData({...featuresData, experience: {...featuresData.experience, text: v}})} type="textarea" />
                     <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Background Image</label>
                        <ImageField url={featuresData.experience.image} onUpdate={(v) => updateFeaturesData({...featuresData, experience: {...featuresData.experience, image: v}})} />
                     </div>
                </SectionCard>

                <SectionCard title="Occasions Section" description="Middle section with 3 cards">
                    <InputGroup label="Main Heading" value={featuresData.occasions.heading} onChange={(v) => updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, heading: v}})} />
                    <InputGroup label="Main Text" value={featuresData.occasions.text} onChange={(v) => updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, text: v}})} type="textarea" />
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                        {featuresData.occasions.items.map((item, idx) => (
                             <div key={idx} className="bg-zinc-800 p-4 rounded border border-zinc-700">
                                 <p className="text-xs text-gray-500 mb-2">Card {idx + 1}</p>
                                 <div className="space-y-2">
                                     <input className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white" value={item.title} onChange={(e) => {
                                         const newItems = [...featuresData.occasions.items];
                                         newItems[idx].title = e.target.value;
                                         updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, items: newItems}});
                                     }} />
                                     <textarea className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white" rows={3} value={item.text} onChange={(e) => {
                                         const newItems = [...featuresData.occasions.items];
                                         newItems[idx].text = e.target.value;
                                         updateFeaturesData({...featuresData, occasions: {...featuresData.occasions, items: newItems}});
                                     }} />
                                 </div>
                             </div>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard title="Grid Section" description="Bottom section with images">
                    <InputGroup label="Section Heading" value={featuresData.grid.heading} onChange={(v) => updateFeaturesData({...featuresData, grid: {...featuresData.grid, heading: v}})} />
                    <div className="grid gap-6 mt-6">
                        {featuresData.grid.items.map((item, idx) => (
                             <div key={idx} className="bg-zinc-800 p-4 rounded border border-zinc-700 flex gap-4 flex-col md:flex-row">
                                 <div className="flex-1 space-y-3">
                                     <input className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm font-bold text-white" value={item.title} onChange={(e) => {
                                         const newItems = [...featuresData.grid.items];
                                         newItems[idx].title = e.target.value;
                                         updateFeaturesData({...featuresData, grid: {...featuresData.grid, items: newItems}});
                                     }} />
                                     <textarea className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white" rows={2} value={item.description} onChange={(e) => {
                                         const newItems = [...featuresData.grid.items];
                                         newItems[idx].description = e.target.value;
                                         updateFeaturesData({...featuresData, grid: {...featuresData.grid, items: newItems}});
                                     }} />
                                 </div>
                                 <div className="w-full md:w-48">
                                     <ImageField url={item.image} onUpdate={(v) => {
                                         const newItems = [...featuresData.grid.items];
                                         newItems[idx].image = v;
                                         updateFeaturesData({...featuresData, grid: {...featuresData.grid, items: newItems}});
                                     }} />
                                 </div>
                             </div>
                        ))}
                    </div>
                </SectionCard>
             </div>
        )}

        {activeTab === 'vibe' && (
            <div className="space-y-8">
                 <SectionCard title="Vibe (Fitness) Section" description="The 'Heart of the Party' section">
                     <InputGroup label="Label" value={vibeData.label} onChange={(v) => updateVibeData({...vibeData, label: v})} />
                     <InputGroup label="Heading" value={vibeData.heading} onChange={(v) => updateVibeData({...vibeData, heading: v})} />
                     <InputGroup label="Text" value={vibeData.text} onChange={(v) => updateVibeData({...vibeData, text: v})} type="textarea" />
                     
                     <div className="grid md:grid-cols-2 gap-6 mt-6">
                         <div>
                             <label className="block text-sm font-semibold text-gray-300 mb-2">Top Circle Image 1</label>
                             <ImageField url={vibeData.image1} onUpdate={(v) => updateVibeData({...vibeData, image1: v})} />
                         </div>
                         <div>
                             <label className="block text-sm font-semibold text-gray-300 mb-2">Bottom Circle Image 2</label>
                             <ImageField url={vibeData.image2} onUpdate={(v) => updateVibeData({...vibeData, image2: v})} />
                         </div>
                     </div>
                 </SectionCard>

                 <SectionCard title="Bottom Banner" description="Large image section">
                     <InputGroup label="Bottom Heading" value={vibeData.bottomHeading} onChange={(v) => updateVibeData({...vibeData, bottomHeading: v})} />
                     <InputGroup label="Bottom Text" value={vibeData.bottomText} onChange={(v) => updateVibeData({...vibeData, bottomText: v})} type="textarea" />
                     <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Large Banner Image</label>
                        <ImageField url={vibeData.bigImage} onUpdate={(v) => updateVibeData({...vibeData, bigImage: v})} />
                     </div>
                 </SectionCard>
            </div>
        )}
        
        {activeTab === 'gallery' && (
             <div className="space-y-8">
                <SectionCard title="Gallery Page" description="Manage your photo gallery.">
                     <InputGroup label="Page Heading" value={galleryData.heading} onChange={(v) => updateGalleryData({...galleryData, heading: v})} />
                     <InputGroup label="Subtext" value={galleryData.subtext} onChange={(v) => updateGalleryData({...galleryData, subtext: v})} type="textarea" />
                     
                     <div className="border-t border-zinc-800 pt-6 mt-6">
                         <div className="flex justify-between items-center mb-6">
                             <h4 className="text-sm font-bold text-gray-300">Images ({galleryData.images.length})</h4>
                             <button onClick={handleAddGalleryImage} className="text-xs bg-yellow-400 text-black px-3 py-1.5 rounded font-bold hover:bg-yellow-500 transition-colors">+ Add Image</button>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {galleryData.images.map((img, idx) => (
                                 <div key={img.id} className="bg-zinc-950/50 p-3 rounded border border-zinc-800 flex gap-4">
                                     <div className="w-24 h-24 flex-shrink-0">
                                          <ImageField url={img.url} onUpdate={(v) => {
                                              const newImages = [...galleryData.images];
                                              newImages[idx].url = v;
                                              updateGalleryData({...galleryData, images: newImages});
                                          }} />
                                     </div>
                                     <div className="flex-1 space-y-2">
                                         <input 
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-white" 
                                            placeholder="Caption"
                                            value={img.caption}
                                            onChange={(e) => {
                                              const newImages = [...galleryData.images];
                                              newImages[idx].caption = e.target.value;
                                              updateGalleryData({...galleryData, images: newImages});
                                            }}
                                         />
                                         <button onClick={() => handleDeleteGalleryImage(idx)} className="text-xs text-red-500 underline hover:text-red-400">Remove</button>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                </SectionCard>
             </div>
        )}

        {activeTab === 'testimonials' && (
            <div className="space-y-8">
                <SectionCard title="Testimonials" description="Customer reviews section">
                     <InputGroup label="Heading" value={testimonialsData.heading} onChange={(v) => updateTestimonialsData({...testimonialsData, heading: v})} />
                     <InputGroup label="Subtext" value={testimonialsData.subtext} onChange={(v) => updateTestimonialsData({...testimonialsData, subtext: v})} type="textarea" />
                     
                     <div className="grid gap-6 mt-6">
                         {testimonialsData.items.map((item, idx) => (
                             <div key={idx} className="bg-zinc-800 p-4 rounded border border-zinc-700 flex flex-col md:flex-row gap-6">
                                 <div className="w-full md:w-24">
                                     <div className="mb-2 text-xs text-gray-500">Avatar</div>
                                     <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border border-zinc-600">
                                         <img src={item.avatar} className="w-full h-full object-cover" />
                                     </div>
                                     <ImageUploader onUpload={(v) => {
                                         const newItems = [...testimonialsData.items];
                                         newItems[idx].avatar = v;
                                         updateTestimonialsData({...testimonialsData, items: newItems});
                                     }} label="Upload" />
                                 </div>
                                 <div className="flex-1 space-y-3">
                                     <InputGroup label="Name" value={item.name} onChange={(v) => {
                                         const newItems = [...testimonialsData.items];
                                         newItems[idx].name = v;
                                         updateTestimonialsData({...testimonialsData, items: newItems});
                                     }} />
                                     <InputGroup label="Quote" value={item.quote} onChange={(v) => {
                                         const newItems = [...testimonialsData.items];
                                         newItems[idx].quote = v;
                                         updateTestimonialsData({...testimonialsData, items: newItems});
                                     }} type="textarea" />
                                 </div>
                             </div>
                         ))}
                     </div>
                </SectionCard>
            </div>
        )}

        {activeTab === 'battery' && (
            <div className="space-y-8">
                <SectionCard title="Stats Section" description="The 'Songs to choose from' circle">
                    <div className="grid grid-cols-3 gap-4">
                         <InputGroup label="Prefix (Top)" value={batteryData.statPrefix} onChange={(v) => updateBatteryData({...batteryData, statPrefix: v})} />
                         <InputGroup label="Number (Middle)" value={batteryData.statNumber} onChange={(v) => updateBatteryData({...batteryData, statNumber: v})} />
                         <InputGroup label="Suffix (Bottom)" value={batteryData.statSuffix} onChange={(v) => updateBatteryData({...batteryData, statSuffix: v})} />
                    </div>
                    <InputGroup label="Subtext (Below Circle)" value={batteryData.subText} onChange={(v) => updateBatteryData({...batteryData, subText: v})} />
                </SectionCard>
            </div>
        )}

        {activeTab === 'footer' && (
            <div className="space-y-8">
                <SectionCard title="Footer Call to Action" description="The booking prompt at the bottom of the page">
                    <InputGroup label="Heading" value={footerData.ctaHeading} onChange={(v) => updateFooterData({...footerData, ctaHeading: v})} />
                    <InputGroup label="Text" value={footerData.ctaText} onChange={(v) => updateFooterData({...footerData, ctaText: v})} type="textarea" />
                    <InputGroup label="Button Text" value={footerData.ctaButtonText} onChange={(v) => updateFooterData({...footerData, ctaButtonText: v})} />
                </SectionCard>
            </div>
        )}

        {activeTab === 'food' && (
            <div className="space-y-8">
                {foodMenu.map((category, catIndex) => (
                    <SectionCard key={category.category} title={category.category} description="">
                        <div className="space-y-4">
                            {category.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-zinc-950/50 p-4 rounded-lg">
                                    <div className="md:col-span-3">
                                        <label className="text-xs text-gray-500 block mb-1">Item Name</label>
                                        <input 
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-yellow-400 outline-none text-white"
                                            value={item.name}
                                            onChange={(e) => handleFoodChange(catIndex, itemIndex, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-6">
                                        <label className="text-xs text-gray-500 block mb-1">Description</label>
                                        <textarea 
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-yellow-400 outline-none text-white"
                                            rows={2}
                                            value={item.description}
                                            onChange={(e) => handleFoodChange(catIndex, itemIndex, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs text-gray-500 block mb-1">Price (£)</label>
                                        <input 
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-yellow-400 outline-none text-white"
                                            value={item.price}
                                            onChange={(e) => handleFoodChange(catIndex, itemIndex, 'price', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-1 flex items-center justify-center h-full pt-6">
                                        <button onClick={() => handleDeleteFoodItem(catIndex, itemIndex)} className="text-red-500 hover:bg-red-500/10 p-2 rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => handleAddFoodItem(catIndex)}
                                className="w-full py-3 border-2 border-dashed border-zinc-700 rounded-lg text-gray-500 hover:border-yellow-400 hover:text-yellow-400 transition-colors text-sm font-semibold"
                            >
                                + Add Item to {category.category}
                            </button>
                        </div>
                    </SectionCard>
                ))}
            </div>
        )}

        {activeTab === 'drinks' && (
             <div className="space-y-8">
                 <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg mb-6">
                     <p className="text-blue-300 text-sm">Note: Complex pricing structures for bottles and wines are viewed in read-only mode here.</p>
                 </div>

                 <SectionCard title="Menu Header" description="">
                     <label className="block text-sm font-semibold text-gray-300 mb-2">Header Image</label>
                     <ImageField url={drinksData.headerImageUrl} onUpdate={(v) => updateDrinksData({...drinksData, headerImageUrl: v})} />
                 </SectionCard>
             </div>
        )}

        {activeTab === 'database' && (
             <div className="space-y-8">
                 <SectionCard title="Database Configuration" description="Configure your database connection details to persist changes.">
                     <div className="space-y-4">
                         <div className="grid md:grid-cols-2 gap-6">
                             <InputGroup label="Database Host" value={dbConfig.host} onChange={(v) => updateDbConfig({...dbConfig, host: v})} />
                             <InputGroup label="Database Name" value={dbConfig.name} onChange={(v) => updateDbConfig({...dbConfig, name: v})} />
                         </div>
                         <div className="grid md:grid-cols-2 gap-6">
                             <InputGroup label="Username" value={dbConfig.user} onChange={(v) => updateDbConfig({...dbConfig, user: v})} />
                             <InputGroup label="Password" value={dbConfig.pass} onChange={(v) => updateDbConfig({...dbConfig, pass: v})} type="password" />
                         </div>
                         
                         <div className="flex items-center gap-4 mt-6">
                             <button 
                                onClick={handleTestDbConnection} 
                                disabled={dbStatus === 'connecting'}
                                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                                    dbStatus === 'connected' ? 'bg-green-600 text-white' : 
                                    dbStatus === 'error' ? 'bg-red-600 text-white' : 
                                    'bg-blue-600 hover:bg-blue-500 text-white'
                                }`}
                             >
                                 {dbStatus === 'connecting' && <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>}
                                 {dbStatus === 'idle' && 'Test Connection'}
                                 {dbStatus === 'connecting' && 'Testing...'}
                                 {dbStatus === 'connected' && 'Connection Successful'}
                                 {dbStatus === 'error' && 'Connection Failed'}
                             </button>
                             {dbStatus === 'connected' && <span className="text-green-400 text-sm">Database active. Settings saved.</span>}
                             {dbStatus === 'error' && <span className="text-red-400 text-sm">Check your credentials and try again.</span>}
                         </div>

                         {/* Database Download Buttons */}
                         <div className="border-t border-zinc-800 pt-6 mt-6">
                             <h4 className="text-sm font-bold text-white mb-2">Setup Downloads</h4>
                             <p className="text-xs text-gray-500 mb-4">Download the necessary files to setup your database on your server.</p>
                             <div className="flex gap-4">
                                 <button onClick={handleDownloadSQL} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded border border-zinc-700 text-sm flex items-center gap-2">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                     Download .sql Setup
                                 </button>
                                 <button onClick={handleDownloadPHP} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded border border-zinc-700 text-sm flex items-center gap-2">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                     Download .php Connection
                                 </button>
                             </div>
                         </div>
                     </div>
                 </SectionCard>
             </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
