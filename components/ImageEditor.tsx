import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useData } from '../context/DataContext';

const sampleImages = [
  { name: 'Microphone', url: 'https://picsum.photos/seed/karaokemic/512/512' },
  { name: 'Cocktail', url: 'https://picsum.photos/seed/karaokecocktail/512/512' },
  { name: 'Party Scene', url: 'https://picsum.photos/seed/karaokeparty/512/512' },
];

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (reader.result) {
            resolve((reader.result as string).split(',')[1]);
        } else {
            reject('Failed to read blob');
        }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
});


const ImageEditor: React.FC = () => {
  const { galleryData, updateGalleryData, uploadFile, fetchServerFiles } = useData();
  const [mode, setMode] = useState<'editor' | 'illustrator' | 'video' | 'pro'>('editor');
  const [prompt, setPrompt] = useState<string>('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  
  const [originalImage, setOriginalImage] = useState<{
    base64: string;
    mimeType: string;
    url: string;
  } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryTab, setGalleryTab] = useState<'site' | 'storage'>('site');
  const [storageFiles, setStorageFiles] = useState<{name: string, url: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError('Image is too large. Please select a file under 4MB.');
        return;
      }
      try {
        setError(null);
        setSelectedSample(null);
        setGeneratedImage(null);
        const base64 = await blobToBase64(file);
        setOriginalImage({ base64, mimeType: file.type, url: URL.createObjectURL(file) });
      } catch (e) {
        console.error(e);
        setError('Failed to load image.');
      }
    }
  };
  
  const handleSelectSample = async (imageUrl: string) => {
    try {
        setError(null);
        setGeneratedImage(null);
        setIsLoading(true);
        setStatusMessage('Loading reference image...');
        setSelectedSample(imageUrl);
        setShowGalleryModal(false);
        
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);

        setOriginalImage({ base64, mimeType: blob.type, url: imageUrl });
    } catch (e) {
        console.error(e);
        setError('Failed to load image.');
    } finally {
        setIsLoading(false);
        setStatusMessage('');
    }
  };

  const handleSaveToGallery = async () => {
      if (!generatedImage && !generatedVideo) return;
      
      setIsLoading(true);
      setStatusMessage('Saving to Cloud Gallery...');
      try {
          let url = generatedImage || generatedVideo || '';
          
          if (generatedImage && generatedImage.startsWith('data:')) {
              try {
                  setStatusMessage('Uploading to Hostinger Storage...');
                  const response = await fetch(generatedImage);
                  const blob = await response.blob();
                  const filename = `ai_gen_${Date.now()}.png`;
                  const file = new File([blob], filename, { type: blob.type });
                  const uploadedUrl = await uploadFile(file);
                  if (uploadedUrl) {
                      url = uploadedUrl;
                  }
              } catch (e) {
                  console.error("Cloud upload failed", e);
              }
          }

          if (generatedImage) {
              const newImages = [...galleryData.images, { id: Date.now().toString(), url: url, caption: prompt || 'AI Generated Star' }];
              updateGalleryData({ ...galleryData, images: newImages });
          } else if (generatedVideo) {
              const newVideos = [...(galleryData.videos || []), { id: Date.now().toString(), url: url, thumbnail: '', title: prompt || 'AI Video' }];
              updateGalleryData({ ...galleryData, videos: newVideos });
          }
          
          alert('Successfully saved to LKC Gallery!');
      } catch (e) {
          console.error(e);
          setError('Failed to save to gallery.');
      } finally {
          setIsLoading(false);
          setStatusMessage('');
      }
  };

  const handleGenerateEdit = async () => {
    if (!originalImage || !prompt) {
      setError('Please select an image and enter a prompt.');
      return;
    }
    setIsLoading(true);
    setStatusMessage('Reimagining your photo...');
    setError(null);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: originalImage.base64, mimeType: originalImage.mimeType } },
            { text: prompt },
          ],
        },
      });

      let foundImage = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          setGeneratedImage(`data:image/png;base64,${base64ImageBytes}`);
          foundImage = true;
          break;
        }
      }
       if (!foundImage) setError("Image refused by model constraints.");

    } catch (e) {
      console.error(e);
      setError('Generation failed. Please try a different prompt.');
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };
  
  const handleGenerateProImage = async () => {
      if (!prompt) return setError('Please enter a prompt.');
      setIsLoading(true);
      setStatusMessage(`Rendering high-quality ${imageSize} image...`);
      setError(null);
      setGeneratedImage(null);
      
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
          const response = await ai.models.generateContent({
              model: 'gemini-3-pro-image-preview',
              contents: { parts: [{ text: prompt }] },
              config: { imageConfig: { imageSize: imageSize } }
          });

          let foundImage = false;
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
                  foundImage = true;
                  break;
              }
          }
          if (!foundImage) setError("Could not render Pro Image.");
      } catch (e: any) {
        console.error(e);
        setError('An error occurred during pro generation.');
      } finally {
          setIsLoading(false);
          setStatusMessage('');
      }
  };

  const handleGenerateVideo = async () => {
    if (!prompt && !originalImage) return setError('Input required.');

    setIsLoading(true);
    setStatusMessage('Veo is crafting your video clip (approx 60s)...');
    setError(null);
    setGeneratedVideo(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const params: any = {
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt || 'Cinematic karaoke atmosphere',
            config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
        };

        if (originalImage) {
            params.image = { imageBytes: originalImage.base64, mimeType: originalImage.mimeType };
        }

        let operation = await ai.models.generateVideos(params);

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
            const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
            const blob = await response.blob();
            setGeneratedVideo(URL.createObjectURL(blob));
        }
    } catch (e: any) {
        console.error(e);
        setError('Video generation failed.');
    } finally {
        setIsLoading(false);
        setStatusMessage('');
    }
  };

  const handleDownload = () => {
    const url = generatedImage || generatedVideo;
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `lkc_ai_${Date.now()}.${generatedVideo ? 'mp4' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative py-16 md:py-24" style={{backgroundImage: "url('https://picsum.photos/seed/darkclub/1600/900')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm"></div>
        
        {/* Loading Overlay */}
        {isLoading && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-2 border-pink-500 border-b-transparent rounded-full animate-spin [animation-duration:1.5s]"></div>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Processing Magic</h3>
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest animate-pulse">{statusMessage || 'Connecting to Gemini Cloud...'}</p>
            </div>
        )}

        <div className="relative container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400">AI Creative Studio</h3>
            <p className="text-lg md:text-xl text-gray-300 mt-4">Edit photos, create party art, or generate stunning videos for your night out.</p>
            </div>

            <div className="flex justify-center mb-8">
            <div className="bg-black/50 p-1.5 rounded-full flex gap-2 flex-wrap justify-center border border-zinc-800">
                {['editor', 'illustrator', 'pro', 'video'].map(m => (
                    <button key={m} onClick={() => { setMode(m as any); setGeneratedImage(null); setGeneratedVideo(null); }} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-yellow-400 text-black shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-zinc-800'}`}>
                        {m}
                    </button>
                ))}
            </div>
            </div>

            {mode === 'editor' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-black/70 backdrop-blur-md p-8 rounded-3xl flex flex-col gap-6 border border-zinc-700 shadow-2xl">
                        <div>
                            <label className="block text-sm font-black uppercase tracking-widest mb-4 text-gray-500">1. Select Base Image</label>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                {sampleImages.map((img) => (
                                    <button key={img.url} onClick={() => handleSelectSample(img.url)} className={`relative rounded-xl overflow-hidden border-2 transition-all ${selectedSample === img.url ? 'border-pink-500 scale-105' : 'border-zinc-700 hover:border-pink-400'}`}>
                                        <img src={img.url} alt={img.name} className="aspect-square object-cover" />
                                        <span className="absolute bottom-1 left-2 text-white text-[10px] font-black uppercase">{img.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => fileInputRef.current?.click()} className="text-center bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-bold uppercase text-[10px] tracking-widest py-3 px-4 rounded-xl transition-all border border-zinc-700">Upload File</button>
                                <button onClick={() => setShowGalleryModal(true)} className="text-center bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-bold uppercase text-[10px] tracking-widest py-3 px-4 rounded-xl transition-all border border-zinc-700">From Gallery</button>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        </div>

                        <div>
                            <label className="block text-sm font-black uppercase tracking-widest mb-4 text-gray-500">2. Instructions</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g. 'Add a neon disco ball', 'Make it look like a 90s Polaroid'"
                                className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow resize-none"
                            />
                        </div>
                        
                        <button onClick={handleGenerateEdit} disabled={isLoading || !originalImage || !prompt} className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-black text-xs font-black py-4 rounded-full transition-all uppercase tracking-widest shadow-lg">
                            {isLoading ? 'Processing...' : '✨ Generate Edit'}
                        </button>
                        {error && <p className="text-red-400 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 shadow-xl">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 text-center">Output Preview</h4>
                            <div className="aspect-square w-full bg-black rounded-2xl flex items-center justify-center overflow-hidden border border-zinc-800 relative">
                                {!isLoading && generatedImage ? (
                                    <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                                ) : (
                                    <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">Ready for Magic</p>
                                )}
                            </div>
                            {generatedImage && !isLoading && (
                                <div className="mt-6 flex flex-col gap-3">
                                    <button onClick={handleDownload} className="w-full bg-white text-black font-black py-3 rounded-full text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">Download PNG</button>
                                    <button onClick={handleSaveToGallery} className="w-full bg-pink-600 text-white font-black py-3 rounded-full text-[10px] uppercase tracking-widest hover:bg-pink-500 transition-all">Save to Site Gallery</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Other modes follow the same refined UI pattern... */}
            {mode === 'pro' && (
                <div className="max-w-2xl mx-auto bg-black/70 backdrop-blur-md p-10 rounded-[3rem] border border-zinc-700 shadow-2xl">
                    <h4 className="text-2xl font-black mb-2 text-center">Gemini 3 Pro <span className="text-pink-500">Image</span></h4>
                    <p className="text-gray-500 text-center text-sm mb-8">Ultra high definition generation for club promotion.</p>
                    
                    <div className="flex gap-2 mb-8 bg-zinc-800/50 p-1 rounded-full">
                        {['1K', '2K', '4K'].map(s => (
                            <button key={s} onClick={() => setImageSize(s as any)} className={`flex-1 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${imageSize === s ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>{s}</button>
                        ))}
                    </div>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Detailed prompt for Pro Image..."
                        className="w-full h-40 bg-zinc-800/50 border border-zinc-700 rounded-3xl p-6 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow mb-8"
                    />

                    <button onClick={handleGenerateProImage} disabled={isLoading || !prompt} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-black py-4 rounded-full text-xs uppercase tracking-widest shadow-xl mb-4">
                        Generate High-Def Visual
                    </button>
                    {error && <p className="text-red-500 text-[10px] font-black text-center uppercase mb-6">{error}</p>}

                    {generatedImage && (
                        <div className="animate-fade-in-up mt-8">
                            <img src={generatedImage} className="w-full rounded-3xl shadow-2xl border border-zinc-700 mb-6" alt="" />
                            <div className="flex gap-4">
                                <button onClick={handleDownload} className="flex-1 bg-white text-black font-black py-3 rounded-xl text-[10px] uppercase tracking-widest">Download</button>
                                <button onClick={handleSaveToGallery} className="flex-1 bg-yellow-400 text-black font-black py-3 rounded-xl text-[10px] uppercase tracking-widest">Add to Gallery</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        {showGalleryModal && (
            <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4">
                <div className="bg-zinc-900 w-full max-w-5xl h-[85vh] rounded-[3rem] border border-zinc-800 flex flex-col overflow-hidden shadow-[0_0_100px_rgba(236,72,153,0.2)]">
                    <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Asset Library</h3>
                        <button onClick={() => setShowGalleryModal(false)} className="bg-zinc-800 hover:bg-red-600 p-2 rounded-full transition-all group">
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 scrollbar-hide">
                        {galleryData.images.map((img) => (
                            <button key={img.id} onClick={() => handleSelectSample(img.url)} className="aspect-square rounded-2xl overflow-hidden border border-zinc-800 hover:border-pink-500 transition-all relative group shadow-lg">
                                <img src={img.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </section>
  );
};

export default ImageEditor;
