const express = require("express");
const path = require("path");
const questionRoutes = require("./routes/questions");
const statsRoutes = require("./routes/stats");
const bookmarkRoutes = require("./routes/bookmarks");
const portfolioRoutes = require("./routes/portfolio");
const userRoutes = require("./routes/userRoutes");  // NEW: JSON file storage
const questionRoutes2 = require("./routes/questionRoutes");  // NEW: Questions with JSON
const revisionRoutes = require("./routes/revisionRoutes");  // NEW: Revisions with JSON

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());

// CORS Middleware - Allow cross-origin requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Serve static files (CSS, JS, images) from the root directory
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use("/api", questionRoutes);
app.use("/api", statsRoutes);
app.use("/api", bookmarkRoutes);
app.use("/api", portfolioRoutes);
app.use("/api/user", userRoutes);  // NEW: User routes with JSON storage
app.use("/api/questions", questionRoutes2);  // NEW: Question routes with JSON
app.use("/api/revision", revisionRoutes);  // NEW: Revision routes with JSON

// Serve the main dashboard at root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dashboard-modern.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
