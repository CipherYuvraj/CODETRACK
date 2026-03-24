// ================================
// UI UPDATER MODULE
// Updates DOM elements with API data
// ================================

// ================================
// STEP 1: UPDATE PROFILE SECTION
// ================================

/**
 * Updates user profile in sidebar
 *
 * What it updates:
 * - Avatar initials
 * - Username
 * - Greeting message
 */
function updateProfile(portfolioData) {
  console.log('🎨 Updating profile section...');

  const { username } = portfolioData;

  // 1. Update avatar initials
  const avatarEl = document.querySelector('.w-12.h-12.rounded-full');
  if (avatarEl) {
    const initials = username.substring(0, 2).toUpperCase();
    avatarEl.textContent = initials;
    console.log(`  ✓ Avatar updated: ${initials}`);
  }

  // 2. Update username in sidebar
  const usernameEl = document.querySelector('.text-sm.font-semibold.truncate');
  if (usernameEl) {
    usernameEl.textContent = username.charAt(0).toUpperCase() + username.slice(1);
    console.log(`  ✓ Sidebar username updated: ${username}`);
  }

  // 3. Update greeting in header
  const greetingEl = document.querySelector('h2.text-2xl');
  if (greetingEl) {
    greetingEl.textContent = `Welcome, ${username.charAt(0).toUpperCase() + username.slice(1)}! 👋`;
    console.log(`  ✓ Greeting updated`);
  }

  console.log('✅ Profile section updated');
}

// ================================
// STEP 2: UPDATE TOP METRIC CARDS
// ================================

/**
 * Updates the 3 top metric cards
 *
 * Cards:
 * 1. Total Problems Solved
 * 2. Active Streak
 * 3. Revision Progress
 */
function updateMetricCards(portfolioData) {
  console.log('🎨 Updating metric cards...');

  const { profileStats, revisionProgress } = portfolioData;

  // Get all metric cards
  const cards = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-3 > div');

  // Card 1: Total Solved
  if (cards[0]) {
    const valueEl = cards[0].querySelector('.text-4xl.font-bold');
    if (valueEl) {
      valueEl.textContent = profileStats.totalSolved;
      console.log(`  ✓ Total solved: ${profileStats.totalSolved}`);
    }
  }

  // Card 2: Active Streak (default 28 for now)
  if (cards[1]) {
    const valueEl = cards[1].querySelector('.text-4xl.font-bold');
    if (valueEl) {
      valueEl.textContent = '28';
      console.log(`  ✓ Streak: 28 days`);
    }
  }

  // Card 3: Revision Progress
  if (cards[2]) {
    const valueEl = cards[2].querySelector('.text-4xl.font-bold');
    const metaEl = cards[2].querySelector('.text-sm.text-slate-600, .text-sm.dark\\:text-slate-400');

    const totalCompleted = revisionProgress.day3.completed + revisionProgress.day7.completed + revisionProgress.day15.completed;
    const totalPending = revisionProgress.day3.pending + revisionProgress.day7.pending + revisionProgress.day15.pending;
    const percentage = totalPending === 0 ? 100 : Math.round((totalCompleted / (totalCompleted + totalPending)) * 100);

    if (valueEl) {
      valueEl.textContent = percentage + '%';
      console.log(`  ✓ Revision progress: ${percentage}%`);
    }

    if (metaEl) {
      metaEl.textContent = `${totalPending} pending`;
    }
  }

  console.log('✅ Metric cards updated');
}

// ================================
// STEP 3: UPDATE DIFFICULTY BREAKDOWN
// ================================

/**
 * Updates difficulty bars (Easy, Medium, Hard)
 *
 * What it updates:
 * - Count for each difficulty
 * - Progress bar width
 */
