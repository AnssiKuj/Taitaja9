const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// MySQL database connection configuration
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "taitaja9"
});

// Endpoint to insert data into the "joukkueet" table
app.post('/joukkueet', (req, res) => {
    // Extract data from the request body
    const { name, description } = req.body;
    
    // Check if name and description are provided
    if (!name || !description) {
        return res.status(400).json({ error: "Name and description are required" });
    }

    // SQL query to insert data into the "joukkueet" table
    const sql = "INSERT INTO joukkueet (name, description) VALUES (?, ?)";
    
    // Execute the query with the provided data
    db.query(sql, [name, description], (err, result) => {
        if (err) {
            console.error("Error inserting data into database:", err);
            return res.status(500).json({ error: "Failed to insert data into database" });
        }
        // Respond with success message
        return res.status(201).json({ message: "Data inserted successfully", id: result.insertId });
    });
});

// Root endpoint
app.get('/', (req, res) => {
    return res.json("From backend side");
});

// Endpoint to fetch data from the "joukkueet" table
app.get('/joukkueet', (req, res) => {
    const sql = "SELECT * FROM joukkueet";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching data from database:", err);
            return res.status(500).json({ error: "Failed to fetch data from database" });
        }
        return res.json(data);
    });
});

// Start the server
app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
