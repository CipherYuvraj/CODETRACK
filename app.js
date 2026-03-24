// ================================
// MAIN APP CONTROLLER
// Orchestrates API calls and UI updates
// ================================

// Configuration
const CONFIG = {
  username: 'john', // Default username
  autoLoadOnStart: true,
  refreshInterval: null // Set to 60000 for 1-minute auto-refresh
};

// ================================
// LOADING STATE HANDLER
// ================================

/**
 * Shows loading overlay
 */
function showLoading() {
  console.log('⏳ Showing loading state...');

  // Dim the main content
  const main = document.querySelector('main');
  if (main) {
    main.style.opacity = '0.5';
    main.style.pointerEvents = 'none';
  }

  // Create or show loading spinner
  let spinner = document.getElementById('loadingSpinner');
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50';
    spinner.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-lg">
        <div class="flex items-center gap-4">
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <span class="text-slate-900 dark:text-slate-100 font-medium">Loading data...</span>
        </div>
      </div>
    `;
    document.body.appendChild(spinner);
  }
  spinner.style.display = 'block';
}

/**
 * Hides loading overlay
 */
function hideLoading() {
  console.log('✅ Hiding loading state...');

  // Restore main content
  const main = document.querySelector('main');
  if (main) {
    main.style.opacity = '1';
    main.style.pointerEvents = 'auto';
  }

  // Hide spinner
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.style.display = 'none';
  }
}

// ================================
// ERROR HANDLER
// ================================

/**
 * Shows error notification
 */
function showError(message) {
  console.error('❌ Error:', message);

  // Create error notification
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fixed top-4 right-4 z-50 animate-fade-in';
  errorDiv.innerHTML = `
    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg max-w-md">
      <div class="flex items-start gap-3">
        <span class="text-2xl">❌</span>
        <div class="flex-1">
          <h4 class="font-semibold text-red-900 dark:text-red-100">Error</h4>
          <p class="text-sm text-red-700 dark:text-red-300 mt-1">${message}</p>
        </div>
        <button onclick="this.closest('div.fixed').remove()" class="text-red-500 hover:text-red-700">✕</button>
      </div>
    </div>
  `;

  document.body.appendChild(errorDiv);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

/**
 * Shows success notification
 */
function showSuccess(message) {
  console.log('✅ Success:', message);

  const successDiv = document.createElement('div');
  successDiv.className = 'fixed top-4 right-4 z-50 animate-fade-in';
  successDiv.innerHTML = `
    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg max-w-md">
      <div class="flex items-start gap-3">
        <span class="text-2xl">✅</span>
        <div class="flex-1">
          <p class="text-sm text-green-700 dark:text-green-300">${message}</p>
        </div>
        <button onclick="this.closest('div.fixed').remove()" class="text-green-500 hover:text-green-700">✕</button>
      </div>
    </div>
  `;

  document.body.appendChild(successDiv);

  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

// ================================
// MAIN DATA LOADER
// ================================

/**
 * Loads all dashboard data
 *
 * Steps:
 * 1. Show loading state
 * 2. Fetch portfolio data
 * 3. Update all UI sections
 * 4. Hide loading state
 * 5. Handle any errors
 */
async function loadDashboardData() {
  console.log('');
  console.log('═══════════════════════════════════');
  console.log('🚀 LOADING DASHBOARD DATA');
  console.log('═══════════════════════════════════');

  try {
    // Step 1: Show loading
    showLoading();

    // Step 2: Fetch data from API
    console.log(`\n📡 Fetching data for user: ${CONFIG.username}`);
    const portfolioData = await window.API.fetchUserPortfolio(CONFIG.username);

    // Check if data was received
    if (!portfolioData) {
      throw new Error('No portfolio data received');
    }

    console.log('\n📊 Portfolio data summary:');
    console.log(`  • Total Solved: ${portfolioData.profileStats.totalSolved}`);
    console.log(`  • Easy: ${portfolioData.profileStats.difficultyBreakdown.easy}`);
    console.log(`  • Medium: ${portfolioData.profileStats.difficultyBreakdown.medium}`);
    console.log(`  • Hard: ${portfolioData.profileStats.difficultyBreakdown.hard}`);
    console.log(`  • Topics: ${Object.keys(portfolioData.profileStats.topicBreakdown).length}`);

    // Step 3: Update UI sections (one by one)
    console.log('\n🎨 Updating UI sections:');

    window.UIUpdater.updateProfile(portfolioData);
    window.UIUpdater.updateMetricCards(portfolioData);
    window.UIUpdater.updateDifficultyBreakdown(portfolioData);
    window.UIUpdater.updateRevisionPanels(portfolioData);
    window.UIUpdater.updateTopicProgress(portfolioData);
    window.UIUpdater.updateQuickStats(portfolioData);

    // Step 4: Hide loading
    hideLoading();

    // Step 5: Show success message
    showSuccess('Dashboard updated successfully!');

    console.log('\n═══════════════════════════════════');
    console.log('✅ DASHBOARD LOADED SUCCESSFULLY');
    console.log('═══════════════════════════════════');
    console.log('');

  } catch (error) {
    // Hide loading on error
    hideLoading();

    // Show error notification
    showError(error.message || 'Failed to load dashboard data');

    console.log('\n═══════════════════════════════════');
    console.log('❌ DASHBOARD LOAD FAILED');
    console.log('═══════════════════════════════════');
    console.log('');
  }
}

// ================================
// INITIALIZE APP
// ================================

/**
 * Initializes the dashboard
 *
 * Runs when DOM is ready
 */
function initDashboard() {
  console.log('🎬 Initializing dashboard...');

  // Check if backend is running
  checkBackendStatus();

  // Load data if auto-load is enabled
  if (CONFIG.autoLoadOnStart) {
    loadDashboardData();
  }

  // Set up auto-refresh if enabled
  if (CONFIG.refreshInterval) {
    setInterval(loadDashboardData, CONFIG.refreshInterval);
    console.log(`🔄 Auto-refresh enabled: every ${CONFIG.refreshInterval / 1000}s`);
  }

  // Expose reload function globally
  window.reloadDashboard = loadDashboardData;
  console.log('✅ Dashboard initialized');
  console.log('💡 Tip: Run reloadDashboard() in console to refresh data');
}

// ================================
// BACKEND STATUS CHECK
// ================================

/**
 * Checks if backend is running
 */
async function checkBackendStatus() {
  try {
    const response = await fetch('http://localhost:5000/');
    if (response.ok) {
      console.log('✅ Backend is running on port 5000');
    }
  } catch (error) {
    console.error('❌ Backend not accessible');
    console.error('   Make sure to run: npm start');
    showError('Backend server not running. Please start the server with "npm start"');
  }
}

// ================================
// START APP WHEN DOM IS READY
// ================================

document.addEventListener('DOMContentLoaded', initDashboard);

// ================================
// EXPORT FOR CONSOLE ACCESS
// ================================

window.dashboard = {
  reload: loadDashboardData,
  setUsername: (username) => {
    CONFIG.username = username;
    loadDashboardData();
  },
  config: CONFIG
};

console.log('📦 App module loaded');
console.log('💡 Use dashboard.reload() to refresh');
console.log('💡 Use dashboard.setUsername("name") to change user');
