import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import { initDatabase, getAdminByEmail, getSiteSettings, saveSiteSettings } from './db.js';
import { createToken, setAuthCookie, clearAuthCookie, requireAuth, hasSession } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadRoot = path.join(__dirname, 'uploads');

const app = express();

const corsOrigin = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim());
app.use(cors({
  origin: corsOrigin?.length ? corsOrigin : true,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadRoot));

const upload = multer({ storage: multer.memoryStorage() });

const sanitizePath = (input) => {
  const safe = input.replace(/[^a-zA-Z0-9._\/-]/g, '_');
  return safe.replace(/^\/+/, '').replace(/\.\.+/g, '.');
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/session', (req, res) => {
  if (hasSession(req)) return res.json({ authenticated: true });
  return res.status(401).json({ authenticated: false });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  const user = await getAdminByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) return res.status(401).json({ message: 'Invalid credentials.' });

  const token = createToken({ id: user.id, email: user.email });
  setAuthCookie(res, token);
  return res.json({ success: true });
});

app.post('/api/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
});

app.get('/api/site-settings', async (req, res) => {
  const settings = await getSiteSettings();
  res.json(settings ?? {});
});

app.put('/api/site-settings', requireAuth, async (req, res) => {
  await saveSiteSettings(req.body || {});
  res.json({ success: true });
});

app.post('/api/uploads', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File is required.' });
  const requestedPath = req.body?.path || req.file.originalname;
  const normalized = sanitizePath(requestedPath);
  const destination = path.join(uploadRoot, path.dirname(normalized));
  await fs.mkdir(destination, { recursive: true });
  const filename = path.basename(normalized);
  const fullPath = path.join(destination, filename);
  await fs.writeFile(fullPath, req.file.buffer);

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${normalized}`;
  res.json({ url: fileUrl });
});

app.get('/api/uploads', async (req, res) => {
  const folderParam = typeof req.query.folder === 'string' ? req.query.folder : '';
  const normalized = sanitizePath(folderParam || '');
  const targetDir = path.join(uploadRoot, normalized);

  try {
    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const filePath = normalized ? `${normalized}/${entry.name}` : entry.name;
        return {
          name: entry.name,
          url: `${req.protocol}://${req.get('host')}/uploads/${filePath}`
        };
      });
    res.json({ files });
  } catch (error) {
    res.json({ files: [] });
  }
});

const port = process.env.PORT || 3001;

initDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database', error);
    process.exit(1);
  });
