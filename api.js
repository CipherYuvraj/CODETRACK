// ================================
// API MODULE - Backend Connection
// ================================

const API_BASE_URL = 'http://localhost:5000/api';

// ================================
// FETCH FUNCTIONS (Step-by-step)
// ================================

/**
 * Step 1: Fetch User Portfolio
 *
 * What it does:
 * - Calls GET /api/user/:username
 * - Returns complete user data
 *
 * Response example:
 * {
 *   username: "john",
 *   profileStats: { totalSolved: 10, difficultyBreakdown: {...}, topicBreakdown: {...} },
 *   revisionProgress: { day3: {...}, day7: {...}, day15: {...} },
 *   allQuestions: [...]
 * }
 */
async function fetchUserPortfolio(username) {
  try {
    console.log(`📥 Fetching portfolio for: ${username}`);

    // Make GET request
    const response = await fetch(`${API_BASE_URL}/user/${username}`);

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio (Status: ${response.status})`);
    }

    // Parse JSON response
    const data = await response.json();

    console.log('✅ Portfolio received:', data);
    return data.data; // Return the data object

  } catch (error) {
    console.error('❌ Error fetching portfolio:', error.message);
    throw error; // Re-throw to handle in caller
  }
}

/**
 * Step 2: Fetch Today's Revisions
 *
 * What it does:
 * - Calls GET /api/revision
 * - Returns questions that need revision today
 *
 * Response example:
 * {
 *   success: true,
 *   count: 4,
 *   data: [{ id: 1, name: "Two Sum", difficulty: "easy", revisionPhase: "day3" }]
 * }
 */
async function fetchTodayRevisions() {
  try {
    console.log('📥 Fetching today\'s revisions...');

    const response = await fetch(`${API_BASE_URL}/revision`);

    if (!response.ok) {
      throw new Error(`Failed to fetch revisions (Status: ${response.status})`);
    }

    const data = await response.json();

    console.log(`✅ Revisions received: ${data.count} items`);
    return data.data;

  } catch (error) {
    console.error('❌ Error fetching revisions:', error.message);
    throw error;
  }
}

/**
 * Step 3: Fetch Overall Stats
 *
 * What it does:
 * - Calls GET /api/stats
 * - Returns aggregated statistics
 *
 * Response example:
 * {
 *   totalSolved: 10,
 *   difficulty: { easy: 5, medium: 4, hard: 1 },
 *   topics: { arrays: 3, strings: 2, dp: 2, graphs: 1 },
 *   revisions: { day3Pending: 9, day7Pending: 10, day15Pending: 10 }
 * }
 */
async function fetchStats() {
  try {
    console.log('📊 Fetching stats...');

    const response = await fetch(`${API_BASE_URL}/stats`);

    if (!response.ok) {
      throw new Error(`Failed to fetch stats (Status: ${response.status})`);
    }

    const data = await response.json();

    console.log('✅ Stats received:', data.data);
    return data.data;

  } catch (error) {
    console.error('❌ Error fetching stats:', error.message);
    throw error;
  }
}

/**
 * Step 4: Fetch Bookmarks
 *
 * What it does:
 * - Calls GET /api/bookmark
 * - Returns all bookmarked questions
 */
async function fetchBookmarks() {
  try {
    console.log('🔖 Fetching bookmarks...');

    const response = await fetch(`${API_BASE_URL}/bookmark`);

    if (!response.ok) {
      throw new Error(`Failed to fetch bookmarks (Status: ${response.status})`);
    }

    const data = await response.json();

    console.log(`✅ Bookmarks received: ${data.count} items`);
    return data.data;

  } catch (error) {
    console.error('❌ Error fetching bookmarks:', error.message);
    throw error;
  }
}

/**
 * Step 5: Add New Question (POST)
 *
 * What it does:
 * - Calls POST /api/question
 * - Adds a new solved question
 */
async function addQuestion(questionData) {
  try {
    console.log('📝 Adding new question...');

    const response = await fetch(`${API_BASE_URL}/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(questionData)
    });

    if (!response.ok) {
      throw new Error(`Failed to add question (Status: ${response.status})`);
    }

    const data = await response.json();

    console.log('✅ Question added:', data.data);
    return data.data;

  } catch (error) {
    console.error('❌ Error adding question:', error.message);
    throw error;
  }
}

// ================================
// EXPORT FUNCTIONS
// ================================

// Make functions available globally
window.API = {
  fetchUserPortfolio,
  fetchTodayRevisions,
  fetchStats,
  fetchBookmarks,
  addQuestion
};

console.log('✅ API module loaded');
