// In-memory database (will be replaced with real DB later)
let allQuestions = [];
let questionIdCounter = 1;

class Question {
  constructor(name, topic, difficulty, username = "demo_user") {
    this.id = questionIdCounter++;
    this.name = name;
    this.topic = topic;
    this.difficulty = difficulty;
    this.username = username;  // which user solved this
    this.solvedDate = new Date().toISOString().split('T')[0]; // today's date (YYYY-MM-DD)
    this.revisionDates = {};
    this.revisionStatus = {};
    this.isBookmarked = false;
    this.notes = "";
  }
}

module.exports = {
  Question,
  allQuestions,
  getQuestions: () => allQuestions,
  addQuestion: (question) => {
    allQuestions.push(question);
    return question;
  },
  getQuestionById: (id) => {
    return allQuestions.find(q => q.id === parseInt(id));
  },
  getQuestionsByUsername: (username) => {
    return allQuestions.filter(q => q.username === username);
  }
};
