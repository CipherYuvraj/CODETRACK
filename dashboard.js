// ================================
// CodeTrack Dashboard JavaScript
// Connected to JSON File Storage API
// ================================

// Dynamic API URL - works locally and on deployment
const API_URL = window.location.hostname === 'localhost'
  ? `${window.location.protocol}//${window.location.hostname}:5000/api`
  : `${window.location.protocol}//${window.location.hostname}/api`;
const USERNAME = 'vaishnavi';  // ← Change this to your name!

console.log('Dashboard loaded successfully!');
console.log('API URL:', API_URL);

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
    console.log(`Fetching questions for ${username}...`);
    const response = await fetch(`${API_URL}/questions/${username}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
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
    console.log(`Fetching revisions for ${username}...`);
    const response = await fetch(`${API_URL}/revision/${username}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
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
    const response = await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: USERNAME,
        name,
        topic,
        difficulty
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error adding question:', error.message);
    return { success: false, message: error.message };
  }
}

// Mark revision complete
async function markComplete(questionId, revisionType) {
  try {
    const response = await fetch(`${API_URL}/revision/${USERNAME}/${questionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revisionType })
    });
    const data = await response.json();
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
    if (valueEl) valueEl.textContent = totalQuestions;
    if (metaEl) metaEl.textContent = `Easy: ${stats.easy} • Medium: ${stats.medium} • Hard: ${stats.hard}`;
  }

  // Revision Progress (second card)
  if (metricCards[1]) {
    const valueEl = metricCards[1].querySelector('.metric-value');
    const metaEl = metricCards[1].querySelector('.metric-meta');
    const total = revSummary.completed + revSummary.upcoming + revSummary.dueToday;
    const percent = total > 0 ? Math.round((revSummary.completed / total) * 100) : 0;
    if (valueEl) valueEl.textContent = percent + '%';
    if (metaEl) metaEl.textContent = `${revSummary.dueToday} due today`;
  }

  // Bookmarks (third card) - placeholder
  if (metricCards[2]) {
    const valueEl = metricCards[2].querySelector('.metric-value');
    if (valueEl) valueEl.textContent = '0';
  }

  // Update sidebar stats
  const sidebarStats = document.querySelectorAll('.stat-number');
  if (sidebarStats[0]) sidebarStats[0].textContent = totalQuestions;
  if (sidebarStats[1]) sidebarStats[1].textContent = revSummary.dueToday;
}

// Update difficulty breakdown
function updateDifficultyBreakdown(stats) {
  if (!stats) return;

  const total = stats.easy + stats.medium + stats.hard || 1;

  // Update circles
  const circles = document.querySelectorAll('.difficulty-circle span');
  if (circles.length >= 3) {
    circles[0].textContent = stats.easy;
    circles[1].textContent = stats.medium;
    circles[2].textContent = stats.hard;
  }

  // Update percentages
  const percents = document.querySelectorAll('.label-percent');
  if (percents.length >= 3) {
    percents[0].textContent = Math.round((stats.easy / total) * 100) + '%';
    percents[1].textContent = Math.round((stats.medium / total) * 100) + '%';
    percents[2].textContent = Math.round((stats.hard / total) * 100) + '%';
  }
}

// Update revisions list
function updateRevisionsList(revisionsData) {
  const listEl = document.querySelector('.revisions-list');
  if (!listEl || !revisionsData) return;

  // Clear existing items
  listEl.innerHTML = '';

  // Get items to show
  const items = [...(revisionsData.dueToday || []), ...(revisionsData.upcoming || []).slice(0, 4)];

  if (items.length === 0) {
    listEl.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">No revisions scheduled</div>';
    return;
  }

  // Add items
  items.forEach(item => {
    const dueText = item.dueDate ? item.dueDate : 'Today';
    listEl.innerHTML += `
      <div class="revision-row" onclick="handleRevisionClick(${item.id}, '${item.revisionType}')">
        <div class="revision-info">
          <span class="revision-name">${item.name}</span>
          <span class="revision-topic">${item.topic} • ${item.revisionType} • ${dueText}</span>
        </div>
        <span class="difficulty-badge ${item.difficulty}">${item.difficulty}</span>
      </div>
    `;
  });

  // Update badge
  const badge = document.querySelector('.card-badge');
  if (badge) {
    badge.textContent = revisionsData.summary?.dueToday || 0;
  }
}

// Update topics list
function updateTopicsList(questions) {
  const listEl = document.querySelector('.topics-list');
  if (!listEl || !questions) return;

  // Count by topic
  const topicCounts = {};
  questions.forEach(q => {
    topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(topicCounts), 1);

  // Clear and rebuild
  listEl.innerHTML = '';

  Object.entries(topicCounts)
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

  if (nameEl) nameEl.textContent = USERNAME.charAt(0).toUpperCase() + USERNAME.slice(1);
  if (emailEl) emailEl.textContent = USERNAME + '@codetrack.dev';
  if (avatarEl) avatarEl.textContent = USERNAME.substring(0, 2).toUpperCase();
}

// ================================
// EVENT HANDLERS
// ================================

// Handle revision click (mark complete)
async function handleRevisionClick(questionId, revisionType) {
  if (confirm(`Mark ${revisionType} revision as complete?`)) {
    const result = await markComplete(questionId, revisionType);
    if (result.success) {
      alert('Revision marked complete!');
      loadDashboardData();  // Refresh
    } else {
      alert('Error: ' + result.message);
    }
  }
}

// Handle add question (if form exists)
window.handleAddQuestion = async function(event) {
  event.preventDefault();

  const name = document.getElementById('questionName')?.value;
  const topic = document.getElementById('questionTopic')?.value;
  const difficulty = document.getElementById('questionDifficulty')?.value;

  if (!name || !topic || !difficulty) {
    alert('Please fill all fields');
    return;
  }

  const result = await addNewQuestion(name, topic, difficulty);

  if (result.success) {
    alert('Question added with revision schedule!');
    loadDashboardData();

    // Clear form
    document.getElementById('questionName').value = '';
    document.getElementById('questionTopic').value = '';
  } else {
    alert('Error: ' + result.message);
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

  // Fetch all data
  const [questionsData, revisionsData] = await Promise.all([
    fetchQuestions(USERNAME),
    fetchRevisions(USERNAME)
  ]);

  // Update UI
  updateProfile();
  updateMetricCards(questionsData, revisionsData);
  updateDifficultyBreakdown(questionsData?.stats);
  updateRevisionsList(revisionsData);
  updateTopicsList(questionsData?.questions);

  // Remove loading state
  if (mainContent) mainContent.style.opacity = '1';

  console.log('✅ Dashboard updated!');
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
