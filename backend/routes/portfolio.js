const express = require("express");
const router = express.Router();
const { getUserPortfolio } = require("../controllers/portfolioController");

// GET /api/user/:username - Get user's sharable portfolio
router.get("/user/:username", getUserPortfolio);

module.exports = router;
