// ================================
// AUTH MIDDLEWARE
// ================================
// Verifies JWT tokens and protects routes

const jwt = require('jsonwebtoken');

// Secret key for JWT (must match authRoutes.js)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware to verify JWT token
 * 
 * Expects: Authorization header with "Bearer <token>"
 * Attaches: req.user object with username and token claims
 * Returns: 401 if token is missing or invalid
 */
const authMiddleware = (req, res, next) => {
  try {
    // Step 1: Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing!'
      });
    }

    // Step 2: Extract token from "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format!'
      });
    }

    const token = parts[1];

    // Step 3: Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;  // Attach decoded payload to request
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired!'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token!'
      });
    }

  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

module.exports = authMiddleware;
