// ================================
// BOOKMARK ROUTES
// ================================
// Toggle and manage bookmarked questions

const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../helpers/fileHelper');

/**
 * POST /api/bookmark/:questionId/toggle
 * Toggle bookmark status for a question
 * Protected: requires valid JWT token
 */
router.post('/:questionId/toggle', async (req, res) => {
  try {
    const { questionId } = req.params;
    const username = req.user.username;

    const data = await readData();
    const user = data.users.find(u => u.username === username);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find the question in user's questions
    const question = user.questions.find(q => q.id === parseInt(questionId));

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Toggle bookmarked flag
    if (question.bookmarked === undefined) {
      question.bookmarked = true;
    } else {
      question.bookmarked = !question.bookmarked;
    }

    await writeData(data);

    res.json({
      success: true,
      bookmarked: question.bookmarked,
      message: `Question ${question.bookmarked ? 'bookmarked' : 'unbookmarked'}`
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * GET /api/bookmarks/:username
 * Fetch all bookmarked questions for a user
 * Protected: requires valid JWT token
 */
router.get('/:username', async (req, res) => {
  try {
    // Check ownership
    if (req.user.username !== req.params.username) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const data = await readData();
    const user = data.users.find(u => u.username === req.params.username);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get bookmarked questions
    const bookmarked = user.questions.filter(q => q.bookmarked === true);

    res.json({
      success: true,
      count: bookmarked.length,
      bookmarks: bookmarked
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
