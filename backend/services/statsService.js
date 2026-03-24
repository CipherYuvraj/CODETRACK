// Calculate difficulty-wise stats
function getDifficultyStats(allQuestions) {
  const stats = {
    easy: 0,
    medium: 0,
    hard: 0
  };

  allQuestions.forEach(question => {
    stats[question.difficulty]++;
  });

  return stats;
}

// Calculate topic-wise stats
function getTopicStats(allQuestions) {
  const stats = {};

  allQuestions.forEach(question => {
    if (!stats[question.topic]) {
      stats[question.topic] = 0;
    }
    stats[question.topic]++;
  });

  return stats;
}

// Calculate revision pending stats
function getRevisionStats(allQuestions) {
  let day3Pending = 0;
  let day7Pending = 0;
  let day15Pending = 0;

  allQuestions.forEach(question => {
    if (!question.revisionStatus.day3) day3Pending++;
    if (!question.revisionStatus.day7) day7Pending++;
    if (!question.revisionStatus.day15) day15Pending++;
  });

  return {
    day3Pending,
    day7Pending,
    day15Pending
  };
}

// Get overall stats
function getOverallStats(allQuestions) {
  return {
    totalSolved: allQuestions.length,
    difficulty: getDifficultyStats(allQuestions),
    topics: getTopicStats(allQuestions),
    revisions: getRevisionStats(allQuestions)
  };
}

module.exports = {
  getDifficultyStats,
  getTopicStats,
  getRevisionStats,
  getOverallStats
};
