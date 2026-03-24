// ================================
// API MODULE - JSON Storage Backend
// ================================
// Connects frontend to the new JSON-based API

const API_BASE = `${window.location.protocol}//${window.location.hostname}:5000/api`;

// ================================
// USER FUNCTIONS
// ================================

/**
 * Create a new user
 */
async function createUser(username) {
  const response = await fetch(`${API_BASE}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  return response.json();
}

/**
 * Get user data
 */
async function getUser(username) {
  const response = await fetch(`${API_BASE}/user/${username}`);
  return response.json();
}

// ================================
// QUESTION FUNCTIONS
// ================================

/**
 * Add a new question
 */
async function addQuestion(username, name, topic, difficulty) {
  const response = await fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, name, topic, difficulty })
  });
  return response.json();
}

/**
 * Get all questions for a user
 */
async function getQuestions(username) {
  const response = await fetch(`${API_BASE}/questions/${username}`);
  return response.json();
}

// ================================
// REVISION FUNCTIONS
// ================================

/**
 * Get revision status for a user
 */
async function getRevisions(username) {
  const response = await fetch(`${API_BASE}/revision/${username}`);
  return response.json();
}

/**
 * Mark a revision as complete
 */
async function markRevisionComplete(username, questionId, revisionType) {
  const response = await fetch(`${API_BASE}/revision/${username}/${questionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ revisionType })
  });
  return response.json();
}

// ================================
// EXPORT FOR USE IN HTML
// ================================

window.CodeTrackAPI = {
  // User
  createUser,
  getUser,

  // Questions
  addQuestion,
  getQuestions,

  // Revisions
  getRevisions,
  markRevisionComplete
};

console.log('✅ CodeTrack API module loaded');
