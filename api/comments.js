import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const result = await pool.query('SELECT * FROM comments ORDER BY date DESC');
    res.status(200).json(result.rows);
  } else if (req.method === 'POST') {
    const { author, message } = req.body;
    const result = await pool.query(
      'INSERT INTO comments (author, message) VALUES ($1, $2) RETURNING *',
      [author, message]
    );
    res.status(200).json(result.rows[0]);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
