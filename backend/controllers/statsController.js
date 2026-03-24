const { getQuestions } = require("../models/Question");
const { getOverallStats } = require("../services/statsService");

// GET /stats - Get all statistics
const getStats = (req, res) => {
  try {
    const allQuestions = getQuestions();
    const stats = getOverallStats(allQuestions);

    res.status(200).json({
      success: true,
      message: "Stats retrieved successfully",
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
};

module.exports = {
  getStats
};
