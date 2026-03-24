// ================================
// CodeTrack Dashboard JavaScript
// Connected to JSON File Storage API
// ================================

// Dynamic API URL - works locally and on deployment
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : '/api';

// Get authenticated username from localStorage (set during login)
let USERNAME = localStorage.getItem('username');
if (!USERNAME) {
  console.warn('⚠️ No username found in localStorage. Redirecting to login...');
  window.location.href = 'login.html';
}

// Helper function to get auth headers
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

console.log('Dashboard loaded successfully!');
console.log('API URL:', API_URL);
console.log('Authenticated user:', USERNAME);

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
  loadDashboardData();
  initProgressChart();
});

// ================================
// API FUNCTIONS (JSON Storage)
// ================================

// Fetch questions for a user
async function fetchQuestions(username) {
  try {
    console.log(`📚 Fetching questions for ${username}...`);
    const response = await fetch(`${API_URL}/questions/${username}`, {
      headers: getAuthHeader()
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error('⚠️ Authentication failed');
        window.location.href = 'login.html';
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      console.error('❌ API returned error:', data.message);
      throw new Error(data.message || 'Failed to fetch questions');
    }

    console.log('✅ Questions received:', data);
    return data;

  } catch (error) {
    console.error('❌ Error fetching questions:', error.message);
    return null;
  }
}

// Fetch revisions for a user
async function fetchRevisions(username) {
  try {
    console.log(`📋 Fetching revisions for ${username}...`);
    const response = await fetch(`${API_URL}/revision/${username}`, {
      headers: getAuthHeader()
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error('⚠️ Authentication failed');
        window.location.href = 'login.html';
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      console.error('❌ API returned error:', data.message);
      throw new Error(data.message || 'Failed to fetch revisions');
    }

    console.log('✅ Revisions received:', data);
    return data;

  } catch (error) {
    console.error('❌ Error fetching revisions:', error.message);
    return null;
  }
}

// Add a new question
async function addNewQuestion(name, topic, difficulty) {
  try {
    const payload = {
      username: USERNAME,
      name: name.trim(),
      topic: topic.trim().toLowerCase(),
      difficulty: difficulty.trim().toLowerCase()
    };

    console.log('📤 Adding new question:', payload);

    const response = await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to add question');
    }

    console.log('✅ Question added:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error adding question:', error.message);
    return { success: false, message: error.message };
  }
}

// Mark revision complete
async function markComplete(questionId, revisionType) {
  try {
    const payload = { revisionType };
    
    console.log(`✏️ Marking revision complete:`, { questionId, revisionType });

    const response = await fetch(`${API_URL}/revision/${USERNAME}/${questionId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to mark revision complete');
    }

    console.log('✅ Revision marked complete:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error marking complete:', error.message);
    return { success: false, message: error.message };
  }
}

// ================================
// UI UPDATE FUNCTIONS
// ================================

// Update metric cards
function updateMetricCards(questionsData, revisionsData) {
  if (!questionsData) return;

  const { totalQuestions, stats } = questionsData;
  const revSummary = revisionsData?.summary || { dueToday: 0, completed: 0, upcoming: 0 };

  // Find all metric cards
  const metricCards = document.querySelectorAll('.metric-card');

  // Total Solved (first card)
  if (metricCards[0]) {
    const valueEl = metricCards[0].querySelector('.metric-value');
    const metaEl = metricCards[0].querySelector('.metric-meta');
    if (valueEl) valueEl.textContent = totalQuestions || 0;
    if (metaEl) {
      const easy = stats?.easy || 0;
      const medium = stats?.medium || 0;
      const hard = stats?.hard || 0;
      metaEl.textContent = `Easy: ${easy} • Medium: ${medium} • Hard: ${hard}`;
    }
  }

  // Revision Progress (second card)
  if (metricCards[1]) {
    const valueEl = metricCards[1].querySelector('.metric-value');
    const metaEl = metricCards[1].querySelector('.metric-meta');
    const dueToday = revSummary.dueToday || 0;
    const completed = revSummary.completed || 0;
    const upcoming = revSummary.upcoming || 0;
    const total = completed + upcoming + dueToday;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    if (valueEl) valueEl.textContent = percent + '%';
    if (metaEl) metaEl.textContent = `${dueToday} due today`;
  }

  // Bookmarks (third card) - placeholder
  if (metricCards[2]) {
    const valueEl = metricCards[2].querySelector('.metric-value');
    if (valueEl) valueEl.textContent = '0';
  }

  // Update sidebar stats
  const sidebarStats = document.querySelectorAll('.stat-number');
  if (sidebarStats[0]) sidebarStats[0].textContent = totalQuestions || 0;
  if (sidebarStats[1]) sidebarStats[1].textContent = revSummary.dueToday || 0;
}

// Update difficulty breakdown
function updateDifficultyBreakdown(stats) {
  if (!stats) return;

  const easy = stats.easy || 0;
  const medium = stats.medium || 0;
  const hard = stats.hard || 0;
  const total = easy + medium + hard || 1;

  // Update circles
  const circles = document.querySelectorAll('.difficulty-circle span');
  if (circles.length >= 3) {
    circles[0].textContent = easy;
    circles[1].textContent = medium;
    circles[2].textContent = hard;
  }

  // Update percentages
  const percents = document.querySelectorAll('.label-percent');
  if (percents.length >= 3) {
    percents[0].textContent = Math.round((easy / total) * 100) + '%';
    percents[1].textContent = Math.round((medium / total) * 100) + '%';
    percents[2].textContent = Math.round((hard / total) * 100) + '%';
  }
}

// Update revisions list
function updateRevisionsList(revisionsData) {
  const listEl = document.querySelector('.revisions-list');
  if (!listEl || !revisionsData) return;

  // Clear existing items
  listEl.innerHTML = '';

  // Get items to show - dueToday has priority, then upcoming
  const itemsTodraw = [];
  
  // Add due today items first
  if (revisionsData.dueToday && Array.isArray(revisionsData.dueToday)) {
    itemsTodraw.push(...revisionsData.dueToday.map(item => ({
      id: item.id,
      name: item.name,
      topic: item.topic,
      difficulty: item.difficulty,
      revisionType: item.revisionType,
      dueDate: 'Today',
      priority: 'today'
    })));
  }
  
  // Add upcoming items, limited to 4 total with due today
  if (revisionsData.upcoming && Array.isArray(revisionsData.upcoming)) {
    const itemsToAdd = Math.max(0, 4 - itemsTodraw.length);
    itemsTodraw.push(...revisionsData.upcoming.slice(0, itemsToAdd).map(item => ({
      id: item.id,
      name: item.name,
      topic: item.topic,
      difficulty: item.difficulty,
      revisionType: item.revisionType,
      dueDate: item.dueDate,
      priority: 'upcoming'
    })));
  }

  if (itemsTodraw.length === 0) {
    listEl.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">No revisions scheduled</div>';
    return;
  }

  // Add items to list
  itemsTodraw.forEach(item => {
    const displayDate = item.dueDate === 'Today' ? 'Today' : formatDate(item.dueDate);
    const displayRevisionType = item.revisionType === 'day3' ? '3-day' : 
                                item.revisionType === 'day7' ? '7-day' : '15-day';
    
    listEl.innerHTML += `
      <div class="revision-row" onclick="handleRevisionClick('${item.id}', '${item.revisionType}')">
        <div class="revision-info">
          <span class="revision-name">${item.name}</span>
          <span class="revision-topic">${item.topic} • ${displayRevisionType} • ${displayDate}</span>
        </div>
        <span class="difficulty-badge ${item.difficulty || 'medium'}">${item.difficulty || 'medium'}</span>
      </div>
    `;
  });

  // Update badge with count due today
  const badge = document.querySelector('.card-badge');
  if (badge) {
    badge.textContent = revisionsData.summary?.dueToday || 0;
  }
}

// Helper function to format dates
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  } catch (e) {
    return dateStr;
  }
}

// Update topics list
function updateTopicsList(questions) {
  const listEl = document.querySelector('.topics-list');
  if (!listEl || !questions || !Array.isArray(questions)) return;

  // Count by topic
  const topicCounts = {};
  questions.forEach(q => {
    if (q.topic) {
      topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
    }
  });

  const topicEntries = Object.entries(topicCounts);
  if (topicEntries.length === 0) {
    listEl.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">No topics yet</div>';
    return;
  }

  const maxCount = Math.max(...topicEntries.map(([_, count]) => count), 1);

  // Clear and rebuild
  listEl.innerHTML = '';

  topicEntries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([topic, count]) => {
      const percent = (count / maxCount) * 100;
      const topicName = topic.charAt(0).toUpperCase() + topic.slice(1);

      listEl.innerHTML += `
        <div class="topic-row">
          <span class="topic-name">${topicName}</span>
          <div class="topic-bar">
            <div class="topic-fill" style="width: ${percent}%;"></div>
          </div>
          <span class="topic-count">${count}</span>
        </div>
      `;
    });
}

// Update user profile
function updateProfile() {
  const nameEl = document.querySelector('.user-name');
  const emailEl = document.querySelector('.user-email');
  const avatarEl = document.querySelector('.avatar');

  if (!USERNAME) {
    console.error('No username available');
    return;
  }

  const displayName = USERNAME.charAt(0).toUpperCase() + USERNAME.slice(1);
  
  if (nameEl) nameEl.textContent = displayName;
  if (emailEl) emailEl.textContent = USERNAME + '@codetrack.dev';
  if (avatarEl) avatarEl.textContent = USERNAME.substring(0, 2).toUpperCase();
}

// ================================
// EVENT HANDLERS
// ================================

// Handle revision click (mark complete)
async function handleRevisionClick(questionId, revisionType) {
  // Ensure we have valid data
  if (!questionId || !revisionType) {
    console.error('Invalid question ID or revision type');
    return;
  }

  const displayRevisionType = revisionType === 'day3' ? '3-day' : 
                              revisionType === 'day7' ? '7-day' : '15-day';

  if (confirm(`Mark ${displayRevisionType} revision as complete?`)) {
    const result = await markComplete(questionId, revisionType);
    if (result && result.success) {
      alert('✅ Revision marked complete!');
      loadDashboardData();  // Refresh
    } else {
      alert('❌ Error: ' + (result?.message || 'Failed to mark revision'));
    }
  }
}

// Handle add question (if form exists)
window.handleAddQuestion = async function(event) {
  event.preventDefault();

  const nameInput = document.getElementById('questionName');
  const topicInput = document.getElementById('questionTopic');
  const difficultyInput = document.getElementById('questionDifficulty');

  const name = nameInput?.value?.trim();
  const topic = topicInput?.value?.trim();
  const difficulty = difficultyInput?.value?.trim();

  // Validate inputs
  if (!name) {
    alert('⚠️ Please enter a question name');
    nameInput?.focus();
    return;
  }

  if (!topic) {
    alert('⚠️ Please select a topic');
    topicInput?.focus();
    return;
  }

  if (!difficulty) {
    alert('⚠️ Please select a difficulty level');
    difficultyInput?.focus();
    return;
  }

  // Add the question
  const result = await addNewQuestion(name, topic, difficulty);

  if (result && result.success) {
    alert('✅ Question added with revision schedule!');
    
    // Clear form
    if (nameInput) nameInput.value = '';
    if (topicInput) topicInput.value = '';
    if (difficultyInput) difficultyInput.value = '';
    
    // Refresh dashboard
    loadDashboardData();
  } else {
    alert('❌ Error: ' + (result?.message || 'Failed to add question'));
  }
};

// ================================
// MAIN LOAD FUNCTION
// ================================

async function loadDashboardData() {
  console.log('🚀 Loading dashboard data...');

  // Add loading state
  const mainContent = document.querySelector('.main-content');
  if (mainContent) mainContent.style.opacity = '0.6';

  try {
    // Fetch all data in parallel
    const [questionsData, revisionsData] = await Promise.all([
      fetchQuestions(USERNAME),
      fetchRevisions(USERNAME)
    ]);

    // Check if both fetches were successful
    if (!questionsData || !questionsData.success) {
      console.error('Failed to load questions');
      alert('Failed to load questions data. Please refresh the page.');
      return;
    }

    if (!revisionsData || !revisionsData.success) {
      console.error('Failed to load revisions');
      alert('Failed to load revisions data. Please refresh the page.');
      return;
    }

    // Update UI
    updateProfile();
    updateMetricCards(questionsData, revisionsData);
    updateDifficultyBreakdown(questionsData.stats);
    updateRevisionsList(revisionsData);
    updateTopicsList(questionsData.questions);

    console.log('✅ Dashboard updated successfully!');

  } catch (error) {
    console.error('❌ Dashboard load error:', error);
    alert('Error loading dashboard: ' + error.message);
  } finally {
    // Remove loading state
    if (mainContent) mainContent.style.opacity = '1';
  }
}

// ================================
// CHART.JS - PROGRESS OVER TIME
// ================================

function initProgressChart() {
  const canvas = document.getElementById('progressChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isDark = document.documentElement.classList.contains('dark');

  const progressChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [{
        label: 'Problems Solved',
        data: [2, 5, 8, 12, 18, 25],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: isDark ? '#000' : '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: isDark ? '#888' : '#666' },
          grid: { color: isDark ? '#2a2a2a' : '#e5e5e7' }
        },
        x: {
          ticks: { color: isDark ? '#888' : '#666' },
          grid: { color: isDark ? '#2a2a2a' : '#e5e5e7' }
        }
      }
    }
  });

  console.log('✅ Chart initialized!');
}

// Make functions available globally
window.handleRevisionClick = handleRevisionClick;
window.loadDashboardData = loadDashboardData;
