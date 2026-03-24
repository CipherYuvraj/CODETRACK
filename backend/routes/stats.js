const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/statsController");

// GET /api/stats - Get all statistics
router.get("/stats", getStats);

module.exports = router;
