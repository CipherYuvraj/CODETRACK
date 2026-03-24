// Helper function to add days to a date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0]; // returns YYYY-MM-DD format
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

// Generate revision dates for a question
function generateRevisionDates(solvedDate) {
  return {
    day3: addDays(solvedDate, 3),
    day7: addDays(solvedDate, 7),
    day15: addDays(solvedDate, 15)
  };
}

// Generate initial revision status (all false = not done yet)
function generateRevisionStatus() {
  return {
    day3: false,
    day7: false,
    day15: false
  };
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

// Find revision questions for today
function getRevisionQuestionsForToday(allQuestions) {
  const today = getTodayDate();
  const revisionQuestions = [];

  allQuestions.forEach(question => {
    // Check if today matches any revision date and if it hasn't been completed
    if (question.revisionDates.day3 === today && !question.revisionStatus.day3) {
      revisionQuestions.push({
        ...question,
        revisionPhase: "day3"
      });
    } else if (question.revisionDates.day7 === today && !question.revisionStatus.day7) {
      revisionQuestions.push({
        ...question,
        revisionPhase: "day7"
      });
    } else if (question.revisionDates.day15 === today && !question.revisionStatus.day15) {
      revisionQuestions.push({
        ...question,
        revisionPhase: "day15"
      });
    }
  });

  return revisionQuestions;
}

module.exports = {
  generateRevisionDates,
  generateRevisionStatus,
  addDays,
  getTodayDate,
  getRevisionQuestionsForToday
};
