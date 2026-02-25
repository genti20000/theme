import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HomeSectionType, PageGalleryKey, useData } from '../context/DataContext';
import { NAV_LABELS, ROUTES } from '../lib/nav';
import { MediaRecord, getMediaKey, getMediaUrl, resolveMedia } from '../lib/media';

const TABS = [
  'Dashboard',
  'Homepage',
  'SEO',
  'Nav',
  'Hero',
  'About',
  'Features',
  'Vibe',
  'Stats',
  'Food',
  'Drinks',
  'Events',
  'Blog',
  'Instagram',
  'FAQ',
  'Info',
  'Gallery',
  'Terms',
  'Config'
] as const;

const HOME_SECTION_TYPES: Array<{ type: HomeSectionType; label: string }> = [
  { type: 'hero', label: 'Hero' },
  { type: 'instagramHighlights', label: 'Instagram' },
  { type: 'highlights', label: 'Highlights' },
  { type: 'features', label: 'Features' },
  { type: 'vibe', label: 'Vibe' },
  { type: 'battery', label: 'Stats' },
  { type: 'testimonials', label: 'Testimonials' },
  { type: 'info', label: 'Info' },
  { type: 'faq', label: 'FAQ' },
  { type: 'drinks', label: 'Drinks' },
  { type: 'gallery', label: 'Gallery' }
];

