const express = require("express");
const router = express.Router();
const { toggleBookmark, getBookmarkedQuestions, addNotes } = require("../controllers/bookmarkController");

// POST /api/bookmark/:id - Toggle bookmark on a question
router.post("/bookmark/:id", toggleBookmark);

// GET /api/bookmark - Get all bookmarked questions
router.get("/bookmark", getBookmarkedQuestions);

// PATCH /api/bookmark/:id - Add or update notes
router.patch("/bookmark/:id", addNotes);

module.exports = router;
