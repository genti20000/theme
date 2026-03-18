import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { SeoActionResponse, SeoActionType, SeoDashboardState, SeoLogEntry, SeoPageType } from '../lib/seoIndexing';

const ACTIONS: Array<{ key: SeoActionType; label: string }> = [
  { key: 'revalidate', label: 'Revalidate page' },
  { key: 'sitemap_ping', label: 'Submit sitemap ping' },
  { key: 'indexnow', label: 'Submit to IndexNow' },
  { key: 'inspect', label: 'Check index status' },
  { key: 'full_workflow', label: 'Run full indexing workflow' },
];

const badgeClass = (status?: string) => {
  switch (status) {
    case 'success':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    case 'warning':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
    case 'error':
      return 'border-red-500/30 bg-red-500/10 text-red-300';
    default:
      return 'border-zinc-700 bg-zinc-800/60 text-zinc-300';
  }
};

const prettyAction = (value: string) =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());

const SeoIndexingPanel: React.FC = () => {
  const { fetchSeoDashboard, runSeoAction, syncUrl, adminPassword } = useData();
  const [url, setUrl] = useState('https://www.londonkaraoke.club/hen-do-karaoke-soho');
  const [pageType, setPageType] = useState<SeoPageType>('normal');
  const [dashboard, setDashboard] = useState<SeoDashboardState | null>(null);
  const [runningAction, setRunningAction] = useState<string>('');
  const [result, setResult] = useState<SeoLogEntry | null>(null);
  const [error, setError] = useState('');

  const logs = dashboard?.logs || [];
  const capabilities = dashboard?.capabilities;

  const warnings = useMemo(() => {
    const notes: string[] = [];
    if (!syncUrl || !adminPassword) notes.push('Set sync URL and admin key first.');
    if (!capabilities?.indexNow) notes.push('IndexNow is not configured server-side yet.');
    if (!capabilities?.searchConsoleInspection) notes.push('Search Console inspection is not configured server-side yet.');
    if (!capabilities?.googleIndexingApi) notes.push('Google Indexing API is disabled. That is correct for normal pages.');
    return notes;
  }, [syncUrl, adminPassword, capabilities]);

  const refresh = async () => {
    const next = await fetchSeoDashboard();
    setDashboard(next);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAction = async (action: SeoActionType) => {
    setError('');
    setResult(null);
    setRunningAction(action);
    const response: SeoActionResponse = await runSeoAction({ url, pageType, action });
    if (!response.success) {
      setError(response.error || 'SEO action failed.');
      setRunningAction('');
      await refresh();
      return;
    }
    setResult(response.result || null);
    setRunningAction('');
    await refresh();
  };

  return (
    <div className="space-y-6">
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest mb-2">SEO / Indexing</h3>
            <p className="text-sm text-zinc-400 max-w-3xl">
              No fake instant indexing. Normal pages use sitemap, internal-linking, inspection, and IndexNow where supported.
              Google Indexing API is blocked for normal pages and only allowed for eligible job posting or livestream URLs.
            </p>
          </div>
          <div className="text-right text-xs text-zinc-500">
            <p>Canonical host</p>
            <p className="mt-1 text-emerald-400">{dashboard?.canonicalSiteUrl || 'Loading...'}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.2fr_220px] gap-4">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.londonkaraoke.club/page"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm"
          />
          <select
            value={pageType}
            onChange={(e) => setPageType(e.target.value as SeoPageType)}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm"
          >
            <option value="normal">normal page</option>
            <option value="job_posting">job posting</option>
            <option value="livestream">livestream</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {ACTIONS.map((action) => (
            <button
              key={action.key}
              onClick={() => handleAction(action.key)}
              disabled={Boolean(runningAction)}
              className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${runningAction === action.key ? 'border-yellow-300/40 bg-yellow-400/10 text-yellow-200' : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700'} disabled:opacity-60`}
            >
              {runningAction === action.key ? 'Running…' : action.label}
            </button>
          ))}
          <button
            onClick={refresh}
            className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-zinc-700 bg-black hover:bg-zinc-900"
          >
            Refresh log
          </button>
        </div>

        {warnings.length > 0 && (
          <div className="mt-4 space-y-2">
            {warnings.map((warning) => (
              <p key={warning} className="text-xs text-amber-300 uppercase tracking-widest">{warning}</p>
            ))}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-sm font-black uppercase tracking-widest mb-4">Results</h3>
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-500">Submitted URL</p>
                  <p className="text-sm text-zinc-200 break-all mt-1">{result.url}</p>
                </div>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${badgeClass(result.status)}`}>
                  {result.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-500">Action</p>
                  <p className="mt-1 text-zinc-200">{prettyAction(result.action_type)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-500">Path</p>
                  <p className="mt-1 text-zinc-200">{result.normalized_path}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-500">Timestamp</p>
                  <p className="mt-1 text-zinc-200">{result.created_at}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Summary</p>
                <pre className="bg-black border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 overflow-auto whitespace-pre-wrap">{JSON.stringify(result.response_summary, null, 2)}</pre>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">No action run yet in this session.</p>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-sm font-black uppercase tracking-widest mb-4">Recent activity</h3>
          <div className="space-y-3 max-h-[720px] overflow-auto pr-1">
            {logs.length === 0 ? (
              <p className="text-sm text-zinc-400">No indexing activity logged yet.</p>
            ) : (
              logs.map((item) => (
                <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-widest">{prettyAction(item.action_type)}</p>
                    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-widest ${badgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400 break-all">{item.url}</p>
                  <p className="mt-2 text-[11px] text-zinc-500">{item.created_at}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SeoIndexingPanel;
