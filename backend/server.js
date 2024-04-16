const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Yhdistetään tietokantaan
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "taitaja9"
});

// Tietokannan yhdistämisen testaus
db.connect((err) => {
  if (err) {
    console.error("Virhe tietokantaan yhdistettäessä: " + err.stack);
    return;
  }
  console.log("Tietokantaan yhdistetty");
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

// Poistetaan hitaimmat joukkueet tietokannasta
app.delete('/removeSlowest', (req, res) => {
  const sql = "DELETE FROM joukkueet WHERE `Tehtävä 1` + `Tehtävä 2` + `Tehtävä 3` = (SELECT MIN(`Tehtävä 1` + `Tehtävä 2` + `Tehtävä 3`) FROM joukkueet)";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Virhe poistettaessa hitaimpia kilpailijoita", err);
      return res.status(500).json({ error: "Virhe poistettaessa hitaimpia kilpailijoita" });
    }
    console.log("Hitaimmat kilpailijat poistettu onnistuneesti");
    return res.status(200).json({ message: "Hitaimmat kilpailijat poistettu onnistuneesti" });
  });
});

app.listen(8081, () => {
  console.log("Palvelin käynnistetty portissa 8081");
});
