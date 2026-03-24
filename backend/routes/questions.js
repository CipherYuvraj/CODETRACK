const express = require("express");
const router = express.Router();
const { createQuestion, getRevisionQuestions, markRevisionComplete } = require("../controllers/questionController");

// POST /api/question - Add a new solved question
router.post("/question", createQuestion);

// GET /api/revision - Get today's revision questions
router.get("/revision", getRevisionQuestions);

// PATCH /api/revision/:id - Mark a revision as complete
router.patch("/revision/:id", markRevisionComplete);

module.exports = router;
