const { getQuestionsByUsername } = require("../models/Question");
const { getOverallStats } = require("../services/statsService");

// GET /user/:username - Get user's portfolio (public profile)
const getUserPortfolio = (req, res) => {
  try {
    const { username } = req.params;

    // Get all questions for this user
    const userQuestions = getQuestionsByUsername(username);

    // If no questions found
    if (userQuestions.length === 0) {
      return res.status(404).json({
        error: `No profile found for user: ${username}`,
        message: "This user hasn't solved any questions yet."
      });
    }

    // Calculate stats for this user
    const stats = getOverallStats(userQuestions);

    // Count completed revisions
    let totalDay3Completed = 0;
    let totalDay7Completed = 0;
    let totalDay15Completed = 0;

    userQuestions.forEach(q => {
      if (q.revisionStatus.day3) totalDay3Completed++;
      if (q.revisionStatus.day7) totalDay7Completed++;
      if (q.revisionStatus.day15) totalDay15Completed++;
    });

    // Get bookmarked questions
    const bookmarkedQuestions = userQuestions.filter(q => q.isBookmarked);

    // Build portfolio response
    const portfolio = {
      username: username,
      profileStats: {
        totalSolved: stats.totalSolved,
        difficultyBreakdown: stats.difficulty,
        topicBreakdown: stats.topics
      },
      revisionProgress: {
        day3: {
          completed: totalDay3Completed,
          pending: stats.revisions.day3Pending
        },
        day7: {
          completed: totalDay7Completed,
          pending: stats.revisions.day7Pending
        },
        day15: {
          completed: totalDay15Completed,
          pending: stats.revisions.day15Pending
        }
      },
      bookmarkedCount: bookmarkedQuestions.length,
      allQuestions: userQuestions.map(q => ({
        id: q.id,
        name: q.name,
        topic: q.topic,
        difficulty: q.difficulty,
        solvedDate: q.solvedDate,
        isBookmarked: q.isBookmarked,
        notes: q.notes,
        revisionStatus: q.revisionStatus
      }))
    };

    res.status(200).json({
      success: true,
      message: `Portfolio for ${username}`,
      data: portfolio
    });

  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
};

module.exports = {
  getUserPortfolio
};
