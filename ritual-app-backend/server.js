const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// SQLite database setup
const db = new sqlite3.Database('./ritual_app.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT UNIQUE
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT,
      date TEXT,
      ritualType TEXT
    )`);
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API Routes
app.post('/api/complete-session', (req, res) => {
    const { userId, ritualType, completed } = req.body;
    if (!completed) {
      return res.status(400).json({ error: 'Session not fully completed' });
    }
    
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
    db.run(`INSERT INTO users (userId) VALUES (?) ON CONFLICT(userId) DO NOTHING`, [userId], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      db.run(`INSERT INTO sessions (userId, date, ritualType) VALUES (?, ?, ?)`, [userId, date, ritualType], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Session completed successfully' });
      });
    });
  });

app.get('/api/user-data/:userId', (req, res) => {
  const { userId } = req.params;
  db.all(`SELECT date, ritualType FROM sessions WHERE userId = ? ORDER BY date DESC`, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const sessions = rows;
    const streaks = calculateStreaks(sessions);
    
    res.json({ 
      userId, 
      sessions, 
      currentStreak: streaks.currentStreak,
      longestStreak: streaks.longestStreak
    });
  });
});

function calculateStreaks(sessions) {
  let currentStreak = 0;
  let longestStreak = 0;
  let lastDate = null;

  sessions.forEach((session, index) => {
    const sessionDate = new Date(session.date);
    if (index === 0) {
      currentStreak = 1;
      longestStreak = 1;
      lastDate = sessionDate;
    } else {
      const dayDifference = (lastDate - sessionDate) / (1000 * 3600 * 24);
      if (dayDifference === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (dayDifference > 1) {
        currentStreak = 1;
      }
      lastDate = sessionDate;
    }
  });

  return { currentStreak, longestStreak };
}

// Catch-all handler for any request that doesn't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});