// ================================
// Profile Settings Manager
// ================================

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : '/api';

let USERNAME = localStorage.getItem('username');
if (!USERNAME) {
  window.location.href = 'login.html';
}

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

function showMessage(text, type) {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  
  if (type === 'success') {
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 3000);
  }
}

// Load current profile
async function loadProfile() {
  try {
    console.log('📋 Loading profile...');
    const response = await fetch(`${API_URL}/profile/${USERNAME}`, {
      headers: getAuthHeader()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);

    const profile = data.profile || {};
    const handles = profile.platformHandles || {};

    // Populate form
    document.getElementById('leetcode').value = handles.leetcode || '';
    document.getElementById('codeforces').value = handles.codeforces || '';
    document.getElementById('github').value = handles.github || '';
    document.getElementById('linkedin').value = handles.linkedin || '';

    // Show stats if available
    if (profile.platformStats) {
      showStats(profile.platformStats);
    }

    console.log('✅ Profile loaded');
  } catch (error) {
    console.error('Error loading profile:', error);
    showMessage('⚠️ Could not load profile: ' + error.message, 'error');
  }
}

function showStats(stats) {
  const statsGrid = document.getElementById('statsGrid');
  if (!stats || Object.keys(stats).length === 0) return;

  // LC stats
  if (stats.leetcode) {
    document.getElementById('lcSolved').textContent = stats.leetcode.totalSolved || '-';
    document.getElementById('lcEasy').textContent = stats.leetcode.easySolved || '-';
  }

  // CF stats
  if (stats.codeforces) {
    document.getElementById('cfRating').textContent = stats.codeforces.rating || '-';
    document.getElementById('cfSolved').textContent = stats.codeforces.solvedCount || '-';
  }

  statsGrid.style.display = 'grid';
}

// Save handles
async function saveHandles() {
  try {
    const leetcode = document.getElementById('leetcode').value.trim();
    const codeforces = document.getElementById('codeforces').value.trim();
    const github = document.getElementById('github').value.trim();
    const linkedin = document.getElementById('linkedin').value.trim();

    if (!leetcode && !codeforces && !github && !linkedin) {
      showMessage('⚠️ Please add at least one platform handle', 'error');
      return;
    }

    console.log('💾 Saving handles...');

    const response = await fetch(`${API_URL}/profile/${USERNAME}/handles`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({
        leetcode: leetcode || null,
        codeforces: codeforces || null,
        github: github || null,
        linkedin: linkedin || null
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);

    showMessage('✅ Profiles saved successfully!', 'success');
    console.log('✅ Handles saved');

  } catch (error) {
    console.error('Error saving handles:', error);
    showMessage('❌ Error: ' + error.message, 'error');
  }
}

// Refresh stats
async function refreshStats() {
  try {
    const loading = document.querySelector('.loading');
    if (loading) loading.classList.add('active');

    console.log('🔄 Refreshing stats...');

    const response = await fetch(`${API_URL}/profile/${USERNAME}/refresh-stats`, {
      method: 'POST',
      headers: getAuthHeader()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.message);

    showMessage('✅ Stats refreshed!', 'success');
    showStats(data.platformStats);
    console.log('✅ Stats updated:', data.platformStats);

  } catch (error) {
    console.error('Error refreshing stats:', error);
    showMessage('❌ Error refreshing stats: ' + error.message, 'error');
  } finally {
    const loading = document.querySelector('.loading');
    if (loading) loading.classList.remove('active');
  }
}

// Go back to dashboard
function goBack() {
  window.location.href = 'dashboard-modern.html';
}

// Load profile on page load
document.addEventListener('DOMContentLoaded', loadProfile);

// Global functions for onclick handlers
window.saveHandles = saveHandles;
window.refreshStats = refreshStats;
window.goBack = goBack;
