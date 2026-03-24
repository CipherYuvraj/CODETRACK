# BACKEND-FRONTEND INTEGRATION GUIDE
# ===================================

## 📋 QUICK START

### Step 1: Start Backend
```bash
cd "c:\Users\vaish\OneDrive\Desktop\code track"
npm start
```

Expected output:
```
✅ Server running on http://localhost:5000
```

### Step 2: Open Dashboard
Open dashboard.html in your browser

### Step 3: Check Browser Console
Press F12 → Console tab

You should see:
```
📦 App module loaded
✅ API module loaded
✅ UI Updater module loaded
🎬 Initializing dashboard...
✅ Backend is running on port 5000
═══════════════════════════════════
🚀 LOADING DASHBOARD DATA
═══════════════════════════════════

📡 Fetching data for user: john
📥 Fetching portfolio for: john
✅ Portfolio received: {...}

📊 Portfolio data summary:
  • Total Solved: 10
  • Easy: 5
  • Medium: 4
  • Hard: 1

🎨 Updating UI sections:
  ✓ Avatar updated: JO
  ✓ Total solved: 10
  ✓ Easy: 5
  ✓ Medium: 4
  ✓ Hard: 1
  ...

✅ DASHBOARD LOADED SUCCESSFULLY
```

---

## 🔄 HOW IT WORKS (Step-by-Step)

### Flow Diagram:
```
User Opens Dashboard
        ↓
HTML loads → Includes 3 scripts in order:
        ↓
    api.js (loaded)
        ↓
    ui-updater.js (loaded)
        ↓
    app.js (loaded)
        ↓
DOM Ready Event Fires
        ↓
initDashboard() runs
        ↓
loadDashboardData() starts
        ↓
showLoading() → Show spinner
        ↓
API.fetchUserPortfolio('john')
        ↓
GET http://localhost:5000/api/user/john
        ↓
Backend responds with JSON
        ↓
UIUpdater.updateProfile(data)
UIUpdater.updateMetricCards(data)
UIUpdater.updateDifficultyBreakdown(data)
UIUpdater.updateRevisionPanels(data)
UIUpdater.updateTopicProgress(data)
UIUpdater.updateQuickStats(data)
        ↓
hideLoading() → Hide spinner
        ↓
showSuccess() → Green notification
        ↓
Dashboard now shows REAL DATA ✅
```

---

## 📁 FILE STRUCTURE

```
code track/
├── backend/
│   ├── server.js           ← Node.js backend (port 5000)
│   ├── routes/
│   ├── controllers/
│   └── models/
├── dashboard.html           ← Main HTML file
├── api.js                   ← Step 1: Fetch functions
├── ui-updater.js            ← Step 2: DOM manipulation
└── app.js                   ← Step 3: Main controller
```

---

## 🔍 DETAILED EXPLANATION

### api.js - FETCH FUNCTIONS
```javascript
// What it does:
- Makes HTTP requests to backend
- Uses fetch() API
- Handles errors
- Returns JSON data

// Example:
const data = await API.fetchUserPortfolio('john');
// Returns: { username, profileStats, revisionProgress, allQuestions }
```

### ui-updater.js - DOM UPDATES
```javascript
// What it does:
- Finds HTML elements using querySelector
- Updates textContent, innerHTML, styles
- Changes DOM based on API data

// Example:
UIUpdater.updateProfile(portfolioData);
// Updates: Avatar, username, greeting message
```

### app.js - MAIN CONTROLLER
```javascript
// What it does:
- Coordinates API calls
- Shows loading spinner
- Handles errors
- Calls UI updaters in sequence

// Example:
loadDashboardData()
  → showLoading()
  → fetch data
  → update UI
  → hideLoading()
  → showSuccess()
```

---

## 🧪 TESTING INSTRUCTIONS

### Test 1: Check Backend Connection
```javascript
// In browser console:
fetch('http://localhost:5000/')
  .then(r => r.json())
  .then(d => console.log(d));

// Expected: {"message":"CodeTrack API is running!"}
```

### Test 2: Fetch Portfolio Manually
```javascript
API.fetchUserPortfolio('john')
  .then(data => console.log(data));

// Expected: Full portfolio object
```

### Test 3: Reload Dashboard
```javascript
dashboard.reload();

// Watch console for loading sequence
```

### Test 4: Change User
```javascript
dashboard.setUsername('sarah');

// Dashboard refreshes with new user data
```

---

## 📊 API ENDPOINTS EXPLAINED

