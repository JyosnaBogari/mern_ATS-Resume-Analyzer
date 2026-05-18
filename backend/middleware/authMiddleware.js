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
      message: 'Please sign in to get ATS score or analyze your resume',
      error: 'NO_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    // Check if token is expired
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Your session has expired. Please login again to continue.',
        error: 'TOKEN_EXPIRED'
      });
    }
    
    // Invalid or malformed token
    return res.status(403).json({
      success: false,
      message: 'Invalid authentication token. Please login again.',
      error: 'INVALID_TOKEN'
    });
  }
};