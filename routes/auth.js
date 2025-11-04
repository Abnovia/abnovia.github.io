const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const router = express.Router();

/**
 * POST /auth/login
 * Authenticate user and return JWT token
 */
router.post(
  '/login',
  [
    check('username').trim().isLength({ min: 1 }).escape(),
    check('password').isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Invalid input',
          details: errors.array(),
        });
      }

      const { username, password } = req.body;

      // Get credentials from environment variables
      const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
      const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

      if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
        console.error('Admin credentials not configured in environment variables');
        return res.status(500).json({
          error: 'Server configuration error',
        });
      }

      // Verify username
      if (username !== ADMIN_USERNAME) {
        return res.status(401).json({
          error: 'Invalid credentials',
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid credentials',
        });
      }

      // Check if JWT_SECRET is configured
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET not configured');
        return res.status(500).json({
          error: 'Server configuration error',
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          username: username,
          role: 'admin',
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d', // Token expires in 7 days
        }
      );

      res.json({
        message: 'Login successful',
        token: token,
        expiresIn: '7d',
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed. Please try again.',
      });
    }
  }
);

/**
 * POST /auth/verify
 * Verify if a token is still valid
 */
router.post('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ valid: false, error: 'No token provided' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ valid: false, error: 'Invalid token format' });
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      valid: true,
      user: {
        username: decoded.username,
        role: decoded.role,
      },
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ valid: false, error: 'Token expired' });
    }

    return res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

module.exports = router;