### GET /api/user/:username
```
What: Get complete user portfolio
When to use: On page load, when changing users
Response: {
  username: "john",
  profileStats: {
    totalSolved: 10,
    difficultyBreakdown: { easy, medium, hard },
    topicBreakdown: { arrays, strings, dp, ... }
  },
  revisionProgress: {
    day3: { completed, pending },
    day7: { completed, pending },
    day15: { completed, pending }
  },
  allQuestions: [...]
}
```

### GET /api/revision
```
What: Get questions due for revision today
When to use: To populate "Due Today" panel
Response: [
  { id, name, difficulty, topic, revisionPhase: "day3" },
  ...
]
```

### GET /api/stats
```
What: Get aggregated statistics
When to use: For quick stats without full portfolio
Response: {
  totalSolved: 10,
  difficulty: { easy: 5, medium: 4, hard: 1 },
  topics: { arrays: 3, ... },
  revisions: { day3Pending: 9, ... }
}
```

---

## ❌ ERROR HANDLING

### If Backend Not Running:
```
Console: ❌ Backend not accessible
UI: Red notification "Backend server not running..."
Fix: Run npm start
```

### If User Not Found:
```
Console: ❌ Error fetching portfolio
UI: Red notification "Failed to fetch portfolio..."
Fix: Add questions for that user first
```

### If Network Error:
```
Console: ❌ Error: Network request failed
UI: Red notification with error message
Fix: Check internet, backend status
```

---

## 💡 CONSOLE HELPERS

```javascript
// Reload dashboard
dashboard.reload()

// Change user
dashboard.setUsername('john')

// Check configuration
dashboard.config

// Manual API calls
await API.fetchUserPortfolio('john')
await API.fetchTodayRevisions()
await API.fetchStats()

// Manual UI updates
UIUpdater.updateProfile(data)
UIUpdater.updateMetricCards(data)
// etc...
```

---

## 🎯 WHAT GETS UPDATED

| UI Element | Updated By | Data Source |
|------------|-----------|-------------|
| Avatar initials | updateProfile() | portfolioData.username |
| Sidebar username | updateProfile() | portfolioData.username |
| Header greeting | updateProfile() | portfolioData.username |
| Total Solved card | updateMetricCards() | profileStats.totalSolved |
| Streak card | updateMetricCards() | (default 28) |
| Revision % card | updateMetricCards() | revisionProgress |
| Easy count | updateDifficultyBreakdown() | difficultyBreakdown.easy |
| Medium count | updateDifficultyBreakdown() | difficultyBreakdown.medium |
| Hard count | updateDifficultyBreakdown() | difficultyBreakdown.hard |
| Due Today list | updateRevisionPanels() | allQuestions (filtered) |
| Upcoming count | updateRevisionPanels() | revisionProgress.day7.pending |
| Completed count | updateRevisionPanels() | sum of completed |
| Topic bars | updateTopicProgress() | topicBreakdown |
| Quick stats | updateQuickStats() | profileStats |

---

## 🔧 CUSTOMIZATION

### Change Default Username:
Edit app.js:
```javascript
const CONFIG = {
  username: 'yourname', // Change this
  ...
};
```

### Add Auto-Refresh:
Edit app.js:
```javascript
const CONFIG = {
  ...
  refreshInterval: 60000, // Refresh every 60 seconds
};
```

### Add More API Calls:
Edit api.js, add new function:
```javascript
async function fetchGitHubData(username) {
  const response = await fetch(`${API_BASE_URL}/github/${username}`);
  const data = await response.json();
  return data;
}
```

Then add to exports:
```javascript
window.API = {
  ...
  fetchGitHubData
};
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Backend running on port 5000
- [ ] Dashboard opens without errors
- [ ] Console shows "DASHBOARD LOADED SUCCESSFULLY"
- [ ] Green success notification appears
- [ ] All stat cards show real numbers
- [ ] Difficulty bars show correct counts
- [ ] Revision panels show question names
- [ ] Topic progress bars display
- [ ] No red error notifications
- [ ] Avatar shows correct initials

---

## 🚀 PRODUCTION TIPS

1. Change API URL for production:
   ```javascript
   const API_BASE_URL = 'https://your-domain.com/api';
   ```

2. Add error retry logic
3. Add offline detection
4. Add request caching
5. Add loading skeletons instead of spinner
6. Minify JavaScript files
7. Add service worker for PWA

---

## 📞 TROUBLESHOOTING

Problem: "Backend not accessible"
→ Run: npm start

Problem: "Portfolio not found"
→ Add data: curl -X POST http://localhost:5000/api/question ...

Problem: "Dashboard not updating"
→ Check console for errors
→ Try: dashboard.reload()

Problem: "Loading forever"
→ Backend might have crashed
→ Restart: npm start

---

This guide explains EVERYTHING! 🎉
Open dashboard.html and watch the magic happen! ✨
