
import React, { useState, useRef } from 'react';
import { useData, MenuItem, Song, Booking } from '../context/DataContext';
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

type AdminTab = 'header' | 'hero' | 'highlights' | 'features' | 'vibe' | 'testimonials' | 'food' | 'drinks' | 'gallery' | 'battery' | 'footer' | 'database' | 'songs' | 'bookings';

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

const ImageUploader: React.FC<{ onUpload: (url: string) => void; label?: string; multiple?: boolean; onBulkUpload?: (files: File[]) => void }> = ({ onUpload, label = "Upload Image", multiple = false, onBulkUpload }) => {
    const { dbConfig } = useData();
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
            // Simulate upload or handle real upload logic
            // Ideally this would POST to dbConfig.uploadScriptUrl
            setUploading(true);
            
            // Mock delay for simulation
            setTimeout(async () => {
                try {
                    const base64 = await blobToBase64(file);
                    // In a real app, you'd return the server URL here. 
                    // For this frontend-only demo, we use Base64 or a Blob URL.
                    onUpload(base64); 
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
                       {label} {dbConfig.uploadScriptUrl ? '(Server)' : '(Base64)'}
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

const MultiUploader: React.FC<{ onUploadComplete: (urls: {url: string, type: 'image' | 'video'}[]) => void }> = ({ onUploadComplete }) => {
    const { dbConfig } = useData();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

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
                // Simulate server upload with base64 for now
                const base64 = await blobToBase64(file);
                uploadedItems.push({ url: base64, type });
            } catch (e) {}
            
            current++;
            setProgress(Math.round((current / total) * 100));
        }
        
        onUploadComplete(uploadedItems);
        setUploading(false);
        setProgress(0);
    };

    return (
        <div className="w-full">
            <ImageUploader 
                onUpload={() => {}} 
                label="Bulk Upload Media" 
                multiple={true} 
                onBulkUpload={handleBulkUpload} 
            />
            {uploading && (
                <div className="mt-2 w-full bg-zinc-800 rounded-full h-2.5">
                    <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
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
    dbConfig, updateDbConfig,
    songs, updateSongs,
    bookings, updateBookings,
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

  // Song Bulk Import
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

  const handleDownloadSQL = () => {
    // Generate bookings insert
    const bookingsSQL = bookings.map(b => 
        `INSERT INTO bookings (customer_name, email, phone, booking_date, booking_time, guests, room, status) VALUES ('${b.customerName}', '${b.email}', '${b.phone}', '${b.date}', '${b.time}', ${b.guests}, '${b.room}', '${b.status}');`
    ).join('\n');

    // Generate songs insert (limit to first 50 to avoid massive file)
    const songsSQL = songs.slice(0, 50).map(s =>
        `INSERT INTO songs (title, artist, genre, language) VALUES ('${s.title.replace(/'/g, "''")}', '${s.artist.replace(/'/g, "''")}', '${s.genre?.replace(/'/g, "''")}', '${s.language}');`
    ).join('\n');

    const sqlContent = `
-- Database Setup for London Karaoke Club
CREATE DATABASE IF NOT EXISTS \`${dbConfig.name}\`;
USE \`${dbConfig.name}\`;

-- Core Tables
CREATE TABLE IF NOT EXISTS hero_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    badge_text VARCHAR(255),
    heading_text VARCHAR(255),
    sub_text TEXT,
    button_text VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS food_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    artist VARCHAR(255),
    genre VARCHAR(100),
    language VARCHAR(50) DEFAULT 'English'
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    booking_date DATE,
    booking_time TIME,
    guests INT,
    room VARCHAR(100),
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Data
${bookingsSQL}
${songsSQL}
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
// This file can be included in your API endpoints
?>`;
      const blob = new Blob([phpContent], { type: 'text/x-php' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'db_connect.php';
      a.click();
  };

  const handleDownloadUploadScript = () => {
      const phpContent = `<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Caution: Adjust for production

$upload_dir = 'uploads/';
$photos_dir = '${dbConfig.photoFolder || "uploads/photos/"}';
$videos_dir = '${dbConfig.videoFolder || "uploads/videos/"}';

if (!file_exists($photos_dir)) mkdir($photos_dir, 0777, true);
if (!file_exists($videos_dir)) mkdir($videos_dir, 0777, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $file_tmp = $_FILES['file']['tmp_name'];
        $file_name = basename($_FILES['file']['name']);
        $file_type = $_FILES['file']['type'];
        
        $target_dir = (strpos($file_type, 'video') !== false) ? $videos_dir : $photos_dir;
        
        // Sanitize filename
        $file_name = preg_replace("/[^a-zA-Z0-9.]/", "_", $file_name);
        // Ensure unique
        $target_file = $target_dir . uniqid() . '_' . $file_name;

        if (move_uploaded_file($file_tmp, $target_file)) {
            echo json_encode([
                "success" => true,
                "url" => 'https://' . $_SERVER['HTTP_HOST'] . '/' . $target_file
            ]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to move uploaded file."]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "No file uploaded or upload error."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
}
?>`;
      const blob = new Blob([phpContent], { type: 'text/x-php' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'upload.php';
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

  // Song Handlers
  const handleAddSong = () => {
      const newSongs = [...songs, { id: Date.now().toString(), title: 'New Song', artist: 'Artist', genre: 'Pop', language: 'English' }];
      updateSongs(newSongs);
  };
  const handleDeleteSong = (id: string) => {
      if(!confirm("Delete this song?")) return;
      updateSongs(songs.filter(s => s.id !== id));
  };
  const handleUpdateSong = (id: string, field: keyof Song, value: string) => {
      updateSongs(songs.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const handleBulkImportSongs = () => {
      const lines = bulkSongsText.split('\n');
      const newSongsImported: Song[] = [];
      lines.forEach(line => {
          const parts = line.split(',');
          if (parts.length >= 2) {
              newSongsImported.push({
                  id: Date.now().toString() + Math.random(),
                  title: parts[0].trim(),
                  artist: parts[1].trim(),
                  genre: parts[2]?.trim() || 'Pop',
                  language: 'English'
              });
          }
      });
      updateSongs([...songs, ...newSongsImported]);
      setBulkSongsText('');
      alert(`Imported ${newSongsImported.length} songs.`);
  };

  // Booking Handlers
  const handleAddBooking = () => {
      const newBookings = [...bookings, { 
          id: Date.now().toString(), 
          customerName: 'New Guest', 
          email: '', 
          phone: '', 
          date: new Date().toISOString().split('T')[0], 
          time: '20:00', 
          guests: 4, 
          room: 'Standard', 
          status: 'pending' 
      }];
      updateBookings(newBookings);
  };
  const handleDeleteBooking = (id: string) => {
      if(!confirm("Delete booking?")) return;
      updateBookings(bookings.filter(b => b.id !== id));
  };
  const handleUpdateBooking = (id: string, field: keyof Booking, value: any) => {
      updateBookings(bookings.map(b => b.id === id ? { ...b, [field]: value } : b));
  };


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

  const handleAddGalleryVideo = () => {
      const currentVideos = galleryData.videos || [];
      const newVideos = [...currentVideos, { id: Date.now().toString(), url: '', thumbnail: '', title: 'New Video' }];
      updateGalleryData({ ...galleryData, videos: newVideos });
  }

  const handleDeleteGalleryVideo = (index: number) => {
      if(!confirm("Remove this video?")) return;
      const currentVideos = galleryData.videos || [];
      const newVideos = [...currentVideos];
      newVideos.splice(index, 1);
      updateGalleryData({ ...galleryData, videos: newVideos });
  }

  const handleUpdateVideo = (index: number, field: string, value: string) => {
      const currentVideos = galleryData.videos || [];
      const newVideos = [...currentVideos];
      newVideos[index] = { ...newVideos[index], [field]: value };
      updateGalleryData({ ...galleryData, videos: newVideos });
  }

  const handleBulkUploadComplete = (items: {url: string, type: 'image' | 'video'}[]) => {
      const newImages = [...galleryData.images];
      const newVideos = [...(galleryData.videos || [])];

      items.forEach(item => {
          if (item.type === 'image') {
              newImages.push({ id: Date.now().toString() + Math.random(), url: item.url, caption: 'New Upload' });
          } else {
              newVideos.push({ id: Date.now().toString() + Math.random(), url: item.url, thumbnail: '', title: 'New Upload' });
          }
      });

      updateGalleryData({ ...galleryData, images: newImages, videos: newVideos });
      alert(`Uploaded ${items.length} items successfully.`);
  };


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

             <button onClick={handleFlushCache} className="text-xs text-orange-400 hover:text-orange-300 underline mr-4" title="Clear local storage and reload">
                Flush Cache
            </button>

             <button onClick={resetToDefaults} className="text-xs text-red-400 hover:text-red-300 underline">
                Reset Data
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-sm text-gray-400 hover:text-white">
                Logout
            </button>
          </div>
        </div>
        <div className="container mx-auto px-6 flex gap-6 text-sm font-semibold overflow-x-auto no-scrollbar">
             {['header', 'hero', 'songs', 'bookings', 'highlights', 'features', 'vibe', 'gallery', 'testimonials', 'food', 'drinks', 'battery', 'footer', 'database'].map((tab) => (
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
        
        {activeTab === 'songs' && (
            <div className="space-y-8">
                <SectionCard title="Song Library Manager" description="Manage your song database. Used by the Song Library page.">
                    <div className="mb-6 flex justify-between items-center">
                        <h4 className="text-lg font-bold text-white">Total Songs: {songs.length}</h4>
                        <button onClick={handleAddSong} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-bold">
                            + Add New Song
                        </button>
                    </div>

                    <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden mb-8">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-200 uppercase bg-zinc-900">
                                <tr>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Artist</th>
                                    <th className="px-4 py-3">Genre</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {songs.slice(0, 20).map(song => (
                                    <tr key={song.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                                        <td className="px-4 py-2">
                                            <input className="bg-transparent border-none text-white w-full focus:ring-0" value={song.title} onChange={e => handleUpdateSong(song.id, 'title', e.target.value)} />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input className="bg-transparent border-none text-white w-full focus:ring-0" value={song.artist} onChange={e => handleUpdateSong(song.id, 'artist', e.target.value)} />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input className="bg-transparent border-none text-white w-full focus:ring-0" value={song.genre} onChange={e => handleUpdateSong(song.id, 'genre', e.target.value)} />
                                        </td>
                                        <td className="px-4 py-2">
                                            <button onClick={() => handleDeleteSong(song.id)} className="text-red-500 hover:text-red-400 font-bold">X</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {songs.length > 20 && <div className="p-2 text-center text-xs text-gray-500">Showing first 20 of {songs.length} songs...</div>}
                    </div>

                    <div className="border-t border-zinc-800 pt-6">
                        <h4 className="text-sm font-bold text-white mb-2">Bulk Import Songs</h4>
                        <p className="text-xs text-gray-500 mb-2">Paste songs in format: Title, Artist, Genre (one per line)</p>
                        <textarea 
                            className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-xs text-white h-32"
                            placeholder="Bohemian Rhapsody, Queen, Rock&#10;Wonderwall, Oasis, Britpop"
                            value={bulkSongsText}
                            onChange={(e) => setBulkSongsText(e.target.value)}
                        />
                        <button onClick={handleBulkImportSongs} className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold">
                            Import Songs
                        </button>
                    </div>
                </SectionCard>
            </div>
        )}

        {activeTab === 'bookings' && (
            <div className="space-y-8">
                <SectionCard title="Booking Manager" description="View and manage reservations.">
                    <div className="mb-6 flex justify-between items-center">
                        <h4 className="text-lg font-bold text-white">Upcoming Bookings</h4>
                        <button onClick={handleAddBooking} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-bold">
                            + Manual Booking
                        </button>
                    </div>

                    <div className="space-y-4">
                        {bookings.map(booking => (
                            <div key={booking.id} className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                            booking.status === 'confirmed' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                                            booking.status === 'cancelled' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                                            'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                                        }`}>{booking.status}</span>
                                        <h5 className="font-bold text-white">{booking.customerName}</h5>
                                    </div>
                                    <div className="text-sm text-gray-400 flex gap-4">
                                        <span>📅 {booking.date} @ {booking.time}</span>
                                        <span>👥 {booking.guests} ppl</span>
                                        <span>🎤 {booking.room}</span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <select 
                                        className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                                        value={booking.status}
                                        onChange={(e) => handleUpdateBooking(booking.id, 'status', e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <button onClick={() => handleDeleteBooking(booking.id)} className="text-red-500 hover:bg-red-900/20 px-3 py-1 rounded text-xs">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>
        )}

        {/* ... (Existing Tabs: Hero, Highlights, etc. - Rendering Logic Maintained) ... */}
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
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddSlide} className="w-full py-2 border-2 border-dashed border-zinc-700 rounded text-gray-400 hover:border-yellow-400 hover:text-yellow-400 text-sm font-semibold">+ Add New Slide</button>
                        
                        <div className="mt-8 bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                             <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-yellow-400">AI Background Suggestions</h4>
                                </div>
                                <button onClick={handleGenerateBackgrounds} disabled={isGeneratingBackgrounds} className="bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 text-white text-xs font-bold py-2 px-4 rounded-full transition-all flex items-center gap-2">
                                    {isGeneratingBackgrounds ? 'Generating...' : '✨ Generate'}
                                </button>
                             </div>
                             {generatedBackgrounds.length > 0 && (
                                 <div className="grid grid-cols-3 gap-4">
                                     {generatedBackgrounds.map((bg, idx) => (
                                         <div key={idx} className="group relative cursor-pointer" onClick={() => handleHeroChange('slides', [...(heroData.slides || []), bg])}>
                                             <img src={bg} className="w-full h-24 object-cover rounded border-2 border-transparent group-hover:border-yellow-400 transition-all" />
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </div>
                     </div>
                </SectionCard>
            </div>
        )}

        {/* ... (Other existing tabs kept as is, just wrapped in conditionals) ... */}
        {activeTab === 'highlights' && (
             <div className="space-y-8">
                <SectionCard title="Highlights" description="">
                    <InputGroup label="Heading" value={highlightsData.heading} onChange={(v) => handleHighlightsChange('heading', v)} />
                    <ImageField url={highlightsData.mainImageUrl} onUpdate={(v) => handleHighlightsChange('mainImageUrl', v)} />
                </SectionCard>
             </div>
        )}
        
        {activeTab === 'features' && (
             <div className="space-y-8">
                <SectionCard title="Experience" description="">
                     <InputGroup label="Heading" value={featuresData.experience.heading} onChange={(v) => updateFeaturesData({...featuresData, experience: {...featuresData.experience, heading: v}})} />
                </SectionCard>
             </div>
        )}

        {activeTab === 'vibe' && (
            <div className="space-y-8">
                 <SectionCard title="Vibe" description="">
                     <InputGroup label="Heading" value={vibeData.heading} onChange={(v) => updateVibeData({...vibeData, heading: v})} />
                 </SectionCard>
            </div>
        )}
        
        {activeTab === 'gallery' && (
             <div className="space-y-8">
                <SectionCard title="Gallery" description="">
                     <div className="my-6">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Bulk Upload</label>
                        <MultiUploader onUploadComplete={handleBulkUploadComplete} />
                     </div>
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
                                         <input className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-white" value={img.caption} onChange={(e) => { const newImages = [...galleryData.images]; newImages[idx].caption = e.target.value; updateGalleryData({...galleryData, images: newImages}); }} />
                                         <button onClick={() => handleDeleteGalleryImage(idx)} className="text-xs text-red-500 underline">Remove</button>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                     <div className="border-t border-zinc-800 pt-6 mt-6">
                         <div className="flex justify-between items-center mb-6">
                             <h4 className="text-sm font-bold text-gray-300">Videos ({(galleryData.videos || []).length})</h4>
                             <button onClick={handleAddGalleryVideo} className="text-xs bg-purple-500 text-white px-3 py-1.5 rounded font-bold">+ Add Video</button>
                         </div>
                         <div className="grid grid-cols-1 gap-4">
                             {(galleryData.videos || []).map((vid, idx) => (
                                 <div key={vid.id} className="bg-zinc-950/50 p-4 rounded border border-zinc-800">
                                     <div className="flex gap-4 mb-4">
                                         <div className="flex-1 space-y-3">
                                             <InputGroup label="Video Title" value={vid.title} onChange={(v) => handleUpdateVideo(idx, 'title', v)} />
                                             <InputGroup label="Video URL" value={vid.url} onChange={(v) => handleUpdateVideo(idx, 'url', v)} />
                                         </div>
                                     </div>
                                     <button onClick={() => handleDeleteGalleryVideo(idx)} className="text-xs text-red-500 underline">Remove Video</button>
                                 </div>
                             ))}
                         </div>
                     </div>
                </SectionCard>
             </div>
        )}

        {activeTab === 'testimonials' && (
            <div className="space-y-8">
                <SectionCard title="Testimonials" description="">
                     <InputGroup label="Heading" value={testimonialsData.heading} onChange={(v) => updateTestimonialsData({...testimonialsData, heading: v})} />
                </SectionCard>
            </div>
        )}

        {activeTab === 'battery' && (
            <div className="space-y-8">
                <SectionCard title="Stats" description="">
                    <InputGroup label="Number" value={batteryData.statNumber} onChange={(v) => updateBatteryData({...batteryData, statNumber: v})} />
                </SectionCard>
            </div>
        )}

        {activeTab === 'footer' && (
            <div className="space-y-8">
                <SectionCard title="Footer" description="">
                    <InputGroup label="Heading" value={footerData.ctaHeading} onChange={(v) => updateFooterData({...footerData, ctaHeading: v})} />
                </SectionCard>
            </div>
        )}

        {activeTab === 'food' && (
            <div className="space-y-8">
                {foodMenu.map((category, catIndex) => (
                    <SectionCard key={category.category} title={category.category} description="">
                        {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="mb-4 bg-zinc-950/50 p-4 rounded">
                                <input className="bg-zinc-800 text-white p-2 rounded w-full mb-2" value={item.name} onChange={(e) => handleFoodChange(catIndex, itemIndex, 'name', e.target.value)} />
                                <input className="bg-zinc-800 text-white p-2 rounded w-full" value={item.price} onChange={(e) => handleFoodChange(catIndex, itemIndex, 'price', e.target.value)} />
                            </div>
                        ))}
                    </SectionCard>
                ))}
            </div>
        )}

        {activeTab === 'drinks' && (
             <div className="space-y-8">
                 <SectionCard title="Menu Header" description="">
                     <ImageField url={drinksData.headerImageUrl} onUpdate={(v) => updateDrinksData({...drinksData, headerImageUrl: v})} />
                 </SectionCard>
             </div>
        )}

        {activeTab === 'database' && (
             <div className="space-y-8">
                 <SectionCard title="Database & File Uploads" description="Configure your database connection and server-side file handling.">
                     <div className="space-y-4">
                         <div className="grid md:grid-cols-2 gap-6">
                             <InputGroup label="Database Host" value={dbConfig.host} onChange={(v) => updateDbConfig({...dbConfig, host: v})} />
                             <InputGroup label="Database Name" value={dbConfig.name} onChange={(v) => updateDbConfig({...dbConfig, name: v})} />
                         </div>
                         <div className="grid md:grid-cols-2 gap-6">
                             <InputGroup label="Username" value={dbConfig.user} onChange={(v) => updateDbConfig({...dbConfig, user: v})} />
                             <InputGroup label="Password" value={dbConfig.pass} onChange={(v) => updateDbConfig({...dbConfig, pass: v})} type="password" />
                         </div>
                         <div className="grid md:grid-cols-2 gap-6">
                             <InputGroup label="Photos Folder" value={dbConfig.photoFolder} onChange={(v) => updateDbConfig({...dbConfig, photoFolder: v})} />
                             <InputGroup label="Videos Folder" value={dbConfig.videoFolder} onChange={(v) => updateDbConfig({...dbConfig, videoFolder: v})} />
                         </div>
                         
                         <div className="flex flex-wrap gap-4 mt-6 border-t border-zinc-800 pt-6">
                             <button onClick={handleDownloadSQL} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded border border-zinc-700 text-sm">Download SQL</button>
                             <button onClick={handleDownloadPHP} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded border border-zinc-700 text-sm">Download DB PHP</button>
                             <button onClick={handleDownloadUploadScript} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded border border-zinc-700 text-sm">Download Upload PHP</button>
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
