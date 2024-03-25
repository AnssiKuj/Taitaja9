const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "taitaja9"
});

app.get('/', (req, res) => {
  return res.json("From backend side");
});

app.get('/joukkueet', (req, res) => {
  const sql = "SELECT * FROM joukkueet";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// New POST route to handle adding contestants
app.post('/addContestant', (req, res) => {
  // Get contestant name from request body
  const contestantName = req.body.contestantName;

  if (!contestantName) {
    return res.status(400).send({ error: 'Missing contestant name' }); // Handle missing data
  }

  // Construct SQL query for insertion
  const sql = "INSERT INTO joukkueet (JoukkueNimi, JoukkueAika) VALUES (?, ?)";

  // Execute query with prepared statement to prevent SQL injection
  db.query(sql, [contestantName], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: 'Failed to add contestant' });
    }

    // Send success response
    res.status(201).send({ message: 'Contestant added successfully' });
  });
});

app.listen(8081, () => {
  console.log("listening");
});