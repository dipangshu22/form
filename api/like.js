import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id } = req.body;
    const result = await pool.query(
      'UPDATE comments SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    res.status(200).json(result.rows[0]);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
