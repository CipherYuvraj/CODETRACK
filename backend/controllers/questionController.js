const { Question, addQuestion, getQuestions, getQuestionById } = require("../models/Question");
const { generateRevisionDates, generateRevisionStatus, getRevisionQuestionsForToday } = require("../services/revisionService");

// POST /question - Add a new solved question
const createQuestion = (req, res) => {
  try {
    const { name, topic, difficulty, username } = req.body;

    // Validation
    if (!name || !topic || !difficulty) {
      return res.status(400).json({
        error: "Missing required fields: name, topic, difficulty"
      });
    }

    // Check if difficulty is valid
    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        error: "Difficulty must be: easy, medium, or hard"
      });
    }

    // Create new question (with optional username, defaults to demo_user)
    const newQuestion = new Question(name, topic, difficulty, username);

    // Generate revision dates and status
    newQuestion.revisionDates = generateRevisionDates(newQuestion.solvedDate);
    newQuestion.revisionStatus = generateRevisionStatus();

    // Save to storage
    addQuestion(newQuestion);

    // Return the created question
    res.status(201).json({
      success: true,
      message: "Question added successfully!",
      data: newQuestion
    });

  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
};

// GET /revision - Get today's revision questions
const getRevisionQuestions = (req, res) => {
  try {
    const allQuestions = getQuestions();
    const revisionQuestions = getRevisionQuestionsForToday(allQuestions);

    res.status(200).json({
      success: true,
      message: `Found ${revisionQuestions.length} questions to revise today`,
      count: revisionQuestions.length,
      data: revisionQuestions
    });

  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
};

// PATCH /revision/:id - Mark a revision as complete
const markRevisionComplete = (req, res) => {
  try {
    const { id } = req.params;
    const { phase } = req.body; // phase should be: day3, day7, or day15

    // Validation
    if (!phase) {
      return res.status(400).json({
        error: "Missing required field: phase (day3, day7, or day15)"
      });
    }

    if (!["day3", "day7", "day15"].includes(phase)) {
      return res.status(400).json({
        error: "Phase must be: day3, day7, or day15"
      });
    }

    // Find the question
    const question = getQuestionById(id);
    if (!question) {
      return res.status(404).json({
        error: `Question with ID ${id} not found`
      });
    }

    // Mark the revision as complete
    question.revisionStatus[phase] = true;

    // Return updated question
    res.status(200).json({
      success: true,
      message: `${phase.charAt(0).toUpperCase() + phase.slice(1)} revision marked complete!`,
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
  createQuestion,
  getRevisionQuestions,
  markRevisionComplete
};
