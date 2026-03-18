export type SeoPageType = 'normal' | 'job_posting' | 'livestream';
export type SeoActionType = 'revalidate' | 'sitemap_ping' | 'indexnow' | 'inspect' | 'google_indexing_api' | 'full_workflow';
export type SeoActionStatus = 'success' | 'warning' | 'error';

export interface SeoLogEntry {
  id: string;
  url: string;
  normalized_path: string;
  page_type: SeoPageType | string;
  action_type: SeoActionType | string;
  status: SeoActionStatus | string;
  response_summary: any;
  created_at: string;
  initiated_by: string;
}

export interface SeoCapabilities {
  revalidate: boolean;
  indexNow: boolean;
  searchConsoleInspection: boolean;
  googleIndexingApi: boolean;
}

export interface SeoDashboardState {
  canonicalSiteUrl: string;
  logs: SeoLogEntry[];
  capabilities: SeoCapabilities;
}

export interface SeoActionResponse {
  success: boolean;
  result?: SeoLogEntry;
  error?: string;
}
