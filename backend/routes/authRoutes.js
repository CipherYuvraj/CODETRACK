// ================================
// AUTH ROUTES
// ================================
// Handles user registration and login with JWT authentication

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import our helper functions
const { readData, writeData } = require('../helpers/fileHelper');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * POST /api/auth/register
 *
 * What it does:
 * - Creates a new user account
 * - Hashes password using bcryptjs
 * - Saves to data.json
 *
 * Request body:
 * {
 *   "username": "john",
 *   "password": "SecurePass123!"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "User registered successfully!",
 *   "data": { username, createdAt }
 * }
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Step 1: Validate inputs
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required!'
      });
    }

    // Username validation: alphanumeric, 3-20 chars
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: 'Username must be 3-20 characters (alphanumeric and underscore only)'
      });
    }

    // Password validation: min 6 chars, at least 1 uppercase, 1 number
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 1 uppercase letter and 1 number'
      });
    }

    // Step 2: Read current data
    const data = await readData();

    // Step 3: Check if user already exists
    const existingUser = data.users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists!'
      });
    }

    // Step 4: Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Step 5: Create new user object
    const newUser = {
      username: username,
      password: hashedPassword,    // Store hashed password
      questions: [],
      createdAt: new Date().toISOString()
    };

    // Step 6: Save to file
    data.users.push(newUser);
    await writeData(data);

    // Step 7: Send success response (don't return password)
    console.log(`✅ User registered: ${username}`);
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: {
        username: newUser.username,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error registering user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/login
 *
 * What it does:
 * - Validates username and password
 * - Returns JWT token if valid
 *
 * Request body:
 * {
 *   "username": "john",
 *   "password": "SecurePass123!"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Login successful!",
 *   "token": "eyJhbGc...",
 *   "username": "john"
 * }
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Step 1: Validate inputs
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required!'
      });
    }

    // Step 2: Read current data
    const data = await readData();

    // Step 3: Find user
    const user = data.users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password!'
      });
    }

    // Step 4: Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password!'
      });
    }

    // Step 5: Generate JWT token
    const token = jwt.sign(
      {
        username: user.username,
        createdAt: user.createdAt
      },
      JWT_SECRET,
      { expiresIn: '24h' }  // Token valid for 24 hours
    );

    // Step 6: Send success response
    console.log(`✅ User logged in: ${username}`);
    res.json({
      success: true,
      message: 'Login successful!',
      token: token,
      username: user.username
    });

  } catch (error) {
    console.error('❌ Error logging in:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message
    });
  }
});

module.exports = router;
