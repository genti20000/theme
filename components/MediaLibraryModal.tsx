import React, { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { MediaRecord, resolveMedia } from '../lib/media';

type MediaTypeFilter = 'all' | 'images' | 'videos' | 'broken';
type SortMode = 'newest' | 'oldest' | 'name';

const PAGE_SIZE = 30;

interface MediaLibraryModalProps {
  isOpen: boolean;
  files: MediaRecord[];
  repairRunning: boolean;
  repairSummary?: string;
  onClose: () => void;
  onUpload: (file: File) => Promise<string | null>;
  onRefresh: () => Promise<void>;
  onRepair: () => Promise<void>;
  onCleanup: () => Promise<void>;
  onRetryBroken: (file: MediaRecord) => Promise<void>;
  onInsertSelected: (url: string) => void;
}

const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  files,
  repairRunning,
  repairSummary,
  onClose,
  onUpload,
  onRefresh,
  onRepair,
  onCleanup,
  onRetryBroken,
  onInsertSelected
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<MediaTypeFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [page, setPage] = useState(1);
  const [brokenPage, setBrokenPage] = useState(1);
  const [brokenCollapsed, setBrokenCollapsed] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const debouncedSearch = useDebounce(search, 250).trim().toLowerCase();

  useEffect(() => {
    setPage(1);
    setBrokenPage(1);
  }, [debouncedSearch, typeFilter, sortMode]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedId('');
      setSearch('');
      setTypeFilter('all');
      setSortMode('newest');
      setPage(1);
      setBrokenPage(1);
      setBrokenCollapsed(true);
    }
  }, [isOpen]);

  const normalized = useMemo(() => {
    const seen = new Set<string>();

    const rows = files.map((file, index) => {
      const resolved = resolveMedia(file);
      const status = (file.status === 'broken' || resolved.status === 'broken') ? 'broken' : 'ok';
      const key = `${file.filename || ''}|${resolved.resolvedUrl || ''}|${status}`;
      return {
        file,
        id: file.id || `${key}-${index}`,
        filename: file.filename || 'unknown',
        type: resolved.type,
        resolvedUrl: resolved.resolvedUrl,
        thumbUrl: resolved.thumbUrl,
        status,
        createdAtMs: file.createdAt ? Date.parse(file.createdAt) || 0 : 0,
        dedupeKey: key
      };
    }).filter((item) => {
      if (seen.has(item.dedupeKey)) return false;
      seen.add(item.dedupeKey);
      return true;
    });

    return rows;
  }, [files]);

  const searched = useMemo(() => {
    return normalized.filter((item) => {
      if (!debouncedSearch) return true;
      return item.filename.toLowerCase().includes(debouncedSearch);
    });
  }, [normalized, debouncedSearch]);

  const sorted = useMemo(() => {
    const next = [...searched];
    if (sortMode === 'name') {
      next.sort((a, b) => a.filename.localeCompare(b.filename));
      return next;
    }
    if (sortMode === 'oldest') {
      next.sort((a, b) => a.createdAtMs - b.createdAtMs);
      return next;
    }
    next.sort((a, b) => b.createdAtMs - a.createdAtMs);
    return next;
  }, [searched, sortMode]);

  const brokenItems = useMemo(() => sorted.filter((item) => item.status === 'broken'), [sorted]);
  const okItems = useMemo(() => sorted.filter((item) => item.status !== 'broken'), [sorted]);

  const visibleMain = useMemo(() => {
    if (typeFilter === 'broken') return [];
    if (typeFilter === 'images') return okItems.filter((item) => item.type === 'image');
    if (typeFilter === 'videos') return okItems.filter((item) => item.type === 'video');
    return okItems;
  }, [okItems, typeFilter]);

  const visibleBroken = useMemo(() => {
    if (typeFilter === 'images' || typeFilter === 'videos') return [];
    return brokenItems;
  }, [brokenItems, typeFilter]);

  const pagedMain = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return visibleMain.slice(start, start + PAGE_SIZE);
  }, [visibleMain, page]);

  const pagedBroken = useMemo(() => {
    const start = (brokenPage - 1) * PAGE_SIZE;
    return visibleBroken.slice(start, start + PAGE_SIZE);
  }, [visibleBroken, brokenPage]);

  const mainTotalPages = Math.max(1, Math.ceil(visibleMain.length / PAGE_SIZE));
  const brokenTotalPages = Math.max(1, Math.ceil(visibleBroken.length / PAGE_SIZE));

  useEffect(() => {
    if (page > mainTotalPages) setPage(mainTotalPages);
  }, [page, mainTotalPages]);

  useEffect(() => {
    if (brokenPage > brokenTotalPages) setBrokenPage(brokenTotalPages);
  }, [brokenPage, brokenTotalPages]);

  useEffect(() => {
    if (typeFilter === 'broken') setBrokenCollapsed(false);
  }, [typeFilter]);

  const selected = useMemo(() => {
    return normalized.find((item) => item.id === selectedId && item.status !== 'broken' && item.resolvedUrl);
  }, [normalized, selectedId]);

  const emptyState = visibleMain.length === 0 && visibleBroken.length === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm p-3 sm:p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl h-[88vh] sm:h-[85vh] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest">Media Library</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-zinc-800 text-xs uppercase font-black">Close</button>
        </div>

        <div className="p-3 sm:p-4 border-b border-zinc-800 flex flex-wrap items-center gap-2">
          <label className="px-3 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-xs font-black uppercase cursor-pointer">
            Upload Media
            <input
              type="file"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const insertedUrl = await onUpload(file);
                if (insertedUrl) onInsertSelected(insertedUrl);
              }}
            />
          </label>
          <button onClick={onRefresh} className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-black uppercase">Refresh</button>
          <button onClick={onRepair} disabled={repairRunning} className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-xs font-black uppercase">
            {repairRunning ? 'Repairing...' : 'Rebuild Thumbnails'}
          </button>
          <button onClick={onCleanup} disabled={repairRunning} className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-xs font-black uppercase">
            Cleanup Broken Records
          </button>
          {repairSummary && <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{repairSummary}</p>}
        </div>

        <div className="p-3 sm:p-4 border-b border-zinc-800 flex flex-col lg:flex-row lg:items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search filename"
            className="w-full lg:max-w-sm bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
          />

          <div className="flex flex-wrap gap-2">
            {(['all', 'images', 'videos', 'broken'] as MediaTypeFilter[]).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase ${typeFilter === type ? 'bg-pink-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}
              >
                {type}
              </button>
            ))}
          </div>

          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="lg:ml-auto bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {!emptyState && pagedMain.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {pagedMain.map((item) => {
                const selectedTile = selectedId === item.id;
                const canSelect = !!item.resolvedUrl;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!canSelect) return;
                      setSelectedId((prev) => (prev === item.id ? '' : item.id));
                    }}
                    className={`rounded-xl border bg-zinc-950 overflow-hidden text-left transition-colors ${selectedTile ? 'border-pink-500' : 'border-zinc-800 hover:border-pink-500'} ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="aspect-square w-full bg-black overflow-hidden border-b border-zinc-800">
                      {item.type === 'video' ? (
                        item.thumbUrl ? (
                          <img src={item.thumbUrl} alt={item.filename} loading="lazy" className="block w-full h-full object-cover" />
                        ) : (
                          <video src={item.resolvedUrl} muted playsInline preload="metadata" className="block w-full h-full object-cover" />
                        )
                      ) : item.type === 'image' ? (
                        <img src={item.resolvedUrl} alt={item.filename} loading="lazy" className="block w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">No Preview</div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 truncate">{item.filename}</p>
                      <span className="inline-flex mt-1 text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">ok</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {visibleMain.length > PAGE_SIZE && (
            <div className="flex items-center justify-end gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2.5 py-1.5 rounded bg-zinc-800 disabled:opacity-40 text-xs font-black uppercase">Prev</button>
              <span className="text-xs text-zinc-400">Page {page} / {mainTotalPages}</span>
              <button disabled={page >= mainTotalPages} onClick={() => setPage((p) => Math.min(mainTotalPages, p + 1))} className="px-2.5 py-1.5 rounded bg-zinc-800 disabled:opacity-40 text-xs font-black uppercase">Next</button>
            </div>
          )}

          {visibleBroken.length > 0 && (
            <section className="rounded-xl border border-red-900/40 bg-red-900/10">
              <button
                onClick={() => setBrokenCollapsed((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-black uppercase tracking-widest text-red-300"
              >
                <span>Broken ({visibleBroken.length})</span>
                <span>{brokenCollapsed ? '+' : '-'}</span>
              </button>

              {!brokenCollapsed && (
                <div className="p-3 border-t border-red-900/30 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {pagedBroken.map((item) => (
                      <div key={item.id} className="rounded-xl border border-red-800 bg-zinc-950 p-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 truncate">{item.filename}</p>
                        <span className="inline-flex mt-1 text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">broken</span>
                        <button
                          onClick={async () => onRetryBroken(item.file)}
                          className="mt-2 w-full px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black uppercase"
                        >
                          Retry
                        </button>
                      </div>
                    ))}
                  </div>

                  {visibleBroken.length > PAGE_SIZE && (
                    <div className="flex items-center justify-end gap-2">
                      <button disabled={brokenPage <= 1} onClick={() => setBrokenPage((p) => Math.max(1, p - 1))} className="px-2.5 py-1.5 rounded bg-zinc-800 disabled:opacity-40 text-xs font-black uppercase">Prev</button>
                      <span className="text-xs text-zinc-400">Page {brokenPage} / {brokenTotalPages}</span>
                      <button disabled={brokenPage >= brokenTotalPages} onClick={() => setBrokenPage((p) => Math.min(brokenTotalPages, p + 1))} className="px-2.5 py-1.5 rounded bg-zinc-800 disabled:opacity-40 text-xs font-black uppercase">Next</button>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {emptyState && (
            <div className="text-center py-16 text-zinc-500 text-sm">No media found</div>
          )}
        </div>

        <div className="p-3 sm:p-4 border-t border-zinc-800 flex items-center justify-between gap-3">
          <p className="text-xs text-zinc-500 truncate">
            {selected ? `Selected: ${selected.filename}` : 'Select an item to insert'}
          </p>
          <button
            disabled={!selected}
            onClick={() => selected && onInsertSelected(selected.resolvedUrl)}
            className="px-3 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-xs font-black uppercase"
          >
            Insert Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaLibraryModal;
