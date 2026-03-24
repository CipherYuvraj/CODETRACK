const { getQuestions, getQuestionById } = require("../models/Question");

// POST /bookmark/:id - Toggle bookmark on a question
const toggleBookmark = (req, res) => {
  try {
    const { id } = req.params;

    // Find the question
    const question = getQuestionById(id);
    if (!question) {
      return res.status(404).json({
        error: `Question with ID ${id} not found`
      });
    }

    // Toggle bookmark
    question.isBookmarked = !question.isBookmarked;

    res.status(200).json({
      success: true,
      message: question.isBookmarked ? "Question bookmarked!" : "Question removed from bookmarks",
      data: question
    });

  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
};

// GET /bookmark - Get all bookmarked questions
const getBookmarkedQuestions = (req, res) => {
  try {
    const allQuestions = getQuestions();
    const bookmarked = allQuestions.filter(q => q.isBookmarked);

    res.status(200).json({
      success: true,
      message: `Found ${bookmarked.length} bookmarked questions`,
      count: bookmarked.length,
      data: bookmarked
    });

  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
};

// PATCH /bookmark/:id - Add or update notes on a question
const addNotes = (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    // Validation
    if (notes === undefined) {
      return res.status(400).json({
        error: "Missing required field: notes"
      });
    }

    // Find the question
    const question = getQuestionById(id);
    if (!question) {
      return res.status(404).json({
        error: `Question with ID ${id} not found`
      });
    }

    // Update notes
    question.notes = notes;

    res.status(200).json({
      success: true,
      message: "Notes updated successfully",
      data: question
    });

  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
};

module.exports = {
  toggleBookmark,
  getBookmarkedQuestions,
  addNotes
};
