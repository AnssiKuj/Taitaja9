const express = require('express');
const mysql = require('mysql2/promise'); // Assuming MySQL database

const app = express();
const port = process.env.PORT || 3000;

// Replace with your actual database connection details
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database_name'
});

app.get('/api/contestants', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contestants'); // Replace with your query
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching contestants');
  }
});

app.post('/api/contestants', async (req, res) => {
  const { name } = req.body; // Assuming data in request body
  try {
    const [result] = await pool.query('INSERT INTO contestants (name) VALUES (?)', [name]);
    res.json({ message: 'Contestant added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding contestant');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

