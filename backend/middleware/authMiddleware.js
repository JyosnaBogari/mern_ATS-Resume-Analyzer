import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export const authenticateToken = (req, res, next) => {
  // Support both cookie-based tokens (browser) and Authorization header (API clients)
  const tokenFromCookie = req.cookies?.token;
  const authHeader = req.headers?.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};