function updateDifficultyBreakdown(portfolioData) {
  console.log('🎨 Updating difficulty breakdown...');

  const { profileStats } = portfolioData;
  const { difficultyBreakdown } = profileStats;

  const total = difficultyBreakdown.easy + difficultyBreakdown.medium + difficultyBreakdown.hard;

  // Find difficulty section
  const difficultySection = document.querySelector('h3.text-lg.font-semibold');
  if (!difficultySection || !difficultySection.textContent.includes('By Difficulty')) {
    console.log('  ⚠️ Difficulty section not found');
    return;
  }

  const container = difficultySection.closest('.bg-white, .dark\\:bg-slate-900');
  if (!container) return;

  const rows = container.querySelectorAll('.flex.items-center.gap-4');

  // Easy
  if (rows[0]) {
    const countEl = rows[0].querySelector('.text-sm.font-bold');
    const barEl = rows[0].querySelector('.h-full');
    if (countEl) {
      countEl.textContent = difficultyBreakdown.easy;
      console.log(`  ✓ Easy: ${difficultyBreakdown.easy}`);
    }
    if (barEl && total > 0) {
      const percentage = (difficultyBreakdown.easy / total) * 100;
      barEl.style.width = percentage + '%';
    }
  }

  // Medium
  if (rows[1]) {
    const countEl = rows[1].querySelector('.text-sm.font-bold');
    const barEl = rows[1].querySelector('.h-full');
    if (countEl) {
      countEl.textContent = difficultyBreakdown.medium;
      console.log(`  ✓ Medium: ${difficultyBreakdown.medium}`);
    }
    if (barEl && total > 0) {
      const percentage = (difficultyBreakdown.medium / total) * 100;
      barEl.style.width = percentage + '%';
    }
  }

  // Hard
  if (rows[2]) {
    const countEl = rows[2].querySelector('.text-sm.font-bold');
    const barEl = rows[2].querySelector('.h-full');
    if (countEl) {
      countEl.textContent = difficultyBreakdown.hard;
      console.log(`  ✓ Hard: ${difficultyBreakdown.hard}`);
    }
    if (barEl && total > 0) {
      const percentage = (difficultyBreakdown.hard / total) * 100;
      barEl.style.width = percentage + '%';
    }
  }

  console.log('✅ Difficulty breakdown updated');
}

// ================================
// STEP 4: UPDATE REVISION PANELS
// ================================

/**
 * Updates revision status panels
 *
 * Panels:
 * 1. Due Today (red)
 * 2. Upcoming (yellow)
 * 3. Completed (green)
 */
