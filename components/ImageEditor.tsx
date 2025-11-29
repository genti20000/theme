
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

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
            // result is data:..., so we remove the prefix
            resolve((reader.result as string).split(',')[1]);
        } else {
            reject('Failed to read blob');
        }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
});


const ImageEditor: React.FC = () => {
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
  const [error, setError] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
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
        setError('Failed to load image. Please try another file.');
      }
    }
  };
  
  const handleSelectSample = async (imageUrl: string) => {
    try {
        setError(null);
        setGeneratedImage(null);
        setIsLoading(true);
        setSelectedSample(imageUrl);
        
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);

        setOriginalImage({ base64, mimeType: blob.type, url: imageUrl });
    } catch (e) {
        console.error(e);
        setError('Failed to load sample image.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleGenerateEdit = async () => {
    if (!originalImage || !prompt) {
      setError('Please select an image and enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: originalImage.base64,
                mimeType: originalImage.mimeType,
              },
            },
            { text: prompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
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
       if (!foundImage) {
        setError("Couldn't generate an image from the response. The model may have refused the request.");
      }

    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const henPartyPrompt = "A widescreen digital illustration for a glamorous hen party at London Karaoke Club in Soho. Energetic, cheeky, and elegant. A modern neon-lit karaoke room with rose-gold accents, pink and black mood lighting, and a sparkling disco ambiance. Include champagne flutes, diamond rings, glittering microphones, and party decor. Stylish women are mid-song, dancing, laughing, and celebrating. Cinematic composition with high contrast lighting. Widescreen landscape format (16:9).";

  const handleGenerateIllustration = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setOriginalImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: henPartyPrompt }],
        },
        config: {
          responseModalities: [Modality.IMAGE],
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
      if (!foundImage) {
        setError("Couldn't generate an illustration. The model may have refused the request.");
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the illustration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateProImage = async () => {
      if (!prompt) {
          setError('Please enter a prompt.');
          return;
      }
      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);
      
      try {
          // Check for API Key selection (Required for Gemini 3 Pro Image)
          const win = window as any;
          if (win.aistudio?.hasSelectedApiKey) {
              const hasKey = await win.aistudio.hasSelectedApiKey();
              if (!hasKey) {
                  await win.aistudio.openSelectKey();
              }
          }

          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
          const response = await ai.models.generateContent({
              model: 'gemini-3-pro-image-preview',
              contents: {
                  parts: [{ text: prompt }],
              },
              config: {
                  imageConfig: {
                      imageSize: imageSize,
                  }
              }
          });

          let foundImage = false;
          // Note: Response might contain text parts too, iterate to find image
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  const base64ImageBytes: string = part.inlineData.data;
                  setGeneratedImage(`data:image/png;base64,${base64ImageBytes}`);
                  foundImage = true;
                  break;
              }
          }
           if (!foundImage) {
            setError("Couldn't generate an image. The model may have refused the request.");
          }

      } catch (e: any) {
        console.error(e);
        if (e.message && e.message.includes('Requested entity was not found')) {
            setError('API Key session expired or invalid. Please select your key again.');
            const win = window as any;
            if (win.aistudio?.openSelectKey) {
                await win.aistudio.openSelectKey();
            }
       } else {
           setError('An error occurred while generating the image. Please try again.');
       }
      } finally {
          setIsLoading(false);
      }
  };

  const handleGenerateVideo = async () => {
    // Prompt is required if no image is provided, but we can make it flexible
    if (!prompt && !originalImage) {
      setError('Please enter a prompt or upload an image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedVideo(null);

    try {
        // API Key selection for Veo
        const win = window as any;
        if (win.aistudio?.hasSelectedApiKey) {
            const hasKey = await win.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await win.aistudio.openSelectKey();
            }
        }

        // Create new instance to ensure key is fresh
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        const params: any = {
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt || 'A video based on the image', // Fallback prompt if image provided
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio
            }
        };

        if (originalImage) {
            params.image = {
                imageBytes: originalImage.base64,
                mimeType: originalImage.mimeType
            };
        }

        let operation = await ai.models.generateVideos(params);

        // Polling loop
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
            operation = await ai.operations.getVideosOperation({operation: operation});
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
            // Fetch the actual video bytes using the URI and API key
            const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
            if (!response.ok) throw new Error('Failed to download video');
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setGeneratedVideo(url);
        } else {
            throw new Error('No video URI returned from generation.');
        }

    } catch (e: any) {
        console.error(e);
        if (e.message && e.message.includes('Requested entity was not found')) {
             setError('API Key session expired or invalid. Please select your key again.');
             const win = window as any;
             if (win.aistudio?.openSelectKey) {
                 await win.aistudio.openSelectKey();
             }
        } else {
            setError('An error occurred while generating the video. Please try again.');
        }
    } finally {
        setIsLoading(false);
    }
  };


  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `${mode === 'illustrator' ? 'hen-party-illustration' : 'generated-image'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = 'karaoke-video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetState = () => {
    setPrompt('');
    setOriginalImage(null);
    setGeneratedImage(null);
    setGeneratedVideo(null);
    setError(null);
    setSelectedSample(null);
  };

  return (
    <section className="relative py-16 md:py-24" style={{backgroundImage: "url('https://picsum.photos/seed/darkclub/1600/900')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400">AI Creative Studio</h3>
            <p className="text-lg md:text-xl text-gray-300 mt-4">
                Edit photos, create party art, or generate stunning videos for your night out.
            </p>
            </div>

            <div className="flex justify-center mb-8">
            <div className="bg-black/50 p-1.5 rounded-full flex gap-2 flex-wrap justify-center">
                <button 
                onClick={() => { setMode('editor'); resetState(); }} 
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'editor' ? 'bg-yellow-400 text-black' : 'text-white hover:bg-zinc-700'}`}
                >
                Photo Editor
                </button>
                <button 
                onClick={() => { setMode('illustrator'); resetState(); }} 
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'illustrator' ? 'bg-yellow-400 text-black' : 'text-white hover:bg-zinc-700'}`}
                >
                Hen Party
                </button>
                <button 
                onClick={() => { setMode('pro'); resetState(); }} 
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'pro' ? 'bg-yellow-400 text-black' : 'text-white hover:bg-zinc-700'}`}
                >
                Pro Generator
                </button>
                <button 
                onClick={() => { setMode('video'); resetState(); }} 
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'video' ? 'bg-yellow-400 text-black' : 'text-white hover:bg-zinc-700'}`}
                >
                Video Maker
                </button>
            </div>
            </div>

            {mode === 'editor' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Controls */}
                <div className="bg-black/70 backdrop-blur-md p-8 rounded-2xl flex flex-col gap-6 border border-zinc-700">
                    <div>
                    <label className="block text-lg font-semibold mb-3 text-gray-200">1. Choose an Image</label>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {sampleImages.map((img) => (
                        <button key={img.url} onClick={() => handleSelectSample(img.url)} className={`relative rounded-lg overflow-hidden border-2 transition-all ${selectedSample === img.url ? 'border-pink-500 scale-105' : 'border-zinc-700 hover:border-pink-400'}`}>
                            <img src={img.url} alt={img.name} className="aspect-square object-cover" />
                            <div className="absolute inset-0 bg-black/40"></div>
                            <span className="absolute bottom-2 left-2 text-white text-xs font-bold">{img.name}</span>
                        </button>
                        ))}
                    </div>
                    <button onClick={() => fileInputRef.current?.click()} className="w-full text-center bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors">
                        Or Upload Your Own
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
                    </div>

                    <div>
                    <label htmlFor="prompt-input" className="block text-lg font-semibold mb-3 text-gray-200">2. Describe Your Edit</label>
                    <textarea
                        id="prompt-input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'Add a retro 80s filter', 'Make the background a futuristic cityscape', 'Change the microphone to gold'"
                        className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow"
                        rows={4}
                    />
                    </div>
                    
                    <button onClick={handleGenerateEdit} disabled={isLoading || !originalImage || !prompt} className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-black text-lg font-bold py-3 px-4 rounded-full transition-all duration-300 ease-in-out hover:scale-105 disabled:hover:scale-100 flex items-center justify-center">
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : '✨ Generate Edit'}
                    </button>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                </div>

                {/* Image Display */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                        <h4 className="text-xl font-bold mb-3 text-gray-300">Before</h4>
                        <div className="aspect-square w-full bg-black/50 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-700">
                            {originalImage ? (
                                <img src={originalImage.url} alt="Original" className="w-full h-full object-contain" />
                            ) : <p className="text-gray-500">Select an image</p>}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="text-xl font-bold mb-3 text-gray-300">After</h4>
                        <div className="aspect-square w-full bg-black/50 rounded-lg flex items-center justify-center overflow-hidden relative border border-zinc-700">
                            {isLoading && <p className="text-gray-400">Generating...</p>}
                            {!isLoading && generatedImage && (
                                <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                            )}
                            {!isLoading && !generatedImage && <p className="text-gray-500">Your edit will appear here</p>}
                        </div>
                        {generatedImage && !isLoading && (
                            <div className="mt-4 text-center">
                                <button onClick={handleDownload} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-transform duration-300 ease-in-out hover:scale-105">
                                    Download Image
                                </button>
                                <p className="text-xs text-gray-400 mt-2">Tag #LondonKaraokeClub</p>
                            </div>
                        )}
                    </div>
                </div>
                </div>
            )}

            {mode === 'illustrator' && (
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    <div className="w-full bg-black/70 backdrop-blur-md border border-zinc-700 p-8 rounded-2xl flex flex-col items-center gap-6">
                    <h4 className="text-2xl font-bold text-center">Your Custom Hen Party Artwork</h4>
                    <p className="text-gray-400 text-center max-w-lg">Click the button below to generate a unique, glamorous, and widescreen illustration for your event—perfect for sharing online or using as a keepsake!</p>
                    <button onClick={handleGenerateIllustration} disabled={isLoading} className="w-full max-w-xs bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-black text-lg font-bold py-3 px-4 rounded-full transition-all duration-300 ease-in-out hover:scale-105 disabled:hover:scale-100 flex items-center justify-center">
                        {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                        ) : '✨ Generate Illustration'}
                    </button>
                    {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
                    </div>

                    <div className="w-full mt-8">
                    <div className="aspect-video w-full bg-black/50 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-700">
                        {isLoading && <p className="text-gray-400">Generating your masterpiece...</p>}
                        {!isLoading && generatedImage && (
                            <img src={generatedImage} alt="Generated Hen Party Illustration" className="w-full h-full object-contain" />
                        )}
                        {!isLoading && !generatedImage && <p className="text-gray-500">Your illustration will appear here</p>}
                    </div>
                    {generatedImage && !isLoading && (
                        <div className="mt-4 text-center">
                            <button onClick={handleDownload} className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-transform duration-300 ease-in-out hover:scale-105">
                                Download Illustration
                            </button>
                        </div>
                    )}
                    </div>
                </div>
            )}

            {mode === 'pro' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="bg-black/70 backdrop-blur-md p-8 rounded-2xl flex flex-col gap-6 border border-zinc-700">
                        <div>
                             <h4 className="text-2xl font-bold mb-2">Pro Image Generator</h4>
                             <p className="text-gray-400 text-sm mb-6">Create high-quality images using the advanced Nano Banana Pro model.</p>
                             
                             <label className="block text-sm font-semibold mb-2 text-gray-200">Image Size</label>
                             <div className="flex gap-4 mb-6">
                                 {['1K', '2K', '4K'].map((size) => (
                                     <button
                                         key={size}
                                         onClick={() => setImageSize(size as any)}
                                         className={`flex-1 py-2 px-4 rounded-lg font-bold border transition-all ${imageSize === size ? 'bg-pink-600 border-pink-500 text-white' : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:bg-zinc-700'}`}
                                     >
                                         {size}
                                     </button>
                                 ))}
                             </div>

                             <label className="block text-sm font-semibold mb-2 text-gray-200">Prompt</label>
                             <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the image you want to generate in detail..."
                                className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow mb-6"
                            />

                            <button onClick={handleGenerateProImage} disabled={isLoading || !prompt} className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-black text-lg font-bold py-3 px-4 rounded-full transition-all duration-300 ease-in-out hover:scale-105 disabled:hover:scale-100 flex items-center justify-center">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : '✨ Generate Pro Image'}
                            </button>
                            {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
                        </div>
                   </div>

                   <div className="flex flex-col items-center justify-center">
                        <div className="aspect-square w-full bg-black/50 rounded-lg flex items-center justify-center overflow-hidden relative border border-zinc-700">
                            {isLoading && <p className="text-gray-400 animate-pulse">Designing your {imageSize} image...</p>}
                            {!isLoading && generatedImage && (
                                <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                            )}
                            {!isLoading && !generatedImage && <p className="text-gray-500">Your pro image will appear here</p>}
                        </div>
                        {generatedImage && !isLoading && (
                            <div className="mt-4 text-center w-full">
                                <button onClick={handleDownload} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-transform duration-300 ease-in-out hover:scale-105">
                                    Download {imageSize} Image
                                </button>
                            </div>
                        )}
                   </div>
                </div>
            )}

            {mode === 'video' && (
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    <div className="w-full bg-black/70 backdrop-blur-md border border-zinc-700 p-8 rounded-2xl flex flex-col gap-6">
                        <h4 className="text-2xl font-bold text-center">Video Maker (Veo)</h4>
                        <p className="text-gray-400 text-center max-w-lg mx-auto">Upload a photo to animate it, or describe a scene to generate a video from scratch.</p>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-200">1. Upload Image (Optional)</label>
                                <button onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-zinc-600 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-colors bg-zinc-800/50">
                                    {originalImage ? (
                                        <img src={originalImage.url} className="h-full w-full object-contain rounded-lg" />
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Click to Upload</span>
                                        </>
                                    )}
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
                                {originalImage && <button onClick={() => setOriginalImage(null)} className="text-xs text-red-400 mt-2 underline text-center w-full">Remove Image</button>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-200">2. Video Settings</label>
                                <div className="flex gap-2 mb-4">
                                     <button onClick={() => setAspectRatio('16:9')} className={`flex-1 py-1.5 px-3 rounded text-sm font-semibold border ${aspectRatio === '16:9' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-zinc-700 text-gray-400'}`}>Landscape (16:9)</button>
                                     <button onClick={() => setAspectRatio('9:16')} className={`flex-1 py-1.5 px-3 rounded text-sm font-semibold border ${aspectRatio === '9:16' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-zinc-700 text-gray-400'}`}>Portrait (9:16)</button>
                                </div>

                                <label className="block text-sm font-semibold mb-2 text-gray-200">3. Prompt</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={originalImage ? "Describe how to animate this image..." : "Describe the video you want to create..."}
                                    className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow resize-none text-sm"
                                />
                            </div>
                        </div>

                        <button onClick={handleGenerateVideo} disabled={isLoading || (!prompt && !originalImage)} className="w-full max-w-md mx-auto bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-black text-lg font-bold py-3 px-4 rounded-full transition-all duration-300 ease-in-out hover:scale-105 disabled:hover:scale-100 flex items-center justify-center">
                            {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Video...
                            </>
                            ) : '🎬 Generate Video'}
                        </button>
                        {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
                        <p className="text-xs text-gray-500 text-center">Video generation takes a minute or two. Please be patient!</p>
                    </div>

                    <div className="w-full mt-8">
                        <div className={`w-full bg-black/50 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-700 relative ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-w-sm mx-auto'}`}>
                            {isLoading && (
                                <div className="text-center p-8">
                                    <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-400 animate-pulse">Creating your video... this may take a moment.</p>
                                </div>
                            )}
                            {!isLoading && generatedVideo && (
                                <video controls autoPlay loop className="w-full h-full object-contain">
                                    <source src={generatedVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            {!isLoading && !generatedVideo && <p className="text-gray-500">Your generated video will appear here</p>}
                        </div>
                        {generatedVideo && !isLoading && (
                            <div className="mt-4 text-center">
                                <button onClick={handleDownload} className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-transform duration-300 ease-in-out hover:scale-105">
                                    Download Video
                                </button>
                                <p className="text-xs text-gray-400 mt-2">Share your creation with #LKCVideoMagic</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    </section>
  );
};

export default ImageEditor;
