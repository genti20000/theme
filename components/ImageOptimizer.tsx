
import React from 'react';

export interface OptimizationResult {
    blob: Blob;
    originalSize: number;
    optimizedSize: number;
    width: number;
    height: number;
    previewUrl: string;
}

export type PresetType = 'hero' | 'gallery' | 'general';

export const optimizeImage = async (
    file: File, 
    quality: number = 0.85, 
    preset: PresetType = 'general',
    maxWidths: { hero: number, gallery: number, general: number }
): Promise<OptimizationResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                const maxWidth = maxWidths[preset];
                
                // Keep aspect ratio
                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('Canvas context failed');

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) return reject('Blob creation failed');
                    
                    resolve({
                        blob,
                        originalSize: file.size,
                        optimizedSize: blob.size,
                        width,
                        height,
                        previewUrl: URL.createObjectURL(blob)
                    });
                }, 'image/webp', quality);
            };
            img.onerror = () => reject('Image load failed');
        };
        reader.onerror = () => reject('File read failed');
    });
};

interface ImageOptimizerProps {
    file: File;
    onOptimized: (result: OptimizationResult) => void;
    onCancel: () => void;
    quality: number;
    preset: PresetType;
    maxWidths: { hero: number, gallery: number, general: number };
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({ file, onOptimized, onCancel, quality, preset, maxWidths }) => {
    const [result, setResult] = React.useState<OptimizationResult | null>(null);
    const [optimizing, setOptimizing] = React.useState(true);

    React.useEffect(() => {
        optimizeImage(file, quality / 100, preset, maxWidths)
            .then(res => {
                setResult(res);
                setOptimizing(false);
            })
            .catch(err => {
                console.error(err);
                setOptimizing(false);
            });
    }, [file, quality, preset, maxWidths]);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (optimizing) return (
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-center">
            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Optimizing Image...</p>
        </div>
    );

    if (!result) return <div className="p-4 text-red-500">Failed to optimize.</div>;

    const savedPercent = Math.round(((result.originalSize - result.optimizedSize) / result.originalSize) * 100);

    return (
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl animate-fade-in-up">
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Optimization Preview
            </h4>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Original Size</p>
                    <p className="text-sm font-bold text-zinc-400">{formatSize(result.originalSize)}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Optimized (WebP)</p>
                    <p className="text-sm font-bold text-green-500">{formatSize(result.optimizedSize)}</p>
                    <p className="text-[10px] font-bold text-green-500/60">Saved {savedPercent}%</p>
                </div>
            </div>

            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 mb-8">
                <img src={result.previewUrl} className="w-full h-full object-contain" alt="Optimized Preview" />
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={() => onOptimized(result)}
                    className="flex-1 bg-pink-600 hover:bg-pink-500 text-white text-[10px] font-black uppercase py-3 rounded-xl transition-all"
                >
                    Apply Optimization
                </button>
                <button 
                    onClick={onCancel}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-black uppercase py-3 rounded-xl transition-all"
                >
                    Keep Original
                </button>
            </div>
        </div>
    );
};

export default ImageOptimizer;
