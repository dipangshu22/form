require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create table if not exists
pool.query(`CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  likes INTEGER DEFAULT 0
)`);

// Get all comments
app.get('/api/comments', async (req, res) => {
  const result = await pool.query('SELECT * FROM comments ORDER BY date DESC');
  res.json(result.rows);
});

// Add a comment
app.post('/api/comments', async (req, res) => {
  const { author, message } = req.body;
  const result = await pool.query(
    'INSERT INTO comments (author, message) VALUES ($1, $2) RETURNING *',
    [author, message]
  );
  res.json(result.rows[0]);
});

// Like a comment
app.post('/api/comments/:id/like', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'UPDATE comments SET likes = likes + 1 WHERE id = $1 RETURNING *',
    [id]
  );
  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
