// ================================
// CodeTrack Premium Dashboard
// API Integration & Dynamic Data
// ================================

const API_URL = 'http://localhost:5000/api';
let currentUsername = 'john';
let portfolioData = null;
let ratingChart = null;

console.log('🚀 Dashboard script loaded');

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  console.log('📄 DOM loaded, fetching data...');
  await loadDashboardData();
  initRatingChart();
  setupEventListeners();
});

// ================================
// API FUNCTIONS
// ================================

async function fetchUserPortfolio(username) {
  try {
    console.log(`📥 Fetching portfolio for ${username}...`);
    const response = await fetch(`${API_URL}/user/${username}`);

    if (!response.ok) {
      throw new Error(`Portfolio not found for ${username}`);
    }

    const data = await response.json();
    console.log('✅ Portfolio data received:', data.data);
    return data.data;

  } catch (error) {
    console.error('❌ Error fetching portfolio:', error.message);
    showError(`Failed to load portfolio: ${error.message}`);
    return null;
  }
}

async function fetchStats() {
  try {
    console.log('📊 Fetching stats...');
    const response = await fetch(`${API_URL}/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    const data = await response.json();
    console.log('✅ Stats received:', data.data);
    return data.data;

  } catch (error) {
    console.error('❌ Error fetching stats:', error.message);
    return null;
  }
}

// ================================
// LOAD DASHBOARD DATA
// ================================

async function loadDashboardData() {
  // Show loading state
  const mainContent = document.querySelector('main');
  if (mainContent) mainContent.style.opacity = '0.5';

  // Fetch portfolio
  portfolioData = await fetchUserPortfolio(currentUsername);

  if (!portfolioData) {
    console.error('Failed to load portfolio data');
    if (mainContent) mainContent.style.opacity = '1';
    return;
  }

  // Update all UI sections
  updateProfileSection();
  updateTopCards();
  updateDifficultyBreakdown();
  updateTopicsProgress();
  updateRevisionPanels();
  updateHeatmap();

  // Restore opacity
  if (mainContent) mainContent.style.opacity = '1';

  console.log('✅ Dashboard updated with real data!');
}

// ================================
// UPDATE PROFILE SECTION
// ================================

function updateProfileSection() {
  if (!portfolioData) return;

  const { username } = portfolioData;

  // Update username in sidebar
  const userNameEl = document.querySelector('main').previousElementSibling?.querySelector('.text-lg');
  if (userNameEl) {
    userNameEl.textContent = username.charAt(0).toUpperCase() + username.slice(1);
  }

  // Update header greeting
  const greetingEl = document.querySelector('h2');
  if (greetingEl) {
    greetingEl.textContent = `Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)}! 👋`;
  }

  // Update avatar initials
  const initials = username.substring(0, 2).toUpperCase();
  const avatarEl = document.querySelector('.w-16.h-16.rounded-full.bg-gradient-to-br');
  if (avatarEl) {
    avatarEl.textContent = initials;
  }
}

// ================================
// UPDATE TOP CARDS
// ================================

function updateTopCards() {
  if (!portfolioData) return;

  const { profileStats, revisionProgress } = portfolioData;

  // Total Questions
  let card = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-3 > div')[0];
  if (card) {
    const valueEl = card.querySelector('.text-4xl');
    const metaEl = card.querySelector('.text-sm.text-slate-400');
    if (valueEl) valueEl.textContent = profileStats.totalSolved;
    if (metaEl) metaEl.textContent = `Solved recently`;
  }

  // Active Days
  card = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-3 > div')[1];
  if (card) {
    const valueEl = card.querySelector('.text-4xl');
    if (valueEl) valueEl.textContent = '28'; // Default for now
  }

  // Revision Progress
  card = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-3 > div')[2];
  if (card) {
    const valueEl = card.querySelector('.text-4xl');
    const metaEl = card.querySelector('.text-sm.text-slate-400');

    const totalCompleted = revisionProgress.day3.completed + revisionProgress.day7.completed + revisionProgress.day15.completed;
    const totalPending = revisionProgress.day3.pending + revisionProgress.day7.pending + revisionProgress.day15.pending;
    const percentage = totalPending === 0 ? 100 : Math.round((totalCompleted / (totalCompleted + totalPending)) * 100);

    if (valueEl) valueEl.textContent = percentage + '%';
    if (metaEl) metaEl.textContent = `${totalPending} pending revisions`;
  }
}

// ================================
// UPDATE DIFFICULTY BREAKDOWN
// ================================

function updateDifficultyBreakdown() {
  if (!portfolioData) return;

  const { profileStats } = portfolioData;
  const { difficultyBreakdown } = profileStats;

  const total = difficultyBreakdown.easy + difficultyBreakdown.medium + difficultyBreakdown.hard;

  // Update legend
  const legends = document.querySelectorAll('svg').length > 0 ?
    document.querySelector('.mt-8.grid.grid-cols-3.gap-4')?.querySelectorAll('div') : [];

  if (legends.length >= 3) {
    // Easy
    legends[0].querySelector('.text-sm.font-semibold').textContent = difficultyBreakdown.easy;
    const easyPercent = Math.round((difficultyBreakdown.easy / total) * 100);
    legends[0].querySelector('.text-xs.text-slate-400').textContent = `${easyPercent}%`;

    // Medium
    legends[1].querySelector('.text-sm.font-semibold').textContent = difficultyBreakdown.medium;
    const mediumPercent = Math.round((difficultyBreakdown.medium / total) * 100);
    legends[1].querySelector('.text-xs.text-slate-400').textContent = `${mediumPercent}%`;

    // Hard
    legends[2].querySelector('.text-sm.font-semibold').textContent = difficultyBreakdown.hard;
    const hardPercent = Math.round((difficultyBreakdown.hard / total) * 100);
    legends[2].querySelector('.text-xs.text-slate-400').textContent = `${hardPercent}%`;
  }

  // Update total in center
  const totalEl = document.querySelector('svg')?.parentElement?.querySelector('.absolute.inset-0')?.querySelector('.text-4xl.font-bold');
  if (totalEl) {
    totalEl.textContent = profileStats.totalSolved;
  }
}

// ================================
// UPDATE TOPICS PROGRESS
// ================================

function updateTopicsProgress() {
  if (!portfolioData) return;

  const { profileStats } = portfolioData;
  const { topicBreakdown } = profileStats;

  // Find the topics section
  const topicsContainer = document.querySelector('svg').parentElement.parentElement.nextElementSibling;
  if (!topicsContainer) return;

  const topicRows = topicsContainer.querySelectorAll('.space-y-4 > div');
  const topics = Object.entries(topicBreakdown);

  topicRows.forEach((row, index) => {
    if (index < topics.length) {
      const [topic, count] = topics[index];
      const maxCount = Math.max(...Object.values(topicBreakdown));
      const percentage = (count / maxCount) * 100;

      // Update name
      const nameEl = row.querySelector('.font-semibold');
      if (nameEl) nameEl.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);

      // Update count
      const countEl = row.querySelector('.text-sm.text-slate-400');
      if (countEl) countEl.textContent = `${count} / ${maxCount * 0.8 | 0}`;

      // Update bar
      const fillEl = row.querySelector('.bg-gradient-to-r');
      if (fillEl) fillEl.style.width = percentage + '%';
    }
  });
}

// ================================
// UPDATE REVISION PANELS
// ================================

function updateRevisionPanels() {
  if (!portfolioData) return;

  const { revisionProgress, allQuestions } = portfolioData;

  // Filter questions for due today (day3 not completed)
  const dueTodayQuestions = allQuestions.filter(q => !q.revisionStatus.day3).slice(0, 2);

  // Update Due Today section
  const dueTodaySection = document.querySelector('.glassmorphic.rounded-2xl.p-6.border.border-white\\/10');
  if (dueTodaySection && dueTodaySection.querySelector('.flex.items-center.gap-2')?.textContent.includes('Due Today')) {
    const titleEl = dueTodaySection.querySelector('.flex.items-center.gap-2');
    if (titleEl) titleEl.textContent = `🔴 Due Today (${dueTodayQuestions.length})`;

    const listContainer = dueTodaySection.querySelector('.space-y-2');
    if (listContainer) {
      listContainer.innerHTML = dueTodayQuestions.map(q => `
        <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p class="text-sm font-semibold">${q.name}</p>
          <p class="text-xs text-slate-400 mt-1">${q.topic} • ${q.difficulty}</p>
        </div>
      `).join('');
    }
  }

  // Update Upcoming section
  const upcomingSection = Array.from(document.querySelectorAll('.glassmorphic.rounded-2xl.p-6'))
    .find(el => el.querySelector('.flex.items-center.gap-2')?.textContent.includes('Upcoming'));
  if (upcomingSection) {
    const titleEl = upcomingSection.querySelector('.flex.items-center.gap-2');
    if (titleEl) titleEl.textContent = `🟡 Upcoming (${revisionProgress.day7.pending})`;
  }

  // Update Completed section
  const completedSection = Array.from(document.querySelectorAll('.glassmorphic.rounded-2xl.p-6'))
    .find(el => el.querySelector('.flex.items-center.gap-2')?.textContent.includes('Completed'));
  if (completedSection) {
    const totalCompleted = revisionProgress.day3.completed + revisionProgress.day7.completed + revisionProgress.day15.completed;
    const titleEl = completedSection.querySelector('.flex.items-center.gap-2');
    if (titleEl) titleEl.textContent = `🟢 Completed (${totalCompleted})`;
  }
}

// ================================
// UPDATE HEATMAP
// ================================

function updateHeatmap() {
  if (!portfolioData) return;

  // Heatmap is visual only for now - can be enhanced with real data
  console.log('📊 Heatmap updated');
}

// ================================
// INITIALIZE RATING CHART
// ================================

function initRatingChart() {
  const canvas = document.getElementById('ratingChart');
  if (!canvas) return;

  // Use existing Chart.js initialization from HTML
  // This will be enhanced with real data if needed
  console.log('📈 Rating chart initialized');
}

// ================================
// SETUP EVENT LISTENERS
// ================================

function setupEventListeners() {
  // Heatmap cells - add interactivity
  const heatmapCells = document.querySelectorAll('svg circle');
  heatmapCells.forEach(cell => {
    cell.addEventListener('hover', function(e) {
      console.log('Cell hovered');
    });
  });

  // Platform buttons - add click handlers
  const platformButtons = document.querySelectorAll('button');
  platformButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Add your platform navigation logic here
      console.log('Platform clicked');
    });
  });
}

// ================================
// ERROR HANDLING
// ================================

function showError(message) {
  console.error('❌ Error:', message);
  // You can add a toast notification here
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fixed top-4 right-4 glassmorphic border border-red-500/50 p-4 rounded-xl text-red-400 z-50';
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// ================================
// EXPORT FOR CONSOLE
// ================================

window.dashboardAPI = {
  loadData: loadDashboardData,
  setUsername: (username) => {
    currentUsername = username;
    loadDashboardData();
  },
  getPortfolio: () => portfolioData,
  debugInfo: () => {
    console.log('Current Username:', currentUsername);
    console.log('Portfolio Data:', portfolioData);
  }
};

console.log('✅ Dashboard API ready. Use window.dashboardAPI to interact.');
