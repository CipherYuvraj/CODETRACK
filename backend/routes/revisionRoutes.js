// ================================
// REVISION ROUTES (JSON Storage)
// ================================
// Handles revision tracking with 3-7-15 logic

const express = require('express');
const router = express.Router();

// Import our helper functions
const { readData, writeData } = require('../helpers/fileHelper');

/**
 * HELPER: Get today's date in YYYY-MM-DD format
 */
function getToday() {
  return new Date().toISOString().split('T')[0];
}

/**
 * GET /api/revision/:username
 *
 * What it does:
 * - Checks all questions for a user
 * - Finds which ones need revision TODAY
 * - Shows upcoming and completed revisions
 *
 * Response:
 * {
 *   "dueToday": [...],      // Questions to revise today
 *   "upcoming": [...],      // Future revisions
 *   "completed": [...]      // Already revised
 * }
 */
router.get('/:username', async (req, res) => {
  try {
    // Step 1: Get username from URL
    const { username } = req.params;
    const today = getToday();

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

    // Step 4: Categorize revisions
    const dueToday = [];    // Need to revise today
    const upcoming = [];     // Future revisions
    const completed = [];    // Already done

    // Step 5: Check each question
    user.questions.forEach(question => {
      const { revisionDates, revisionStatus } = question;

      // Check Day 3 revision
      if (!revisionStatus.day3) {
        if (revisionDates.day3 === today) {
          dueToday.push({
            ...question,
            revisionType: 'day3',
            message: '3-day revision'
          });
        } else if (revisionDates.day3 > today) {
          upcoming.push({
            id: question.id,
            name: question.name,
            topic: question.topic,
            difficulty: question.difficulty,
            revisionType: 'day3',
            dueDate: revisionDates.day3
          });
        }
      }

      // Check Day 7 revision
      if (!revisionStatus.day7) {
        if (revisionDates.day7 === today) {
          dueToday.push({
            ...question,
            revisionType: 'day7',
            message: '7-day revision'
          });
        } else if (revisionDates.day7 > today) {
          upcoming.push({
            id: question.id,
            name: question.name,
            topic: question.topic,
            difficulty: question.difficulty,
            revisionType: 'day7',
            dueDate: revisionDates.day7
          });
        }
      }

      // Check Day 15 revision
      if (!revisionStatus.day15) {
        if (revisionDates.day15 === today) {
          dueToday.push({
            ...question,
            revisionType: 'day15',
            message: '15-day revision'
          });
        } else if (revisionDates.day15 > today) {
          upcoming.push({
            id: question.id,
            name: question.name,
            topic: question.topic,
            difficulty: question.difficulty,
            revisionType: 'day15',
            dueDate: revisionDates.day15
          });
        }
      }

      // Count completed revisions
      if (revisionStatus.day3) {
        completed.push({ id: question.id, name: question.name, type: 'day3' });
      }
      if (revisionStatus.day7) {
        completed.push({ id: question.id, name: question.name, type: 'day7' });
      }
      if (revisionStatus.day15) {
        completed.push({ id: question.id, name: question.name, type: 'day15' });
      }
    });

    // Step 6: Sort upcoming by date
    upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    // Step 7: Send response
    res.json({
      success: true,
      username: username,
      today: today,
      summary: {
        dueToday: dueToday.length,
        upcoming: upcoming.length,
        completed: completed.length
      },
      dueToday: dueToday,
      upcoming: upcoming,
      completed: completed
    });

  } catch (error) {
    console.error('❌ Error getting revisions:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get revisions',
      error: error.message
    });
  }
});

/**
 * PATCH /api/revision/:username/:questionId
 *
 * What it does:
 * - Marks a revision as complete
 *
 * Request body:
 * {
 *   "revisionType": "day3"  // or "day7" or "day15"
 * }
 */
router.patch('/:username/:questionId', async (req, res) => {
  try {
    const { username, questionId } = req.params;
    const { revisionType } = req.body;

    // Validate revision type
    if (!['day3', 'day7', 'day15'].includes(revisionType)) {
      return res.status(400).json({
        success: false,
        message: 'revisionType must be: day3, day7, or day15'
      });
    }

    // Read data
    const data = await readData();

    // Find user
    const userIndex = data.users.findIndex(u => u.username === username);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `User "${username}" not found!`
      });
    }

    // Find question
    const questionIndex = data.users[userIndex].questions.findIndex(
      q => q.id === parseInt(questionId)
    );
    if (questionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Question not found!'
      });
    }

    // Mark revision as complete
    data.users[userIndex].questions[questionIndex].revisionStatus[revisionType] = true;

    // Save to file
    await writeData(data);

    console.log(`✅ Revision marked complete: ${revisionType} for question ${questionId}`);
    res.json({
      success: true,
      message: `${revisionType} revision marked as complete!`,
      data: data.users[userIndex].questions[questionIndex]
    });

  } catch (error) {
    console.error('❌ Error updating revision:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update revision',
      error: error.message
    });
  }
});

module.exports = router;
