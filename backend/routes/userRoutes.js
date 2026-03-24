// ================================
// USER ROUTES
// ================================
// Handles all user-related API endpoints

const express = require('express');
const router = express.Router();

// Import our helper functions
const { readData, writeData } = require('../helpers/fileHelper');

/**
 * POST /api/user
 *
 * What it does:
 * - Creates a new user
 * - Saves to data.json
 *
 * Request body:
 * {
 *   "username": "john"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "User created!",
 *   "data": { username, questions: [] }
 * }
 */
router.post('/', async (req, res) => {
  try {
    // Step 1: Get username from request body
    const { username } = req.body;

    // Step 2: Validate - make sure username is provided
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required!'
      });
    }

    // Step 3: Read current data from file
    const data = await readData();

    // Step 4: Check if user already exists
    const existingUser = data.users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists!'
      });
    }

    // Step 5: Create new user object
    const newUser = {
      username: username,
      questions: [],           // Empty array for questions
      createdAt: new Date().toISOString()
    };

    // Step 6: Add to users array
    data.users.push(newUser);

    // Step 7: Save back to file
    await writeData(data);

    // Step 8: Send success response
    console.log(`✅ User created: ${username}`);
    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      data: newUser
    });

  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

/**
 * GET /api/user/:username
 *
 * What it does:
 * - Gets a specific user's data
 */
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Read data
    const data = await readData();

    // Find user
    const user = data.users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    });
  }
});

module.exports = router;
