const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();


app.use(cors());

app.use(express.json());

// yhdistetään tietokantaan
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "taitaja9"
});

app.get('/', (req, res) => {
    return res.json("From backend side");
});

// Haetaan data tietokannasta
app.get('/joukkueet', (req, res) => {
    const sql = "SELECT * FROM joukkueet";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Lisätään kilpailija tietokantaan
app.post('/insertContestant', (req, res) => {
    const { JoukkueNimi } = req.body;
    // SQL kysely joka lisää kilpailijan tietokantaan
    const sql = "INSERT INTO joukkueet (JoukkueNimi) VALUES (?)";
    db.query(sql, [JoukkueNimi], (err, result) => {
        if (err) {
            console.error("Virhe lisätessä kilpailijaa", err);
            return res.status(500).json({ error: "Virhe lisätessä kilpailijaa" });
        }
        console.log("Kilpailija lisätty onnistuneesti");
        return res.status(200).json({ message: "Kilpailija lisätty onnistuneesti" });
    });
});

app.listen(8081, () => {
    console.log("listening");
});
