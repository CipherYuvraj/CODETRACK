// ================================
// QUESTION ROUTES (JSON Storage)
// ================================
// Handles adding questions to users

const express = require('express');
const router = express.Router();

// Import our helper functions
const { readData, writeData } = require('../helpers/fileHelper');

/**
 * HELPER: Generate 3-7-15 Revision Dates
 *
 * What it does:
 * - Takes the date when question was solved
 * - Adds 3 days, 7 days, and 15 days
 * - Returns all three revision dates
 */
function generateRevisionDates(solvedDate) {
  const solved = new Date(solvedDate);

  // Add days helper
  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];  // Format: YYYY-MM-DD
  }

  return {
    day3: addDays(solved, 3),   // Revise after 3 days
    day7: addDays(solved, 7),   // Revise after 7 days
    day15: addDays(solved, 15)  // Revise after 15 days
  };
}

/**
 * POST /api/questions
 *
 * What it does:
 * - Adds a new question to a user
 * - Auto-generates revision dates (3-7-15)
 *
 * Request body:
 * {
 *   "username": "demo_user",
 *   "name": "Two Sum",
 *   "topic": "arrays",
 *   "difficulty": "easy"
 * }
 */
router.post('/', async (req, res) => {
  try {
    // Step 1: Get data from request
    const { username, name, topic, difficulty } = req.body;

    // Step 2: Validate required fields
    if (!username || !name || !topic || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: username, name, topic, difficulty'
      });
    }

    // Step 3: Validate difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Difficulty must be: easy, medium, or hard'
      });
    }

    // Step 4: Read current data
    const data = await readData();

    // Step 5: Find the user
    const userIndex = data.users.findIndex(u => u.username === username);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `User "${username}" not found!`
      });
    }

    // Step 6: Create the question object
    const today = new Date().toISOString().split('T')[0];  // YYYY-MM-DD
    const revisionDates = generateRevisionDates(today);

    const newQuestion = {
      id: Date.now(),  // Unique ID using timestamp
      name: name,
      topic: topic.toLowerCase(),
      difficulty: difficulty.toLowerCase(),
      solvedDate: today,
      revisionDates: revisionDates,
      revisionStatus: {
        day3: false,   // Not yet revised
        day7: false,
        day15: false
      }
    };

    // Step 7: Add question to user's questions array
    data.users[userIndex].questions.push(newQuestion);

    // Step 8: Save to file
    await writeData(data);

    // Step 9: Send response
    console.log(`✅ Question added: "${name}" for ${username}`);
    res.status(201).json({
      success: true,
      message: 'Question added successfully!',
      data: newQuestion
    });

  } catch (error) {
    console.error('❌ Error adding question:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add question',
      error: error.message
    });
  }
});

/**
 * GET /api/questions/:username
 *
 * What it does:
 * - Gets all questions for a specific user
 * - Includes stats summary
 *
 * Response:
 * {
 *   "success": true,
 *   "username": "demo_user",
 *   "totalQuestions": 3,
 *   "stats": { easy: 2, medium: 0, hard: 1 },
 *   "questions": [...]
 * }
 */
router.get('/:username', async (req, res) => {
  try {
    // Step 1: Get username from URL
    const { username } = req.params;

    // Step 2: Read data from file
    const data = await readData();

    // Step 3: Find the user
    const user = data.users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User "${username}" not found!`
      });
    }

    // Step 4: Calculate stats
    const questions = user.questions;
    const stats = {
      easy: questions.filter(q => q.difficulty === 'easy').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      hard: questions.filter(q => q.difficulty === 'hard').length
    };

    // Step 5: Send response
    res.json({
      success: true,
      username: username,
      totalQuestions: questions.length,
      stats: stats,
      questions: questions
    });

  } catch (error) {
    console.error('❌ Error getting questions:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get questions',
      error: error.message
    });
  }
});

module.exports = router;
