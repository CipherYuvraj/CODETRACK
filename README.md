# 📊 CodeTrack - DSA Progress Tracker

A modern, full-stack web application to track Data Structures & Algorithms (DSA) progress with spaced repetition learning.

## ✨ Features

- 📚 Track solved problems (Easy/Medium/Hard)
- 🔄 3-7-15 Spaced Repetition System
- 📈 Progress visualization with charts
- 🔖 Bookmark important problems
- 📝 Add personal notes
- 🌓 Dark/Light mode toggle
- 📊 Topic-wise progress tracking
- 🏆 Revision tracking & reminders

## 🚀 Tech Stack

### Backend
- Node.js + Express
- RESTful API architecture
- In-memory storage (upgrade to DB recommended)

### Frontend
- HTML + Tailwind CSS
- Vanilla JavaScript
- Chart.js for visualizations
- Responsive design

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd code-track
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Start the server
```bash
npm start
```

5. Open `dashboard.html` in your browser

## 🔌 API Endpoints

### Questions
- `POST /api/question` - Add a solved question
- `GET /api/user/:username` - Get user portfolio

### Revisions
- `GET /api/revision` - Get today's revisions
- `PATCH /api/revision/:id` - Mark revision complete

### Stats
- `GET /api/stats` - Get overall statistics

### Bookmarks
- `POST /api/bookmark/:id` - Toggle bookmark
- `GET /api/bookmark` - Get all bookmarks
- `PATCH /api/bookmark/:id` - Update notes

## 📁 Project Structure

```
code-track/
├── backend/
│   ├── controllers/      # Business logic
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Helper services
│   └── server.js        # Express server
├── dashboard.html       # Main frontend
├── api.js              # API fetch functions
├── ui-updater.js       # DOM manipulation
├── app.js              # Main controller
└── package.json        # Dependencies
```

## ⚠️ Production Notes

**This project is NOT production-ready**. Before deploying:

1. **Add Database**: Replace in-memory storage with MongoDB/PostgreSQL
2. **Add CORS**: Configure CORS for frontend-backend communication
3. **Environment Variables**: Use dotenv for configuration
4. **Security**: Add helmet, rate limiting, input validation
5. **Logging**: Add winston or morgan
6. **Error Handling**: Add global error handler
7. **Build Process**: Minify and bundle assets

## 🔧 Development

```bash
# Start backend
npm start

# Backend runs on http://localhost:5000
# Open dashboard.html in browser
```

## 📝 TODO for Production

- [ ] Add database (MongoDB recommended)
- [ ] Add CORS configuration
- [ ] Add environment variables with dotenv
- [ ] Add authentication/authorization
- [ ] Add request validation
- [ ] Add rate limiting
- [ ] Add logging (winston)
- [ ] Add tests (Jest)
- [ ] Add Docker configuration
- [ ] Add CI/CD pipeline

## 📄 License

ISC

## 👤 Author

Your Name

## 🤝 Contributing

Contributions welcome! This is a learning project.
