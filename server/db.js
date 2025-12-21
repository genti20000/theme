import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const initDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY,
      content JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || '12345';

  if (adminEmail && adminPassword) {
    const existing = await pool.query('SELECT id FROM admin_users WHERE email = $1', [adminEmail]);
    if (existing.rowCount === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        'INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)',
        [adminEmail, passwordHash]
      );
      console.log(`Seeded admin user: ${adminEmail}`);
    }
  }
};

export const getAdminByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
  return result.rows[0];
};

export const getSiteSettings = async () => {
  const result = await pool.query('SELECT content FROM site_settings WHERE id = 1');
  return result.rows[0]?.content ?? null;
};

export const saveSiteSettings = async (content) => {
  await pool.query(
    `INSERT INTO site_settings (id, content, updated_at)
     VALUES (1, $1, NOW())
     ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`,
    [content]
  );
};

export default pool;
