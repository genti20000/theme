import React, { useMemo, useState } from 'react';
import { HomeSectionType, useData } from '../context/DataContext';
import { NAV_LABELS, ROUTES } from '../lib/nav';

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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

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

  const {
    homeSections,
    updateHomeSections,
    homeSectionRepeats,
    updateHomeSectionRepeats,
    adminPassword,
    syncUrl,
    exportDatabase,
    purgeCache,
    highlightsData,
    featuresData,
    vibeData,
    batteryData,
    testimonialsData,
    infoSectionData,
    faqData,
    instagramHighlightsData,
    headerData,
    updateHeaderData,
    blogData,
    updateBlogData
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
    setSyncStatus('Saving');
    setSyncError('');
    try {
      const response = await fetch(syncUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: exportDatabase()
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
            onClick={() => {
              if (passInput === adminPassword) {
                setIsAuthenticated(true);
                setSyncError('');
              } else {
                setSyncError('Invalid admin key.');
              }
            }}
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
                    <div>
                      <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Favicon URL</label>
                      <input value={headerData.faviconUrl} onChange={(e) => updateHeaderData(prev => ({ ...prev, faviconUrl: e.target.value }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Meta Description</label>
                    <textarea value={headerData.siteDescription} onChange={(e) => updateHeaderData(prev => ({ ...prev, siteDescription: e.target.value }))} rows={5} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2">Logo URL</label>
                    <input value={headerData.logoUrl} onChange={(e) => updateHeaderData(prev => ({ ...prev, logoUrl: e.target.value }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
                  </div>
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
                          <input value={selectedBlog.ogImage || ''} onChange={(e) => updateBlogPost(selectedBlog.id, { ogImage: e.target.value })} placeholder="OG image URL" className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm" />
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
                    {selectedBlog.imageUrl && <img src={selectedBlog.imageUrl} alt={selectedBlog.title} className="w-full h-48 object-cover rounded-xl border border-zinc-800" />}
                    <p className="text-sm text-zinc-300">{selectedBlog.excerpt}</p>
                    <div className="text-sm text-zinc-400 whitespace-pre-line leading-relaxed">{selectedBlog.content}</div>
                  </article>
                ) : (
                  <p className="text-sm text-zinc-500">Create/select a blog post to preview.</p>
                )}
              </Card>
            </div>
          )}

          {!['Homepage', 'SEO', 'Nav', 'Blog'].includes(tab) && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <h2 className="text-xl font-black uppercase tracking-tighter">{tab}</h2>
              <p className="text-sm text-zinc-400 mt-3">Tab scaffold is ready in the new control-room layout. `SEO`, `Nav`, and `Blog` are now fully wired. Remaining tabs can be implemented next in the same non-breaking style.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
