export type MediaType = 'image' | 'video' | 'unknown';
export type MediaStatus = 'ok' | 'broken' | 'needs_fix';

export interface MediaRecord {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  mimeType?: string;
  createdAt?: string;
  status: MediaStatus;
  meta?: {
    width?: number;
    height?: number;
    duration?: number;
  };
}

const ABSOLUTE_URL = /^https?:\/\//i;
const VIDEO_EXT = /\.(mp4|mov|m4v|webm|ogg)(\?|$)/i;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif|bmp)(\?|$)/i;

export const FILES_BASE_URL = (
  (import.meta.env.VITE_FILES_BASE_URL as string | undefined) ||
  'https://files.londonkaraoke.club/uploads/'
).replace(/\/+$/, '/') ;

export const inferMediaType = (input: Partial<MediaRecord>): MediaType => {
  const mime = (input.mimeType || '').toLowerCase();
  const probe = `${input.url || ''} ${input.filename || ''}`.toLowerCase();
  if (mime.startsWith('image/') || IMAGE_EXT.test(probe)) return 'image';
  if (mime.startsWith('video/') || VIDEO_EXT.test(probe)) return 'video';
  return 'unknown';
};

export const resolveMediaUrl = (record: Partial<MediaRecord>): string => {
  const raw = (record.url || '').trim();
  if (!raw) return '';
  if (raw.startsWith('blob:')) return '';
  if (ABSOLUTE_URL.test(raw)) return raw;
  if (raw.startsWith('/uploads/')) return `${FILES_BASE_URL}${raw.replace(/^\/uploads\//, '')}`;
  if (raw.startsWith('uploads/')) return `${FILES_BASE_URL}${raw.replace(/^uploads\//, '')}`;
  return `${FILES_BASE_URL}${raw.replace(/^\/+/, '')}`;
};

export const normalizeMediaRecord = (input: any, index = 0): MediaRecord => {
  const urlCandidate = input?.url || input?.fileUrl || input?.file_url || input?.path || input?.filename || input?.name || '';
  const filename = (input?.filename || input?.name || (typeof urlCandidate === 'string' ? urlCandidate.split('/').pop() : '') || `media-${index + 1}`).toString();
  const resolved = resolveMediaUrl({ url: urlCandidate, filename });
  const type = inferMediaType({ url: resolved || urlCandidate, filename, mimeType: input?.mimeType || input?.mime });
  const looksBlob = String(urlCandidate).startsWith('blob:') || filename.toLowerCase().includes('_blob');
  const status: MediaStatus = looksBlob ? 'broken' : (input?.status || (resolved ? 'ok' : 'needs_fix'));
  return {
    id: String(input?.id || `${filename}-${index}`),
    type,
    url: resolved,
    thumbnailUrl: resolveMediaUrl({ url: input?.thumbnailUrl || input?.thumbnail || '' }) || undefined,
    filename,
    mimeType: input?.mimeType || input?.mime || undefined,
    createdAt: input?.createdAt || input?.created_at || undefined,
    status: status === 'ok' || status === 'broken' || status === 'needs_fix' ? status : 'ok',
    meta: input?.meta || undefined
  };
};