const labelByType = (type: HomeSectionType) => HOME_SECTION_TYPES.find(s => s.type === type)?.label || type;
const pageGalleryLabels: Record<PageGalleryKey, string> = {
  home: 'Home',
  drinks: 'Drinks',
  food: 'Food',
  blog: 'Blog',
  events: 'Events',
  songs: 'Songs',
  instagram: 'Instagram'
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const isVideoFile = (url: string) => /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url);
const splitLines = (value: string) => value.split('\n').map(v => v.trim()).filter(Boolean);
const normalizeMediaUrl = (url: string) => encodeURI((url || '').trim()).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/#/g, '%23');

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <section className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-5 ${className}`}>
    <h3 className="text-sm font-black uppercase tracking-widest mb-4">{title}</h3>
    {children}
  </section>
);

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<string>('Homepage');
  const [syncStatus, setSyncStatus] = useState<'Idle' | 'Saving' | 'Error'>('Idle');
  const [syncError, setSyncError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState('');
  const [addNavKey, setAddNavKey] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<{ kind: 'blog-image' | 'blog-og' | 'gallery-add' | 'generic'; postId?: string; collectionId?: string } | null>(null);
  const [storageFiles, setStorageFiles] = useState<MediaRecord[]>([]);
  const [selectedGalleryId, setSelectedGalleryId] = useState('');
  const [brokenPreviewUrls, setBrokenPreviewUrls] = useState<Record<string, boolean>>({});
  const [repairRunning, setRepairRunning] = useState(false);
  const [repairSummary, setRepairSummary] = useState<string>('');
  const [lastSyncedPayload, setLastSyncedPayload] = useState<string>(() => localStorage.getItem('lkc_last_synced_payload') || '');
  const [mediaTestKey, setMediaTestKey] = useState('');
  const [mediaTestResult, setMediaTestResult] = useState('');
  const genericMediaSetterRef = useRef<((url: string) => void) | null>(null);

  const {
    heroData,
    updateHeroData,
    foodMenu,
    updateFoodMenu,
    drinksData,
    updateDrinksData,
    eventsData,
    updateEventsData,
    termsData,
    updateTermsData,
    homeSections,
    updateHomeSections,
    homeSectionRepeats,
    updateHomeSectionRepeats,
    adminPassword,
    updateAdminPassword,
    syncUrl,
    updateSyncUrl,
    exportDatabase,
    purgeCache,
    highlightsData,
    updateHighlightsData,
    featuresData,
    updateFeaturesData,
    vibeData,
    updateVibeData,
    batteryData,
    updateBatteryData,
    testimonialsData,
    updateTestimonialsData,
    infoSectionData,
    updateInfoSectionData,
    faqData,
    updateFaqData,
    instagramHighlightsData,
    updateInstagramHighlightsData,
    headerData,
    updateHeaderData,
    blogData,
    updateBlogData,
    galleryData,
    updateGalleryData,
    pageGallerySettings,
    updatePageGallerySettings,
    uploadFile,
    fetchServerFiles,
    repairMediaLibrary,
    cleanupMediaLibrary
  } = useData();

  const selectedSection = useMemo(() => {
    if (!selectedId) return homeSections[0];
    return homeSections.find(s => s.id === selectedId) || homeSections[0];
  }, [homeSections, selectedId]);

  const countsByType = useMemo(() => {
    const counts: Record<string, number> = {};
    homeSections.forEach(section => {
      counts[section.type] = (counts[section.type] || 0) + 1;
    });
    return counts;
  }, [homeSections]);

  const navOrder = headerData.navOrder || ['menu', 'gallery', 'blog', 'drinks', 'events', 'songs'];
  const navCandidates = Object.keys(ROUTES).filter(k => k !== 'home');

  const selectedBlog = useMemo(() => {
    const posts = blogData.posts || [];
    if (posts.length === 0) return null;
    if (!selectedBlogId) return posts[0];
    return posts.find(p => p.id === selectedBlogId) || posts[0];
  }, [blogData.posts, selectedBlogId]);

  const galleryCollections = (galleryData.collections && galleryData.collections.length > 0)
    ? galleryData.collections
    : [{ id: 'default', name: 'Main Gallery', subtext: galleryData.subtext, images: galleryData.images || [], defaultViewMode: 'carousel' as const }];
  const activeGallery = galleryCollections.find(g => g.id === selectedGalleryId)
    || galleryCollections.find(g => g.id === galleryData.activeCollectionId)
    || galleryCollections[0];
  const tabMediaUrls = useMemo(() => {
    const clean = (values: Array<string | undefined>) => Array.from(new Set((values || []).map(v => getMediaUrl(v || '')).filter(Boolean)));
    switch (tab) {
      case 'SEO':
        return clean([headerData.logoUrl, headerData.faviconUrl]);
      case 'Hero':
        return clean([heroData.backgroundImageUrl, ...(heroData.slides || []), ...(heroData.mobileSlides || [])]);
      case 'About':
        return clean([highlightsData.mainImageUrl, highlightsData.mobileMainImageUrl, highlightsData.sideImageUrl]);
      case 'Features':
        return clean([featuresData.experience.image, featuresData.experience.mobileImage, ...(featuresData.grid?.items || []).map(i => i.image)]);
      case 'Vibe':
        return clean([vibeData.videoUrl, vibeData.mobileVideoUrl, vibeData.image1, vibeData.image2, vibeData.bigImage, vibeData.mobileBigImage]);
      case 'Stats':
        return clean((testimonialsData.items || []).map(i => i.avatar));
      case 'Drinks':
        return clean([drinksData.headerImageUrl]);
      case 'Events':
        return clean([eventsData.hero?.image, ...(eventsData.sections || []).map(s => s.imageUrl)]);
      case 'Blog':
        return clean((blogData.posts || []).flatMap(p => [p.imageUrl, p.ogImage]));
      case 'Instagram':
        return clean([...(instagramHighlightsData.highlights || []).map(h => h.imageUrl), ...(instagramHighlightsData.posts || []).map(p => p.imageUrl)]);
      case 'Gallery':
        return clean((activeGallery?.images || []).map(i => i.url));
      default:
        return [];
    }
  }, [tab, headerData.logoUrl, headerData.faviconUrl, heroData.backgroundImageUrl, heroData.slides, heroData.mobileSlides, highlightsData.mainImageUrl, highlightsData.mobileMainImageUrl, highlightsData.sideImageUrl, featuresData.experience.image, featuresData.experience.mobileImage, featuresData.grid, vibeData.videoUrl, vibeData.mobileVideoUrl, vibeData.image1, vibeData.image2, vibeData.bigImage, vibeData.mobileBigImage, testimonialsData.items, drinksData.headerImageUrl, eventsData.hero, eventsData.sections, blogData.posts, instagramHighlightsData.highlights, instagramHighlightsData.posts, activeGallery]);

  useEffect(() => {
    if (!selectedGalleryId && activeGallery?.id) setSelectedGalleryId(activeGallery.id);
  }, [selectedGalleryId, activeGallery]);

  const canAddType = (type: HomeSectionType) => {
    const current = countsByType[type] || 0;
    const max = Math.max(1, Math.min(6, Number(homeSectionRepeats[type] || 1)));
    return current < max;
  };

  const addSection = (type: HomeSectionType) => {
    if (!canAddType(type)) {
      alert(`Max reuse reached for ${labelByType(type)}.`);
      return;
    }
    const next = {
      id: `${type}-${Date.now()}`,
      type,
      title: `${labelByType(type)} Section`,
      enabled: true
    };
    updateHomeSections(prev => [...prev, next]);
    setSelectedId(next.id);
  };

  const duplicateSection = (id: string) => {
    const original = homeSections.find(s => s.id === id);
    if (!original) return;
    if (!canAddType(original.type)) {
      alert(`Max reuse reached for ${labelByType(original.type)}.`);
      return;
    }
    const copy = { ...original, id: `${original.type}-${Date.now()}`, title: `${original.title} Copy` };
    const idx = homeSections.findIndex(s => s.id === id);
    updateHomeSections(prev => {
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    setSelectedId(copy.id);
  };

  const deleteSection = (id: string) => {
    if (!window.confirm('Delete this section?')) return;
    updateHomeSections(prev => prev.filter(s => s.id !== id));
    setSelectedId('');
  };

  const moveSection = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= homeSections.length || to >= homeSections.length) return;
    updateHomeSections(prev => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const handleSync = async (mode: 'save' | 'publish') => {
    if (!syncUrl || !adminPassword) {
      setSyncStatus('Error');
      setSyncError('Set sync URL and admin key first.');
      return;
    }
    const payload = exportDatabase();
    if (!payload || payload.trim().length < 3) {
      setSyncStatus('Error');
      setSyncError('Cannot save empty payload.');
      return;
    }
    if (payload === lastSyncedPayload) {
      setSyncStatus('Idle');
      setSyncError('No changes to save.');
      return;
    }
    setSyncStatus('Saving');
    setSyncError('');
    try {
      const response = await fetch(syncUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: payload
      });

      if (response.status === 401) {
        setSyncStatus('Error');
        setSyncError('Unauthorized (401). Re-enter admin key.');
        setIsAuthenticated(false);
        return;
      }

      if (!response.ok) {
        setSyncStatus('Error');
        setSyncError(`Sync failed (${response.status}).`);
        return;
      }

      const data = await response.json().catch(() => ({}));
      if (data && data.success === false) {
        setSyncStatus('Error');
        setSyncError(data.error || 'Sync failed.');
        return;
      }

      setLastSyncedPayload(payload);
      localStorage.setItem('lkc_last_synced_payload', payload);
      setSyncStatus('Idle');
      if (mode === 'publish') {
        window.open('/', '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      setSyncStatus('Error');
      setSyncError(`Sync failed: ${String(error)}`);
    }
  };

  const sectionVisible = (type: HomeSectionType) => {
    if (type === 'instagramHighlights') return instagramHighlightsData.enabled !== false;
    if (type === 'highlights') return highlightsData.enabled !== false;
    if (type === 'features') return featuresData.enabled !== false;
    if (type === 'vibe') return vibeData.enabled !== false;
    if (type === 'battery') return batteryData.enabled !== false;
    if (type === 'testimonials') return testimonialsData.enabled !== false;
    if (type === 'info') return infoSectionData.enabled !== false;
    if (type === 'faq') return faqData.enabled !== false;
    return true;
  };

  const updateBlogPost = (id: string, patch: Record<string, any>) => {
    updateBlogData(prev => ({
      ...prev,
      posts: prev.posts.map(post => post.id === id ? { ...post, ...patch } : post)
    }));
  };

  const ensureUniqueSlug = (title: string, currentId: string) => {
    const base = slugify(title || 'post');
    let candidate = base;
    let i = 1;
    const used = new Set((blogData.posts || []).filter(p => p.id !== currentId).map(p => p.slug || slugify(p.title)));
    while (used.has(candidate)) {
      candidate = `${base}-${i}`;
      i += 1;
    }
    return candidate;
  };

  const refreshStorageFiles = async () => {
    try {
      const files = await fetchServerFiles();
      setStorageFiles(files);
      setBrokenPreviewUrls({});
      if (files.length === 0) {
        const probe = await fetch(`${syncUrl}?list=1`, {
          headers: { Authorization: `Bearer ${adminPassword}` }
        });
        const probeData = await probe.json().catch(() => ({}));
        if (probe.status === 401 || String(probeData?.error || '').toLowerCase().includes('auth')) {
          setIsAuthenticated(false);
          setSyncError('Unauthorized (401). Re-enter admin key.');
          return;
        }
        setSyncError('No server files found. Upload one to get started.');
      } else {
        setSyncError('');
      }
    } catch {
      setStorageFiles([]);
      setSyncError('Failed to load server files.');
    }
  };

  const runRepairJob = async () => {
    setRepairRunning(true);
    setRepairSummary('');
    const result = await repairMediaLibrary();
    if (!result.ok || !result.report) {
      setSyncStatus('Error');
      setSyncError(result.error || 'Media repair failed. Check server logs and auth.');
      setRepairRunning(false);
      return;
    }
    const report = result.report;
    const summary = `Scanned ${report.totalScanned}, fixed URLs ${report.fixedUrls}, generated thumbs ${report.thumbnailsGenerated}, marked broken ${report.brokenMarked}, skipped ${report.skipped}`;
    setRepairSummary(summary);
    setSyncError('');
    await refreshStorageFiles();
    setRepairRunning(false);
  };

  const runCleanupJob = async () => {
    setRepairRunning(true);
    setRepairSummary('');
    const result = await cleanupMediaLibrary();
    if (!result.ok) {
      setSyncStatus('Error');
      setSyncError(result.error || 'Media cleanup failed.');
      setRepairRunning(false);
      return;
    }
    setRepairSummary('Cleanup completed. Invalid blob/broken records removed.');
    setSyncError('');
    await refreshStorageFiles();
    setRepairRunning(false);
  };

  const openMediaModal = async (
    target: { kind: 'blog-image' | 'blog-og' | 'gallery-add' | 'generic'; postId?: string; collectionId?: string },
    genericSetter?: (url: string) => void
  ) => {
    if (target.kind === 'generic') genericMediaSetterRef.current = genericSetter || null;
    setMediaTarget(target);
    setIsMediaModalOpen(true);
    await refreshStorageFiles();
  };

  const unlockWithKey = async () => {
    const nextKey = passInput.trim();
    if (!nextKey) {
      setSyncError('Enter admin key.');
      return;
    }
    setSyncStatus('Saving');
    setSyncError('');
    try {
      const response = await fetch(`${syncUrl}?list=1`, {
        headers: { Authorization: `Bearer ${nextKey}` }
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401 || data?.success === false) {
        setSyncStatus('Error');
        setSyncError(data?.error || 'Unauthorized (401).');
        setIsAuthenticated(false);
        return;
      }
      if (!response.ok) {
        setSyncStatus('Error');
        setSyncError(`Auth check failed (${response.status}).`);
        return;
      }
      updateAdminPassword(nextKey);
      setIsAuthenticated(true);
      setSyncStatus('Idle');
      setSyncError('');
    } catch (error) {
      setSyncStatus('Error');
      setSyncError(`Auth check failed: network/CORS error contacting sync URL (${syncUrl}).`);
    }
  };

  const applyMediaSelection = (url: string) => {
    if (!mediaTarget) return;
    if (mediaTarget.kind === 'blog-image' && mediaTarget.postId) {
      updateBlogPost(mediaTarget.postId, { imageUrl: url });
    } else if (mediaTarget.kind === 'blog-og' && mediaTarget.postId) {
      updateBlogPost(mediaTarget.postId, { ogImage: url });
    } else if (mediaTarget.kind === 'gallery-add') {
      const targetCollectionId = mediaTarget.collectionId || activeGallery?.id || 'default';
      updateGalleryData(prev => {
        const collections = (prev.collections && prev.collections.length > 0)
          ? prev.collections
          : [{ id: 'default', name: 'Main Gallery', subtext: prev.subtext, images: prev.images || [], defaultViewMode: 'carousel' as const }];
        const nextCollections = collections.map(col =>
          col.id === targetCollectionId
            ? {
                ...col,
                images: [...(col.images || []), { id: `g-${Date.now()}`, url, caption: col.name }]
              }
            : col
        );
        const nextActive = nextCollections.find(col => col.id === targetCollectionId) || nextCollections[0];
        return { ...prev, collections: nextCollections, activeCollectionId: targetCollectionId, images: nextActive.images };
      });
    } else if (mediaTarget.kind === 'generic') {
      genericMediaSetterRef.current?.(url);
    }
    setIsMediaModalOpen(false);
    setMediaTarget(null);
    genericMediaSetterRef.current = null;
  };

  const uploadToField = async (file: File, onSet: (value: string) => void, errorMessage = 'Upload failed.') => {
    const url = await uploadFile(file);
    if (url) {
      onSet(url);
      setSyncError('');
      return;
    }
    setSyncStatus('Error');
    setSyncError(errorMessage);
  };

  const testMediaUrl = async () => {
    const resolved = getMediaUrl(mediaTestKey);
    if (!resolved) {
      setMediaTestResult('Invalid media key/path (blob or empty).');
      return;
    }
    try {
      const response = await fetch(resolved, { method: 'GET', cache: 'no-store' });
      setMediaTestResult(`Resolved: ${resolved} · HTTP ${response.status}`);
    } catch {
      setMediaTestResult(`Resolved: ${resolved} · fetch failed`);
    }
  };

  const renderMediaField = (
    label: string,
    value: string,
    onSet: (value: string) => void,
    placeholder = 'Image URL'
  ) => (
    <div className="space-y-2">
      <label className="block text-[10px] uppercase font-black text-zinc-500">{label}</label>
      <input
        value={value || ''}
        onChange={(e) => onSet(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <label className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black uppercase cursor-pointer">
          Upload
          <input
            type="file"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await uploadToField(file, onSet, `Upload failed for ${label.toLowerCase()}.`);
            }}
          />
        </label>
        <button
          onClick={() => openMediaModal({ kind: 'generic' }, onSet)}
          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black uppercase"
        >
          From Server
        </button>
      </div>
      {value && (
        <div className="rounded-xl overflow-hidden border border-zinc-800 bg-black h-32">
          {isVideoFile(value) ? (
            <video src={getMediaUrl(value)} muted playsInline preload="metadata" className="w-full h-full object-cover" />
          ) : (
            <img src={getMediaUrl(value)} alt={label} className="w-full h-full object-cover" />
          )}
        </div>
      )}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-10 shadow-2xl">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">LKC Admin</h2>
          <p className="text-sm text-zinc-400 mb-4">Enter admin key to unlock control room.</p>
          <input
            type="password"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
            placeholder="Admin key"
          />
          <button
            onClick={unlockWithKey}
            className="w-full mt-4 bg-pink-600 hover:bg-pink-500 text-white font-black py-3 rounded-xl uppercase text-sm"
          >
            Unlock
          </button>
          {syncError && <p className="text-xs text-red-400 mt-3">{syncError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-5xl h-[80vh] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest">Media Library</h3>
              <button
                onClick={() => {
                  setIsMediaModalOpen(false);
                  setMediaTarget(null);
                  genericMediaSetterRef.current = null;
                }}
                className="px-3 py-1 rounded-lg bg-zinc-800 text-xs uppercase font-black"
              >
                Close
              </button>
            </div>
            <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
              <label className="px-3 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-xs font-black uppercase cursor-pointer">
                Upload Media
                <input
                  type="file"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadFile(file);
                    if (url) {
                      await refreshStorageFiles();
                      applyMediaSelection(url);
                    } else {
                      setSyncStatus('Error');
                      setSyncError('Upload failed. Check admin key and db.php upload response.');
                    }
                  }}
                />
              </label>
              <button onClick={refreshStorageFiles} className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase">Refresh</button>
              <button
                onClick={runRepairJob}
                disabled={repairRunning}
                className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-xs font-black uppercase"
              >
                {repairRunning ? 'Repairing...' : 'Rebuild Thumbnails / Repair Media'}
              </button>
              <button
                onClick={runCleanupJob}
                disabled={repairRunning}
                className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-xs font-black uppercase"
              >
                Cleanup Broken Records
              </button>
              {repairSummary && <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{repairSummary}</p>}
            </div>
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {storageFiles.map((file, i) => (
                <button
                  key={`${file.id}-${i}`}
                  onClick={() => {
                    const resolved = resolveMedia(file);
                    if (!resolved.resolvedUrl || resolved.status === 'broken') return;
                    applyMediaSelection(resolved.resolvedUrl);
                  }}
                  className={`rounded-xl border bg-zinc-950 overflow-hidden text-left transition-colors ${file.status === 'broken' ? 'border-red-700' : 'border-zinc-800 hover:border-pink-500'}`}
                >
                  <div className="aspect-square w-full bg-black overflow-hidden border-b border-zinc-800">
                    {(() => {
                      const { type, resolvedUrl, thumbUrl, status } = resolveMedia(file);
                      if ((type === 'video') && !brokenPreviewUrls[file.id] && status !== 'broken') {
                        if (thumbUrl) {
                          return (
                            <img
                              src={normalizeMediaUrl(thumbUrl)}
                              alt={file.filename}
                              loading="lazy"
                              className="block w-full h-full object-cover"
                              onError={() => setBrokenPreviewUrls(prev => ({ ...prev, [file.id]: true }))}
                            />
                          );
                        }
                        return (
                          <video
                            src={normalizeMediaUrl(resolvedUrl)}
                            muted
                            playsInline
                            preload="metadata"
                            className="block w-full h-full object-cover"
                            onError={() => setBrokenPreviewUrls(prev => ({ ...prev, [file.id]: true }))}
                          />
                        );
                      }
                      if ((type === 'image') && !brokenPreviewUrls[file.id] && status !== 'broken') {
                        return (
                          <img
                            src={normalizeMediaUrl(resolvedUrl)}
                            alt={file.filename}
                            loading="lazy"
                            className="block w-full h-full object-cover"
                            onError={() => setBrokenPreviewUrls(prev => ({ ...prev, [file.id]: true }))}
                          />
                        );
                      }
                      return (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 text-[10px] font-black uppercase tracking-widest px-2 text-center gap-2">
                          <span>{status === 'broken' ? 'Broken' : 'No Preview'}</span>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              setBrokenPreviewUrls(prev => ({ ...prev, [file.id]: false }));
                              if (status === 'broken') {
                                setSyncError('Invalid media record (blob/missing key). Reupload this item.');
                                await runRepairJob();
                              } else {
                                await refreshStorageFiles();
                              }
                            }}
                            className="px-2 py-1 rounded bg-zinc-800 text-[9px]"
                          >
                            Retry
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 line-clamp-2 break-all">{file.filename}</p>
                    <p className={`mt-1 text-[9px] uppercase tracking-widest ${file.status === 'broken' ? 'text-red-400' : file.status === 'needs_fix' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {file.status}
                    </p>
                  </div>
                </button>
              ))}
              {storageFiles.length === 0 && (
                <div className="col-span-full text-center py-16 text-zinc-500 text-sm">No files on server yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-black uppercase tracking-tighter">Website Admin</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={() => handleSync('save')} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase">Save All Changes</button>
            <button onClick={() => handleSync('publish')} className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-black uppercase">Publish</button>
            <button onClick={() => window.open('/', '_blank', 'noopener,noreferrer')} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase">Preview</button>
            <span className={`px-3 py-2 rounded-xl text-xs font-black uppercase ${syncStatus === 'Saving' ? 'bg-yellow-500/20 text-yellow-300' : syncStatus === 'Error' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {syncStatus}
            </span>
            <button onClick={purgeCache} className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-black uppercase">Reset Local Cache</button>
          </div>
        </div>
        {syncError && <p className="text-xs text-red-400 mt-2">{syncError}</p>}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-[calc(100vh-78px)]">
        <aside className="border-r border-zinc-800 bg-zinc-900 p-4">
          <nav className="space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
            {TABS.map(tabName => (
              <button
                key={tabName}
                onClick={() => setTab(tabName)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${tab === tabName ? 'bg-pink-600 text-white' : 'bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300'}`}
              >
                {tabName}
              </button>
            ))}
          </nav>
        </aside>

        <main className="p-5 lg:p-8">
          <Card title={`Existing Media (${tab})`} className="mb-6">
            {tabMediaUrls.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-2">
                {tabMediaUrls.slice(0, 32).map((url, idx) => (
                  <div key={`${url}-${idx}`} className="rounded-lg overflow-hidden border border-zinc-800 bg-black h-20">
                    {isVideoFile(url) ? (
                      <video src={getMediaUrl(url)} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                    ) : (
                      <img src={getMediaUrl(url)} alt={`media-${idx + 1}`} className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 uppercase tracking-widest">No media fields detected for this tab.</p>
            )}
          </Card>

          {tab === 'Homepage' && (
            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6">
              <div className="space-y-6">
                <Card title="Homepage Builder">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {HOME_SECTION_TYPES.map(typeItem => (
                      <button
                        key={typeItem.type}
                        onClick={() => addSection(typeItem.type)}
                        disabled={!canAddType(typeItem.type)}
                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30"
                      >
                        + {typeItem.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {homeSections.map((section, index) => (
                      <div
                        key={section.id}
                        draggable
                        onDragStart={() => setDragFromIndex(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (dragFromIndex !== null) moveSection(dragFromIndex, index);
                          setDragFromIndex(null);
                        }}
                        onClick={() => setSelectedId(section.id)}
                        className={`p-3 rounded-xl border cursor-move ${selectedSection?.id === section.id ? 'border-pink-500 bg-pink-500/10' : 'border-zinc-800 bg-zinc-800/40'}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest">{section.title}</p>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{labelByType(section.type)}</p>
                          </div>
                          <label className="inline-flex items-center gap-2 text-[10px] uppercase text-zinc-400">
                            Enabled
                            <input
                              type="checkbox"
                              checked={section.enabled}
                              onChange={(e) => updateHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, enabled: e.target.checked } : s))}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {selectedSection && (
                  <Card title="Section Editor">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Title</label>
                        <input
                          value={selectedSection.title}
                          onChange={(e) => updateHomeSections(prev => prev.map(s => s.id === selectedSection.id ? { ...s, title: e.target.value } : s))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Type</label>
                        <select
                          value={selectedSection.type}
                          onChange={(e) => {
                            const nextType = e.target.value as HomeSectionType;
                            if (nextType !== selectedSection.type && !canAddType(nextType)) {
                              alert(`Max reuse reached for ${labelByType(nextType)}.`);
                              return;
                            }
                            updateHomeSections(prev => prev.map(s => s.id === selectedSection.id ? { ...s, type: nextType, title: labelByType(nextType) } : s));
                          }}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
                        >
                          {HOME_SECTION_TYPES.map(typeItem => (
                            <option key={typeItem.type} value={typeItem.type}>{typeItem.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button onClick={() => duplicateSection(selectedSection.id)} className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase">Duplicate</button>
                      <button onClick={() => deleteSection(selectedSection.id)} className="px-3 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-black uppercase">Delete</button>
                    </div>
                  </Card>
                )}

                <Card title="Reuse Limits (1-6)">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {HOME_SECTION_TYPES.map(typeItem => (
                      <div key={typeItem.type} className="bg-zinc-800/40 border border-zinc-700 rounded-xl p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black uppercase">{typeItem.label}</span>
                          <span className="text-[10px] text-zinc-500 uppercase">Used {countsByType[typeItem.type] || 0}</span>
                        </div>
                        <input
                          type="number"
                          min={1}
                          max={6}
                          value={homeSectionRepeats[typeItem.type]}
                          onChange={(e) => {
                            const value = Math.max(1, Math.min(6, Math.floor(Number(e.target.value) || 1)));
                            updateHomeSectionRepeats(prev => ({ ...prev, [typeItem.type]: value }));
                          }}
                          className="w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card title="Live Preview" className="h-fit xl:sticky xl:top-24">
                <div className="space-y-2">
                  {homeSections.map((section, idx) => (
                    <div key={section.id} className={`rounded-lg border p-3 ${section.enabled ? 'border-zinc-700 bg-zinc-800/40' : 'border-zinc-800 bg-zinc-900/50 opacity-50'}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black uppercase tracking-widest">{idx + 1}. {section.title}</p>
                        <span className="text-[10px] uppercase tracking-widest text-zinc-400">{section.enabled && sectionVisible(section.type) ? 'Visible' : 'Hidden'}</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">{labelByType(section.type)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab === 'SEO' && (
            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6">
              <div className="space-y-6">
                <Card title="Global SEO">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Site Title</label>
                      <input value={headerData.siteTitle} onChange={(e) => updateHeaderData(prev => ({ ...prev, siteTitle: e.target.value }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                    </div>
                    {renderMediaField(
                      'Favicon URL',
                      headerData.faviconUrl,
                      (value) => updateHeaderData(prev => ({ ...prev, faviconUrl: value })),
                      'Favicon URL'
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Meta Description</label>
                    <textarea value={headerData.siteDescription} onChange={(e) => updateHeaderData(prev => ({ ...prev, siteDescription: e.target.value }))} rows={5} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  </div>
                  <div className="mt-4">{renderMediaField('Logo URL', headerData.logoUrl, (value) => updateHeaderData(prev => ({ ...prev, logoUrl: value })), 'Logo URL')}</div>
                </Card>

                <Card title="Scripts (Head / Body)">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Head Scripts</label>
                    <textarea
                      value={headerData.customScripts?.header || ''}
                      onChange={(e) => updateHeaderData(prev => ({ ...prev, customScripts: { ...prev.customScripts, header: e.target.value } }))}
                      rows={6}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-green-400"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Body Scripts</label>
                    <textarea
                      value={headerData.customScripts?.footer || ''}
                      onChange={(e) => updateHeaderData(prev => ({ ...prev, customScripts: { ...prev.customScripts, footer: e.target.value } }))}
                      rows={6}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-green-400"
                    />
                  </div>
                  {((headerData.customScripts?.header || '').includes('<script') || (headerData.customScripts?.footer || '').includes('<script')) && (
                    <p className="text-xs text-amber-400 mt-3 uppercase tracking-widest">Warning: script tags detected. Validate third-party injections before publish.</p>
                  )}
                </Card>
              </div>

              <Card title="Live SEO Preview" className="h-fit xl:sticky xl:top-24">
                <p className="text-xs uppercase tracking-widest text-zinc-500">Title</p>
                <p className="text-lg font-bold mt-1">{headerData.siteTitle || 'Untitled page'}</p>
                <p className="text-xs text-zinc-500 mt-3 uppercase tracking-widest">URL</p>
                <p className="text-sm text-emerald-400 mt-1">https://londonkaraoke.club</p>
                <p className="text-sm text-zinc-300 mt-3 leading-relaxed">{headerData.siteDescription || 'No meta description yet.'}</p>
              </Card>
            </div>
          )}

          {tab === 'Nav' && (
            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6">
              <div className="space-y-6">
                <Card title="Navigation Items">
                  <div className="space-y-2">
                    {navOrder.map((key, idx) => (
                      <div key={`${key}-${idx}`} className="bg-zinc-800/40 border border-zinc-700 rounded-xl p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest">{NAV_LABELS[key as keyof typeof NAV_LABELS] || key}</p>
                            <p className="text-[10px] text-zinc-500">{ROUTES[key as keyof typeof ROUTES] || '/'}</p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                if (idx === 0) return;
                                updateHeaderData(prev => {
                                  const next = [...(prev.navOrder || [])];
                                  [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                                  return { ...prev, navOrder: next };
                                });
                              }}
                              className="px-2 py-1 rounded bg-zinc-900 text-xs"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => {
                                if (idx >= navOrder.length - 1) return;
                                updateHeaderData(prev => {
                                  const next = [...(prev.navOrder || [])];
                                  [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                                  return { ...prev, navOrder: next };
                                });
                              }}
                              className="px-2 py-1 rounded bg-zinc-900 text-xs"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => updateHeaderData(prev => ({ ...prev, navOrder: (prev.navOrder || []).filter((item, i) => !(i === idx && item === key)) }))}
                              className="px-2 py-1 rounded bg-red-600/20 text-red-300 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Add Nav Item">
                  <div className="flex gap-2">
                    <select value={addNavKey} onChange={(e) => setAddNavKey(e.target.value)} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm">
                      <option value="">Select route key</option>
                      {navCandidates.filter(key => !navOrder.includes(key)).map(key => (
                        <option key={key} value={key}>{NAV_LABELS[key as keyof typeof NAV_LABELS] || key}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        if (!addNavKey) return;
                        updateHeaderData(prev => ({ ...prev, navOrder: [...(prev.navOrder || []), addNavKey] }));
                        setAddNavKey('');
                      }}
                      className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-black uppercase"
                    >
                      Add
                    </button>
                  </div>
                </Card>
              </div>

              <Card title="Live Nav Preview" className="h-fit xl:sticky xl:top-24">
                <div className="space-y-2">
                  {navOrder.map((key, idx) => (
                    <div key={`${key}-preview-${idx}`} className="rounded-lg border border-zinc-800 bg-zinc-800/30 p-3">
                      <p className="text-xs font-black uppercase tracking-widest">{NAV_LABELS[key as keyof typeof NAV_LABELS] || key}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{ROUTES[key as keyof typeof ROUTES] || '/'}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab === 'Blog' && (
            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6">
              <div className="space-y-6">
                <Card title="Blog Feed">
                  <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
                    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                      {(blogData.posts || []).map(post => (
                        <button
                          key={post.id}
                          onClick={() => setSelectedBlogId(post.id)}
                          className={`w-full text-left rounded-xl border p-3 ${selectedBlog?.id === post.id ? 'border-pink-500 bg-pink-500/10' : 'border-zinc-700 bg-zinc-800/40'}`}
                        >
                          <p className="text-xs font-black uppercase tracking-widest">{post.title || 'Untitled Post'}</p>
                          <p className="text-[10px] text-zinc-500 mt-1">/{post.slug || slugify(post.title)}</p>
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          const id = `blog-${Date.now()}`;
                          updateBlogData(prev => ({
                            ...prev,
                            posts: [
                              {
                                id,
                                title: 'New Blog Post',
                                slug: `new-blog-post-${(prev.posts || []).length + 1}`,
                                status: 'draft',
                                publishAt: '',
                                date: new Date().toISOString().slice(0, 10),
                                excerpt: '',
                                content: '',
                                imageUrl: '',
                                metaTitle: '',
                                metaDescription: '',
                                canonical: '',
                                ogImage: '',
                                faqSchemaEnabled: false,
                                faqSchema: []
                              },
                              ...(prev.posts || [])
                            ]
                          }));
                          setSelectedBlogId(id);
                        }}
                        className="w-full rounded-xl border border-dashed border-zinc-700 p-3 text-xs font-black uppercase text-zinc-400 hover:text-white hover:border-pink-500"
                      >
                        + Add Post
                      </button>
                    </div>

                    {selectedBlog ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Title</label>
                            <input
                              value={selectedBlog.title}
                              onChange={(e) => {
                                const title = e.target.value;
                                updateBlogPost(selectedBlog.id, {
                                  title,
                                  slug: ensureUniqueSlug(title, selectedBlog.id)
                                });
                              }}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Slug</label>
                            <input
                              value={selectedBlog.slug || slugify(selectedBlog.title)}
                              onChange={(e) => updateBlogPost(selectedBlog.id, { slug: slugify(e.target.value) })}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Status</label>
                            <select
                              value={selectedBlog.status || 'draft'}
                              onChange={(e) => updateBlogPost(selectedBlog.id, { status: e.target.value as 'draft' | 'published' })}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Publish At</label>
                            <input
                              type="datetime-local"
                              value={selectedBlog.publishAt || ''}
                              onChange={(e) => updateBlogPost(selectedBlog.id, { publishAt: e.target.value })}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Featured Image URL</label>
                            <input
                              value={selectedBlog.imageUrl || ''}
                              onChange={(e) => updateBlogPost(selectedBlog.id, { imageUrl: e.target.value })}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
                            />
                            <div className="flex gap-2 mt-2">
                              <label className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black uppercase cursor-pointer">
                                Upload
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const url = await uploadFile(file);
                                    if (url) {
                                      updateBlogPost(selectedBlog.id, { imageUrl: url });
                                      setSyncError('');
                                    } else {
                                      setSyncStatus('Error');
                                      setSyncError('Upload failed for featured image.');
                                    }
                                  }}
                                />
                              </label>
                              <button
                                onClick={() => openMediaModal({ kind: 'blog-image', postId: selectedBlog.id })}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black uppercase"
                              >
                                From Server
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Excerpt</label>
                          <textarea value={selectedBlog.excerpt} onChange={(e) => updateBlogPost(selectedBlog.id, { excerpt: e.target.value })} rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Content</label>
                          <textarea value={selectedBlog.content} onChange={(e) => updateBlogPost(selectedBlog.id, { content: e.target.value })} rows={10} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                        </div>

                        <div className="bg-zinc-800/30 border border-zinc-700 rounded-xl p-3 space-y-3">
                          <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">SEO</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input value={selectedBlog.metaTitle || ''} onChange={(e) => updateBlogPost(selectedBlog.id, { metaTitle: e.target.value })} placeholder="Meta title" className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                            <input value={selectedBlog.canonical || ''} onChange={(e) => updateBlogPost(selectedBlog.id, { canonical: e.target.value })} placeholder="Canonical URL" className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                          </div>
                          <textarea value={selectedBlog.metaDescription || ''} onChange={(e) => updateBlogPost(selectedBlog.id, { metaDescription: e.target.value })} rows={3} placeholder="Meta description" className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                          <div>
                            <input value={selectedBlog.ogImage || ''} onChange={(e) => updateBlogPost(selectedBlog.id, { ogImage: e.target.value })} placeholder="OG image URL" className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                            <div className="flex gap-2 mt-2">
                              <label className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black uppercase cursor-pointer">
                                Upload
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const url = await uploadFile(file);
                                    if (url) {
                                      updateBlogPost(selectedBlog.id, { ogImage: url });
                                      setSyncError('');
                                    } else {
                                      setSyncStatus('Error');
                                      setSyncError('Upload failed for OG image.');
                                    }
                                  }}
                                />
                              </label>
                              <button
                                onClick={() => openMediaModal({ kind: 'blog-og', postId: selectedBlog.id })}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black uppercase"
                              >
                                From Server
                              </button>
                            </div>
                          </div>
                          <label className="inline-flex items-center gap-2 text-xs uppercase text-zinc-400">
                            <input
                              type="checkbox"
                              checked={selectedBlog.faqSchemaEnabled || false}
                              onChange={(e) => updateBlogPost(selectedBlog.id, { faqSchemaEnabled: e.target.checked })}
                            />
                            Enable FAQ Schema
                          </label>
                          {selectedBlog.faqSchemaEnabled && (
                            <textarea
                              value={JSON.stringify(selectedBlog.faqSchema || [], null, 2)}
                              onChange={(e) => {
                                try {
                                  const parsed = JSON.parse(e.target.value);
                                  updateBlogPost(selectedBlog.id, { faqSchema: Array.isArray(parsed) ? parsed : [] });
                                } catch {
                                  // keep typing without breaking editor
                                }
                              }}
                              rows={6}
                              className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-green-400"
                            />
                          )}
                        </div>

                        <button
                          onClick={() => {
                            if (!window.confirm('Delete this post?')) return;
                            updateBlogData(prev => ({ ...prev, posts: (prev.posts || []).filter(post => post.id !== selectedBlog.id) }));
                            setSelectedBlogId('');
                          }}
                          className="px-3 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-black uppercase"
                        >
                          Delete Post
                        </button>
                      </div>
                    ) : (
                      <div className="bg-zinc-800/30 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-400">No post selected.</div>
                    )}
                  </div>
                </Card>
              </div>

              <Card title="Post Preview" className="h-fit xl:sticky xl:top-24">
                {selectedBlog ? (
                  <article className="space-y-3">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">/{selectedBlog.slug || slugify(selectedBlog.title)}</p>
                    <h4 className="text-2xl font-black leading-tight">{selectedBlog.title || 'Untitled Post'}</h4>
                    <p className="text-xs uppercase tracking-widest text-zinc-500">{selectedBlog.status || 'draft'} {selectedBlog.publishAt ? `· ${selectedBlog.publishAt}` : ''}</p>
                    {selectedBlog.imageUrl && <img src={getMediaUrl(selectedBlog.imageUrl)} alt={selectedBlog.title} className="w-full h-48 object-cover rounded-xl border border-zinc-800" />}
                    <p className="text-sm text-zinc-300">{selectedBlog.excerpt}</p>
                    <div className="text-sm text-zinc-400 whitespace-pre-line leading-relaxed">{selectedBlog.content}</div>
                  </article>
                ) : (
                  <p className="text-sm text-zinc-500">Create/select a blog post to preview.</p>
                )}
              </Card>
            </div>
          )}

          {tab === 'Dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card title="Home Sections">
                  <p className="text-3xl font-black">{homeSections.length}</p>
                </Card>
                <Card title="Blog Posts">
                  <p className="text-3xl font-black">{(blogData.posts || []).length}</p>
                </Card>
                <Card title="Galleries">
                  <p className="text-3xl font-black">{galleryCollections.length}</p>
                </Card>
                <Card title="Food Categories">
                  <p className="text-3xl font-black">{foodMenu.length}</p>
                </Card>
              </div>
              <Card title="Quick Jump">
                <div className="flex flex-wrap gap-2">
                  {['Homepage', 'SEO', 'Nav', 'Hero', 'Blog', 'Gallery', 'Config'].map((target) => (
                    <button key={target} onClick={() => setTab(target)} className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase">
                      {target}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab === 'Hero' && (
            <Card title="Hero Editor">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={heroData.badgeText} onChange={(e) => updateHeroData(prev => ({ ...prev, badgeText: e.target.value }))} placeholder="Badge text" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <input value={heroData.buttonText} onChange={(e) => updateHeroData(prev => ({ ...prev, buttonText: e.target.value }))} placeholder="Button text" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <div className="md:col-span-2">
                  {renderMediaField('Fallback background URL', heroData.backgroundImageUrl, (value) => updateHeroData(prev => ({ ...prev, backgroundImageUrl: value })), 'Fallback background URL')}
                </div>
                <input value={heroData.headingText} onChange={(e) => updateHeroData(prev => ({ ...prev, headingText: e.target.value }))} placeholder="Hero headline" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm md:col-span-2" />
                <textarea value={heroData.subText} onChange={(e) => updateHeroData(prev => ({ ...prev, subText: e.target.value }))} rows={3} placeholder="Subtext" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm md:col-span-2" />
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] uppercase font-black text-zinc-500">Desktop Slides (video or photo)</label>
                    <button
                      onClick={() => updateHeroData(prev => ({ ...prev, slides: [...(prev.slides || []), ''] }))}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black uppercase"
                    >
                      + Add Media
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(heroData.slides || []).map((slide, idx) => (
                      <div key={`desktop-slide-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2">
                        {renderMediaField(
                          `Desktop Slide ${idx + 1}`,
                          slide,
                          (value) => updateHeroData(prev => ({ ...prev, slides: (prev.slides || []).map((s, i) => i === idx ? value : s) })),
                          'Slide media URL'
                        )}
                        <button
                          onClick={() => updateHeroData(prev => ({ ...prev, slides: (prev.slides || []).filter((_, i) => i !== idx) }))}
                          className="mt-2 px-2 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 text-[10px] font-black uppercase"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {(heroData.slides || []).length === 0 && (
                      <p className="text-xs text-zinc-500">No desktop slide media yet.</p>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] uppercase font-black text-zinc-500">Mobile Slides (video or photo)</label>
                    <button
                      onClick={() => updateHeroData(prev => ({ ...prev, mobileSlides: [...(prev.mobileSlides || []), ''] }))}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black uppercase"
                    >
                      + Add Media
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(heroData.mobileSlides || []).map((slide, idx) => (
                      <div key={`mobile-slide-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2">
                        {renderMediaField(
                          `Mobile Slide ${idx + 1}`,
                          slide,
                          (value) => updateHeroData(prev => ({ ...prev, mobileSlides: (prev.mobileSlides || []).map((s, i) => i === idx ? value : s) })),
                          'Slide media URL'
                        )}
                        <button
                          onClick={() => updateHeroData(prev => ({ ...prev, mobileSlides: (prev.mobileSlides || []).filter((_, i) => i !== idx) }))}
                          className="mt-2 px-2 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 text-[10px] font-black uppercase"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {(heroData.mobileSlides || []).length === 0 && (
                      <p className="text-xs text-zinc-500">No mobile slide media yet.</p>
                    )}
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 text-xs uppercase text-zinc-300"><input type="checkbox" checked={heroData.showBadge !== false} onChange={(e) => updateHeroData(prev => ({ ...prev, showBadge: e.target.checked }))} /> Show Badge</label>
                <label className="inline-flex items-center gap-2 text-xs uppercase text-zinc-300"><input type="checkbox" checked={heroData.showButtons !== false} onChange={(e) => updateHeroData(prev => ({ ...prev, showButtons: e.target.checked }))} /> Show Buttons</label>
              </div>
            </Card>
          )}

          {tab === 'About' && (
            <Card title="About Editor">
              <div className="space-y-4">
                <input value={highlightsData.heading} onChange={(e) => updateHighlightsData(prev => ({ ...prev, heading: e.target.value }))} placeholder="Heading" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <textarea value={highlightsData.subtext} onChange={(e) => updateHighlightsData(prev => ({ ...prev, subtext: e.target.value }))} rows={3} placeholder="Subtext" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {renderMediaField('Main image URL', highlightsData.mainImageUrl, (value) => updateHighlightsData(prev => ({ ...prev, mainImageUrl: value })), 'Main image URL')}
                  {renderMediaField('Mobile main image URL', highlightsData.mobileMainImageUrl || '', (value) => updateHighlightsData(prev => ({ ...prev, mobileMainImageUrl: value })), 'Mobile main image URL')}
                  {renderMediaField('Side image URL', highlightsData.sideImageUrl, (value) => updateHighlightsData(prev => ({ ...prev, sideImageUrl: value })), 'Side image URL')}
                  <input value={highlightsData.featureListTitle} onChange={(e) => updateHighlightsData(prev => ({ ...prev, featureListTitle: e.target.value }))} placeholder="Feature list title" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                </div>
                <textarea value={(highlightsData.featureList || []).join('\n')} onChange={(e) => updateHighlightsData(prev => ({ ...prev, featureList: splitLines(e.target.value) }))} rows={5} placeholder="Feature list (one per line)" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
              </div>
            </Card>
          )}

          {tab === 'Features' && (
            <Card title="Features Editor">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={featuresData.experience.label} onChange={(e) => updateFeaturesData(prev => ({ ...prev, experience: { ...prev.experience, label: e.target.value } }))} placeholder="Experience label" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  <input value={featuresData.experience.heading} onChange={(e) => updateFeaturesData(prev => ({ ...prev, experience: { ...prev.experience, heading: e.target.value } }))} placeholder="Experience heading" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  {renderMediaField('Experience image URL', featuresData.experience.image, (value) => updateFeaturesData(prev => ({ ...prev, experience: { ...prev.experience, image: value } })), 'Experience image URL')}
                  {renderMediaField('Experience mobile image URL', featuresData.experience.mobileImage || '', (value) => updateFeaturesData(prev => ({ ...prev, experience: { ...prev.experience, mobileImage: value } })), 'Experience mobile image URL')}
                </div>
                <textarea value={featuresData.experience.text} onChange={(e) => updateFeaturesData(prev => ({ ...prev, experience: { ...prev.experience, text: e.target.value } }))} rows={3} placeholder="Experience text" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <input value={featuresData.occasions.heading} onChange={(e) => updateFeaturesData(prev => ({ ...prev, occasions: { ...prev.occasions, heading: e.target.value } }))} placeholder="Occasions heading" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <textarea value={featuresData.occasions.text} onChange={(e) => updateFeaturesData(prev => ({ ...prev, occasions: { ...prev.occasions, text: e.target.value } }))} rows={2} placeholder="Occasions text" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
              </div>
            </Card>
          )}

          {tab === 'Vibe' && (
            <Card title="Vibe Editor">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={vibeData.label} onChange={(e) => updateVibeData(prev => ({ ...prev, label: e.target.value }))} placeholder="Label" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <input value={vibeData.heading} onChange={(e) => updateVibeData(prev => ({ ...prev, heading: e.target.value }))} placeholder="Heading" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <textarea value={vibeData.text} onChange={(e) => updateVibeData(prev => ({ ...prev, text: e.target.value }))} rows={3} placeholder="Intro text" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm md:col-span-2" />
                {renderMediaField('Video URL', vibeData.videoUrl || '', (value) => updateVibeData(prev => ({ ...prev, videoUrl: value })), 'Video URL')}
                {renderMediaField('Mobile video URL', vibeData.mobileVideoUrl || '', (value) => updateVibeData(prev => ({ ...prev, mobileVideoUrl: value })), 'Mobile video URL')}
                {renderMediaField('Image 1 URL', vibeData.image1, (value) => updateVibeData(prev => ({ ...prev, image1: value })), 'Image 1 URL')}
                {renderMediaField('Image 2 URL', vibeData.image2, (value) => updateVibeData(prev => ({ ...prev, image2: value })), 'Image 2 URL')}
                {renderMediaField('Bottom image URL', vibeData.bigImage, (value) => updateVibeData(prev => ({ ...prev, bigImage: value })), 'Bottom image URL')}
                {renderMediaField('Mobile bottom image URL', vibeData.mobileBigImage || '', (value) => updateVibeData(prev => ({ ...prev, mobileBigImage: value })), 'Mobile bottom image URL')}
                <input value={vibeData.bottomHeading} onChange={(e) => updateVibeData(prev => ({ ...prev, bottomHeading: e.target.value }))} placeholder="Bottom heading" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm md:col-span-2" />
                <textarea value={vibeData.bottomText} onChange={(e) => updateVibeData(prev => ({ ...prev, bottomText: e.target.value }))} rows={3} placeholder="Bottom text" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm md:col-span-2" />
              </div>
            </Card>
          )}

          {tab === 'Stats' && (
            <div className="space-y-6">
              <Card title="Stats Editor">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={batteryData.statPrefix} onChange={(e) => updateBatteryData(prev => ({ ...prev, statPrefix: e.target.value }))} placeholder="Prefix" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  <input value={batteryData.statNumber} onChange={(e) => updateBatteryData(prev => ({ ...prev, statNumber: e.target.value }))} placeholder="Number" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  <input value={batteryData.statSuffix} onChange={(e) => updateBatteryData(prev => ({ ...prev, statSuffix: e.target.value }))} placeholder="Suffix" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  <input value={batteryData.subText} onChange={(e) => updateBatteryData(prev => ({ ...prev, subText: e.target.value }))} placeholder="Subtext" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                </div>
              </Card>
              <Card title="Testimonials">
                <div className="space-y-3">
                  <input value={testimonialsData.heading} onChange={(e) => updateTestimonialsData(prev => ({ ...prev, heading: e.target.value }))} placeholder="Heading" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  <textarea value={testimonialsData.subtext} onChange={(e) => updateTestimonialsData(prev => ({ ...prev, subtext: e.target.value }))} rows={2} placeholder="Subtext" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  <textarea value={(testimonialsData.items || []).map(i => `${i.quote}||${i.name}||${i.avatar || ''}`).join('\n')} onChange={(e) => updateTestimonialsData(prev => ({ ...prev, items: splitLines(e.target.value).map((line) => { const [quote = '', name = '', avatar = ''] = line.split('||'); return { quote, name, avatar }; }) }))} rows={6} placeholder="One testimonial per line: quote||name||avatarUrl" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                </div>
              </Card>
            </div>
          )}

          {tab === 'Food' && (
            <Card title="Food Menu">
              <div className="space-y-4">
                {(foodMenu || []).map((category, categoryIndex) => (
                  <div key={`${category.category}-${categoryIndex}`} className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-3 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
                      <input value={category.category} onChange={(e) => updateFoodMenu(prev => prev.map((c, i) => i === categoryIndex ? { ...c, category: e.target.value } : c))} placeholder="Category" className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                      <input value={category.description || ''} onChange={(e) => updateFoodMenu(prev => prev.map((c, i) => i === categoryIndex ? { ...c, description: e.target.value } : c))} placeholder="Description" className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                      <button onClick={() => updateFoodMenu(prev => prev.filter((_, i) => i !== categoryIndex))} className="px-2 py-1 rounded bg-red-600/20 text-red-300 text-xs uppercase font-black">Remove</button>
                    </div>
                    {(category.items || []).map((item, itemIndex) => (
                      <div key={`${item.name}-${itemIndex}`} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <input value={item.name} onChange={(e) => updateFoodMenu(prev => prev.map((c, i) => i === categoryIndex ? { ...c, items: c.items.map((it, ii) => ii === itemIndex ? { ...it, name: e.target.value } : it) } : c))} placeholder="Item name" className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                        <input value={item.price} onChange={(e) => updateFoodMenu(prev => prev.map((c, i) => i === categoryIndex ? { ...c, items: c.items.map((it, ii) => ii === itemIndex ? { ...it, price: e.target.value } : it) } : c))} placeholder="Price" className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                        <input value={item.description} onChange={(e) => updateFoodMenu(prev => prev.map((c, i) => i === categoryIndex ? { ...c, items: c.items.map((it, ii) => ii === itemIndex ? { ...it, description: e.target.value } : it) } : c))} placeholder="Description" className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                        <button onClick={() => updateFoodMenu(prev => prev.map((c, i) => i === categoryIndex ? { ...c, items: c.items.filter((_, ii) => ii !== itemIndex) } : c))} className="px-2 py-1 rounded bg-red-600/20 text-red-300 text-xs uppercase font-black">Remove Item</button>
                      </div>
                    ))}
                    <button onClick={() => updateFoodMenu(prev => prev.map((c, i) => i === categoryIndex ? { ...c, items: [...(c.items || []), { name: 'New item', description: '', price: '' }] } : c))} className="px-2 py-1 rounded bg-zinc-900 text-xs uppercase font-black">+ Add Item</button>
                  </div>
                ))}
                <button onClick={() => updateFoodMenu(prev => [...(prev || []), { category: `Category ${(prev || []).length + 1}`, description: '', items: [] }])} className="px-3 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-black uppercase">+ Add Category</button>
              </div>
            </Card>
          )}

          {tab === 'Drinks' && (
            <Card title="Drinks Editor">
              <div className="space-y-3">
                {renderMediaField('Header image URL', drinksData.headerImageUrl || '', (value) => updateDrinksData(prev => ({ ...prev, headerImageUrl: value })), 'Header image URL')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={drinksData.packagesData?.title || ''} onChange={(e) => updateDrinksData(prev => ({ ...prev, packagesData: { ...prev.packagesData, title: e.target.value } }))} placeholder="Packages title" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  <input value={drinksData.packagesData?.subtitle || ''} onChange={(e) => updateDrinksData(prev => ({ ...prev, packagesData: { ...prev.packagesData, subtitle: e.target.value } }))} placeholder="Packages subtitle" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                </div>
                <textarea value={(drinksData.packagesData?.notes || []).join('\n')} onChange={(e) => updateDrinksData(prev => ({ ...prev, packagesData: { ...prev.packagesData, notes: splitLines(e.target.value) } }))} rows={4} placeholder="Package notes (one per line)" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <p className="text-xs text-zinc-500">Deep menu arrays (cocktails/wines/shots) stay preserved and can still be edited from the existing JSON sync payload.</p>
              </div>
            </Card>
          )}

          {tab === 'Events' && (
            <Card title="Events Editor">
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={eventsData.hero?.title || ''} onChange={(e) => updateEventsData(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))} placeholder="Hero title" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  <input value={eventsData.hero?.subtitle || ''} onChange={(e) => updateEventsData(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))} placeholder="Hero subtitle" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                </div>
                {renderMediaField('Hero image URL', eventsData.hero?.image || '', (value) => updateEventsData(prev => ({ ...prev, hero: { ...prev.hero, image: value } })), 'Hero image URL')}
                <div className="space-y-3">
                  {(eventsData.sections || []).map((section, idx) => (
                    <div key={section.id || `section-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-3 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input value={section.title} onChange={(e) => updateEventsData(prev => ({ ...prev, sections: (prev.sections || []).map((s, i) => i === idx ? { ...s, title: e.target.value } : s) }))} placeholder="Section title" className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                        <input value={section.subtitle} onChange={(e) => updateEventsData(prev => ({ ...prev, sections: (prev.sections || []).map((s, i) => i === idx ? { ...s, subtitle: e.target.value } : s) }))} placeholder="Section subtitle" className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                      </div>
                      <textarea value={section.description} onChange={(e) => updateEventsData(prev => ({ ...prev, sections: (prev.sections || []).map((s, i) => i === idx ? { ...s, description: e.target.value } : s) }))} rows={2} placeholder="Description" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                      {renderMediaField('Section image URL', section.imageUrl, (value) => updateEventsData(prev => ({ ...prev, sections: (prev.sections || []).map((s, i) => i === idx ? { ...s, imageUrl: value } : s) })), 'Section image URL')}
                      <textarea value={(section.features || []).join('\n')} onChange={(e) => updateEventsData(prev => ({ ...prev, sections: (prev.sections || []).map((s, i) => i === idx ? { ...s, features: splitLines(e.target.value) } : s) }))} rows={3} placeholder="Features (one per line)" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                      <button onClick={() => updateEventsData(prev => ({ ...prev, sections: (prev.sections || []).filter((_, i) => i !== idx) }))} className="px-2 py-1 rounded bg-red-600/20 text-red-300 text-xs uppercase font-black">Remove Section</button>
                    </div>
                  ))}
                  <button onClick={() => updateEventsData(prev => ({ ...prev, sections: [...(prev.sections || []), { id: `event-${Date.now()}`, title: 'New Event', subtitle: '', description: '', imageUrl: '', features: [] }] }))} className="px-3 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-black uppercase">
                    + Add Event Section
                  </button>
                </div>
              </div>
            </Card>
          )}

          {tab === 'Instagram' && (
            <Card title="Instagram Editor">
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={instagramHighlightsData.heading || ''} onChange={(e) => updateInstagramHighlightsData(prev => ({ ...prev, heading: e.target.value }))} placeholder="Heading" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  <input value={instagramHighlightsData.username || ''} onChange={(e) => updateInstagramHighlightsData(prev => ({ ...prev, username: e.target.value }))} placeholder="@username" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Highlights</p>
                  {(instagramHighlightsData.highlights || []).map((highlight, idx) => (
                    <div key={highlight.id || `highlight-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-3 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input value={highlight.title} onChange={(e) => updateInstagramHighlightsData(prev => ({ ...prev, highlights: (prev.highlights || []).map((h, i) => i === idx ? { ...h, title: e.target.value } : h) }))} placeholder="Highlight title" className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                        <input value={highlight.link || ''} onChange={(e) => updateInstagramHighlightsData(prev => ({ ...prev, highlights: (prev.highlights || []).map((h, i) => i === idx ? { ...h, link: e.target.value } : h) }))} placeholder="Highlight link" className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                      </div>
                      {renderMediaField('Highlight image URL', highlight.imageUrl || '', (value) => updateInstagramHighlightsData(prev => ({ ...prev, highlights: (prev.highlights || []).map((h, i) => i === idx ? { ...h, imageUrl: value } : h) })), 'Highlight image URL')}
                      <button onClick={() => updateInstagramHighlightsData(prev => ({ ...prev, highlights: (prev.highlights || []).filter((_, i) => i !== idx) }))} className="px-2 py-1 rounded bg-red-600/20 text-red-300 text-xs uppercase font-black">Remove Highlight</button>
                    </div>
                  ))}
                  <button onClick={() => updateInstagramHighlightsData(prev => ({ ...prev, highlights: [...(prev.highlights || []), { id: `highlight-${Date.now()}`, title: 'New Highlight', imageUrl: '', link: '' }] }))} className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase">+ Add Highlight</button>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Posts</p>
                  {(instagramHighlightsData.posts || []).map((post, idx) => (
                    <div key={post.id || `post-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-3 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input value={post.likes || ''} onChange={(e) => updateInstagramHighlightsData(prev => ({ ...prev, posts: (prev.posts || []).map((p, i) => i === idx ? { ...p, likes: e.target.value } : p) }))} placeholder="Likes" className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                        <input value={post.comments || ''} onChange={(e) => updateInstagramHighlightsData(prev => ({ ...prev, posts: (prev.posts || []).map((p, i) => i === idx ? { ...p, comments: e.target.value } : p) }))} placeholder="Comments" className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                        <input value={post.caption || ''} onChange={(e) => updateInstagramHighlightsData(prev => ({ ...prev, posts: (prev.posts || []).map((p, i) => i === idx ? { ...p, caption: e.target.value } : p) }))} placeholder="Caption" className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                      </div>
                      {renderMediaField('Post image URL', post.imageUrl || '', (value) => updateInstagramHighlightsData(prev => ({ ...prev, posts: (prev.posts || []).map((p, i) => i === idx ? { ...p, imageUrl: value } : p) })), 'Post image URL')}
                      <button onClick={() => updateInstagramHighlightsData(prev => ({ ...prev, posts: (prev.posts || []).filter((_, i) => i !== idx) }))} className="px-2 py-1 rounded bg-red-600/20 text-red-300 text-xs uppercase font-black">Remove Post</button>
                    </div>
                  ))}
                  <button onClick={() => updateInstagramHighlightsData(prev => ({ ...prev, posts: [...(prev.posts || []), { id: `post-${Date.now()}`, imageUrl: '', likes: '0', comments: '0', caption: '' }] }))} className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase">+ Add Post</button>
                </div>
              </div>
            </Card>
          )}

          {tab === 'FAQ' && (
            <Card title="FAQ Editor">
              <div className="space-y-3">
                <input value={faqData.heading} onChange={(e) => updateFaqData(prev => ({ ...prev, heading: e.target.value }))} placeholder="Heading" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <textarea value={faqData.subtext} onChange={(e) => updateFaqData(prev => ({ ...prev, subtext: e.target.value }))} rows={2} placeholder="Subtext" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <textarea value={(faqData.items || []).map(i => `${i.question}||${i.answer}`).join('\n')} onChange={(e) => updateFaqData(prev => ({ ...prev, items: splitLines(e.target.value).map((line) => { const [question = '', answer = ''] = line.split('||'); return { question, answer }; }) }))} rows={8} placeholder="One item per line: question||answer" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
              </div>
            </Card>
          )}

          {tab === 'Info' && (
            <Card title="Info Editor">
              <div className="space-y-3">
                <input value={infoSectionData.heading} onChange={(e) => updateInfoSectionData(prev => ({ ...prev, heading: e.target.value }))} placeholder="Heading" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <textarea value={(infoSectionData.sections || []).map(s => `${s.title}||${s.content}`).join('\n')} onChange={(e) => updateInfoSectionData(prev => ({ ...prev, sections: splitLines(e.target.value).map((line) => { const [title = '', content = ''] = line.split('||'); return { title, content }; }) }))} rows={10} placeholder="Sections: title||content" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input value={infoSectionData.footerTitle} onChange={(e) => updateInfoSectionData(prev => ({ ...prev, footerTitle: e.target.value }))} placeholder="Footer title" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  <input value={infoSectionData.footerText} onChange={(e) => updateInfoSectionData(prev => ({ ...prev, footerText: e.target.value }))} placeholder="Footer text" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  <input value={infoSectionData.footerHighlight} onChange={(e) => updateInfoSectionData(prev => ({ ...prev, footerHighlight: e.target.value }))} placeholder="Footer highlight" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                </div>
              </div>
            </Card>
          )}

          {tab === 'Terms' && (
            <Card title="Terms Editor">
              <div className="space-y-3">
                {(termsData || []).map((term, idx) => (
                  <div key={`${term.title}-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-3 space-y-2">
                    <div className="flex gap-2">
                      <input value={term.title} onChange={(e) => updateTermsData(prev => prev.map((t, i) => i === idx ? { ...t, title: e.target.value } : t))} placeholder="Title" className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                      <button onClick={() => updateTermsData(prev => prev.filter((_, i) => i !== idx))} className="px-2 py-1 rounded bg-red-600/20 text-red-300 text-xs uppercase font-black">Remove</button>
                    </div>
                    <textarea value={term.content} onChange={(e) => updateTermsData(prev => prev.map((t, i) => i === idx ? { ...t, content: e.target.value } : t))} rows={3} placeholder="Content" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs" />
                  </div>
                ))}
                <button onClick={() => updateTermsData(prev => [...(prev || []), { title: 'New Term', content: '' }])} className="px-3 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-black uppercase">+ Add Term</button>
              </div>
            </Card>
          )}

          {tab === 'Config' && (
            <div className="space-y-6">
              <Card title="Sync Config">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={syncUrl} onChange={(e) => updateSyncUrl(e.target.value)} placeholder="Sync URL (db.php)" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  <input value={adminPassword} onChange={(e) => updateAdminPassword(e.target.value)} placeholder="Admin key" className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                </div>
              </Card>
              <Card title="JSON Backup">
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(exportDatabase());
                      setSyncError('JSON copied to clipboard.');
                    }}
                    className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase"
                  >
                    Copy JSON Export
                  </button>
                  <button
                    onClick={() => {
                      const data = exportDatabase();
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `lkc-site-backup-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase"
                  >
                    Download JSON Export
                  </button>
                </div>
              </Card>
              <Card title="Test Media URL">
                <div className="space-y-3">
                  <input
                    value={mediaTestKey}
                    onChange={(e) => setMediaTestKey(e.target.value)}
                    placeholder="Enter media key/path, e.g. 1771478148_file.png"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={testMediaUrl}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase"
                    >
                      Resolve & Test
                    </button>
                    {mediaTestKey && (
                      <span className="text-xs text-zinc-400 self-center">
                        Key: {getMediaKey(mediaTestKey)}
                      </span>
                    )}
                  </div>
                  {mediaTestResult && <p className="text-xs text-zinc-300">{mediaTestResult}</p>}
                </div>
              </Card>
            </div>
          )}

          {tab === 'Gallery' && (
            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6">
              <div className="space-y-6">
                <Card title="Gallery Collections">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {galleryCollections.map(collection => (
                      <button
                        key={collection.id}
                        onClick={() => setSelectedGalleryId(collection.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-black uppercase ${activeGallery?.id === collection.id ? 'bg-pink-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}
                      >
                        {collection.name}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        const id = `gallery-${Date.now()}`;
                        updateGalleryData(prev => ({
                          ...prev,
                          collections: [...(prev.collections || []), { id, name: `Gallery ${(prev.collections || []).length + 1}`, subtext: '', images: [], defaultViewMode: 'carousel' }],
                          activeCollectionId: id
                        }));
                        setSelectedGalleryId(id);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-black uppercase bg-zinc-800 hover:bg-zinc-700"
                    >
                      + Add Collection
                    </button>
                  </div>
                  {activeGallery && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Collection Name</label>
                        <input
                          value={activeGallery.name}
                          onChange={(e) => updateGalleryData(prev => ({ ...prev, collections: (prev.collections || []).map(c => c.id === activeGallery.id ? { ...c, name: e.target.value } : c) }))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Subtext</label>
                        <input
                          value={activeGallery.subtext || ''}
                          onChange={(e) => updateGalleryData(prev => ({ ...prev, collections: (prev.collections || []).map(c => c.id === activeGallery.id ? { ...c, subtext: e.target.value } : c) }))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Default View Mode</label>
                        <select
                          value={activeGallery.defaultViewMode || 'carousel'}
                          onChange={(e) => {
                            const nextMode = e.target.value === 'grid' ? 'grid' : 'carousel';
                            updateGalleryData(prev => ({
                              ...prev,
                              collections: (prev.collections || []).map(c => c.id === activeGallery.id ? { ...c, defaultViewMode: nextMode } : c)
                            }));
                          }}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
                        >
                          <option value="carousel">Slideshow</option>
                          <option value="grid">Grid</option>
                        </select>
                      </div>
                    </div>
                  )}
                </Card>

                <Card title="Page Gallery Display">
                  <div className="space-y-3">
                    {(Object.keys(pageGallerySettings) as PageGalleryKey[]).map((key) => (
                      <div key={key} className="grid grid-cols-1 md:grid-cols-[110px_90px_1fr_130px] gap-2 p-2 rounded-xl border border-zinc-800 bg-zinc-900/40">
                        <div className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center">{pageGalleryLabels[key] || key}</div>
                        <label className="inline-flex items-center gap-2 text-xs uppercase text-zinc-300">
                          <input
                            type="checkbox"
                            checked={Boolean(pageGallerySettings[key]?.enabled)}
                            onChange={(e) =>
                              updatePageGallerySettings(prev => ({
                                ...prev,
                                [key]: { ...(prev[key] || {}), enabled: e.target.checked }
                              }))
                            }
                          />
                          Show
                        </label>
                        <select
                          value={pageGallerySettings[key]?.collectionId || galleryCollections[0]?.id || 'default'}
                          onChange={(e) => {
                            const selectedCollectionId = e.target.value;
                            const selectedCollection = galleryCollections.find(c => c.id === selectedCollectionId);
                            updatePageGallerySettings(prev => ({
                              ...prev,
                              [key]: {
                                ...(prev[key] || { enabled: false }),
                                collectionId: selectedCollectionId,
                                viewMode: prev[key]?.viewMode || selectedCollection?.defaultViewMode || 'carousel'
                              }
                            }));
                          }}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-xs"
                        >
                          {galleryCollections.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <select
                          value={pageGallerySettings[key]?.viewMode || 'carousel'}
                          onChange={(e) =>
                            updatePageGallerySettings(prev => ({
                              ...prev,
                              [key]: { ...(prev[key] || { enabled: false }), viewMode: e.target.value === 'grid' ? 'grid' : 'carousel' }
                            }))
                          }
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-xs"
                        >
                          <option value="carousel">Slideshow</option>
                          <option value="grid">Grid</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Gallery Media">
                  <div className="flex gap-2 mb-4">
                    <label className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase cursor-pointer">
                      Upload
                      <input
                        type="file"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file || !activeGallery) return;
                          const url = await uploadFile(file);
                          if (!url) {
                            setSyncStatus('Error');
                            setSyncError('Upload failed for gallery image.');
                            return;
                          }
                          updateGalleryData(prev => ({
                            ...prev,
                            collections: (prev.collections || []).map(c =>
                              c.id === activeGallery.id ? { ...c, images: [...(c.images || []), { id: `g-${Date.now()}`, url, caption: c.name }] } : c
                            )
                          }));
                          setSyncError('');
                        }}
                      />
                    </label>
                    <button
                      onClick={() => openMediaModal({ kind: 'gallery-add', collectionId: activeGallery?.id })}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase"
                    >
                      From Server
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(activeGallery?.images || []).map((image, idx) => (
                      <div key={image.id} className="rounded-xl border border-zinc-800 bg-zinc-800/30 overflow-hidden">
                        <img src={getMediaUrl(image.url)} alt={image.caption} className="w-full aspect-square object-cover" />
                        <div className="p-2">
                          <input
                            value={image.caption || ''}
                            onChange={(e) => {
                              if (!activeGallery) return;
                              updateGalleryData(prev => ({
                                ...prev,
                                collections: (prev.collections || []).map(c =>
                                  c.id === activeGallery.id
                                    ? { ...c, images: (c.images || []).map((img, i) => i === idx ? { ...img, caption: e.target.value } : img) }
                                    : c
                                )
                              }));
                            }}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-[11px]"
                          />
                          <button
                            onClick={() => {
                              if (!activeGallery) return;
                              updateGalleryData(prev => ({
                                ...prev,
                                collections: (prev.collections || []).map(c =>
                                  c.id === activeGallery.id ? { ...c, images: (c.images || []).filter((_, i) => i !== idx) } : c
                                )
                              }));
                            }}
                            className="w-full mt-2 px-2 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 text-[10px] font-black uppercase"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card title="Gallery Preview" className="h-fit xl:sticky xl:top-24">
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">{activeGallery?.name || 'Gallery'}</p>
                <div className="grid grid-cols-2 gap-2">
                  {(activeGallery?.images || []).slice(0, 8).map(image => (
                    <img key={image.id} src={getMediaUrl(image.url)} alt={image.caption} className="w-full aspect-square object-cover rounded-lg border border-zinc-800" />
                  ))}
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