function updateRevisionPanels(portfolioData) {
  console.log('🎨 Updating revision panels...');

  const { revisionProgress, allQuestions } = portfolioData;

  // Find all revision panels
  const panels = document.querySelectorAll('.space-y-4 > div');

  // Due Today (panel with red dot)
  const dueTodayPanel = Array.from(panels).find(panel =>
    panel.querySelector('.bg-red-500')
  );

  if (dueTodayPanel) {
    const titleEl = dueTodayPanel.querySelector('h3.text-lg');
    const dueTodayQuestions = allQuestions.filter(q => !q.revisionStatus.day3).slice(0, 2);

    if (titleEl) {
      titleEl.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-red-500"></span>
        Due Today (${dueTodayQuestions.length})
      `;
      titleEl.className = 'text-lg font-semibold mb-4 flex items-center gap-2';
    }

    // Update question list
    const contentEl = dueTodayPanel.querySelector('.space-y-2');
    if (contentEl && dueTodayQuestions.length > 0) {
      contentEl.innerHTML = dueTodayQuestions.map(q => `
        <p class="text-sm text-slate-600 dark:text-slate-400">${q.name}</p>
      `).join('');
    }

    console.log(`  ✓ Due Today: ${dueTodayQuestions.length} questions`);
  }

  // Upcoming (panel with yellow dot)
  const upcomingPanel = Array.from(panels).find(panel =>
    panel.querySelector('.bg-yellow-500')
  );

  if (upcomingPanel) {
    const titleEl = upcomingPanel.querySelector('h3.text-lg');
    if (titleEl) {
      titleEl.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
        Upcoming (${revisionProgress.day7.pending})
      `;
      titleEl.className = 'text-lg font-semibold mb-4 flex items-center gap-2';
    }
    console.log(`  ✓ Upcoming: ${revisionProgress.day7.pending} questions`);
  }

  // Completed (panel with green dot)
  const completedPanel = Array.from(panels).find(panel =>
    panel.querySelector('.bg-green-500')
  );

  if (completedPanel) {
    const titleEl = completedPanel.querySelector('h3.text-lg');
    const totalCompleted = revisionProgress.day3.completed + revisionProgress.day7.completed + revisionProgress.day15.completed;

    if (titleEl) {
      titleEl.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-green-500"></span>
        Completed (${totalCompleted})
      `;
      titleEl.className = 'text-lg font-semibold mb-4 flex items-center gap-2';
    }
    console.log(`  ✓ Completed: ${totalCompleted} questions`);
  }

  console.log('✅ Revision panels updated');
}

// ================================
// STEP 5: UPDATE TOPIC PROGRESS
// ================================

/**
 * Updates topic progress bars
 *
 * Topics: Arrays, Strings, DP, Graphs, etc.
 */
function updateTopicProgress(portfolioData) {
  console.log('🎨 Updating topic progress...');

  const { profileStats } = portfolioData;
  const { topicBreakdown } = profileStats;

  // Find topic progress section
  const topicSection = Array.from(document.querySelectorAll('h3.text-lg.font-semibold'))
    .find(h3 => h3.textContent.includes('Topic Progress'));

  if (!topicSection) {
    console.log('  ⚠️ Topic section not found');
    return;
  }

  const container = topicSection.closest('.bg-white, .dark\\:bg-slate-900');
  if (!container) return;

  const rows = container.querySelectorAll('.space-y-4 > div');
  const topics = Object.entries(topicBreakdown);
  const maxCount = Math.max(...Object.values(topicBreakdown));

  topics.forEach(([topic, count], index) => {
    if (rows[index]) {
      // Update topic name
      const nameEl = rows[index].querySelector('.text-sm.font-medium');
      if (nameEl) {
        nameEl.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
      }

      // Update count
      const countEl = rows[index].querySelector('.text-sm.text-slate-600, .text-sm.dark\\:text-slate-400');
      if (countEl) {
        countEl.textContent = `${count} / ${Math.round(maxCount * 1.2)}`;
      }

      // Update bar
      const barEl = rows[index].querySelector('.h-full.bg-gradient-to-r');
      if (barEl) {
        const percentage = (count / maxCount) * 100;
        barEl.style.width = percentage + '%';
      }

      console.log(`  ✓ ${topic}: ${count}`);
    }
  });

  console.log('✅ Topic progress updated');
}

// ================================
// STEP 6: UPDATE QUICK STATS (SIDEBAR)
// ================================

/**
 * Updates sidebar quick stats
 */
function updateQuickStats(portfolioData) {
  console.log('🎨 Updating quick stats...');

  const { profileStats } = portfolioData;

  // Find quick stats in sidebar
  const statCards = document.querySelectorAll('.grid.grid-cols-2.gap-3 > div');

  // Solved count
  if (statCards[0]) {
    const valueEl = statCards[0].querySelector('.text-xl.font-bold');
    if (valueEl) {
      valueEl.textContent = profileStats.totalSolved;
      console.log(`  ✓ Sidebar solved: ${profileStats.totalSolved}`);
    }
  }

  // Streak (default 28)
  if (statCards[1]) {
    const valueEl = statCards[1].querySelector('.text-xl.font-bold');
    if (valueEl) {
      valueEl.textContent = '28 🔥';
      console.log(`  ✓ Sidebar streak: 28`);
    }
  }

  console.log('✅ Quick stats updated');
}

// ================================
// EXPORT FUNCTIONS
// ================================

window.UIUpdater = {
  updateProfile,
  updateMetricCards,
  updateDifficultyBreakdown,
  updateRevisionPanels,
  updateTopicProgress,
  updateQuickStats
};

console.log('✅ UI Updater module loaded');
