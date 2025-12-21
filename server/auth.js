import jwt from 'jsonwebtoken';

const cookieName = 'lkc_admin_token';

export const createToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required');
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
};

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.[cookieName];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const hasSession = (req) => {
  const token = req.cookies?.[cookieName];
  if (!token) return false;
  try {
    const secret = process.env.JWT_SECRET;
    jwt.verify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
};
