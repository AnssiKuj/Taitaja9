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
  database: "kilpailu"
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
  const { JoukkueNimi, Lohko } = req.body; // Lisätty Lohko
  const sql = "INSERT INTO joukkueet (JoukkueNimi, Lohko) VALUES (?, ?)"; // Lisätty Lohko
  db.query(sql, [JoukkueNimi, Lohko], (err, result) => { // Lisätty Lohko
    if (err) {
      console.error("Virhe lisätessä kilpailijaa", err);
      return res.status(500).json({ error: "Virhe lisätessä kilpailijaa" });
    }
    console.log("Kilpailija lisätty onnistuneesti");
    return res.status(200).json({ message: "Kilpailija lisätty onnistuneesti" });
  });
});


// Poistetaan joukkue tietokannasta
app.delete('/deleteContestant/:JoukkueNimi', (req, res) => {
  const JoukkueNimi = req.params.JoukkueNimi;
  const sql = "DELETE FROM joukkueet WHERE JoukkueNimi = ?";
  db.query(sql, [JoukkueNimi], (err, result) => {
    if (err) {
      console.error("Virhe poistettaessa joukkuetta", err);
      return res.status(500).json({ error: "Virhe poistettaessa joukkuetta" });
    }
    console.log("Joukkue poistettu onnistuneesti");
    return res.status(200).json({ message: "Joukkue poistettu onnistuneesti" });
  });
});


// Tallennetaan aika tietokantaan
app.post('/saveTime', (req, res) => {
  const { joukkueNimi, tehtava, aika } = req.body;
  const sql = `UPDATE joukkueet SET \`${tehtava}\` = ? WHERE JoukkueNimi = ?`;
  db.query(sql, [aika, joukkueNimi], (err, result) => {
    if (err) {
      console.error("Virhe tallentaessa aikaa", err);
      return res.status(500).json({ error: "Virhe tallentaessa aikaa" });
    }
    console.log("Aika tallennettu onnistuneesti");
    return res.status(200).json({ message: "Aika tallennettu onnistuneesti" });
  });
});


// Tallennetaan kokonaisaika tietokantaan
app.post('/saveTotalTime', (req, res) => {
  const { joukkueNimi, kokonaisAika } = req.body;
  const sql = "UPDATE joukkueet SET KokonaisAika = ? WHERE JoukkueNimi = ?";
  db.query(sql, [kokonaisAika, joukkueNimi], (err, result) => {
    if (err) {
      console.error("Virhe tallentaessa kokonaisaikaa", err);
      return res.status(500).json({ error: "Virhe tallentaessa kokonaisaikaa" });
    }
    console.log("Kokonaisaika tallennettu onnistuneesti");
    return res.status(200).json({ message: "Kokonaisaika tallennettu onnistuneesti" });
  });
});

// Poistetaan hitain joukkue
app.post('/deleteSlowestTeam', (req, res) => {
  const { bracketName } = req.body;
  const bracketTeams = divideTeamsIntobrackets()[bracketName];
  if (!bracketTeams || bracketTeams.length === 0) {
    return res.status(400).json({ error: "Lohko on tyhjä tai sitä ei ole olemassa." });
  }

  let slowestTeamIndex = 0;
  let slowestTimeInSeconds = Infinity;

  // Etsi hitain joukkue ja tallenna sen indeksi ja aika sekunteina
  bracketTeams.forEach((team, index) => {
    const totalTime = calculateTotalTimeInSeconds(team);
    if (totalTime < slowestTimeInSeconds) {
      slowestTimeInSeconds = totalTime;
      slowestTeamIndex = index;
    }
  });

  // Poista hitain joukkue
  const slowestTeam = bracketTeams[slowestTeamIndex];
  const sql = "DELETE FROM joukkueet WHERE JoukkueNimi = ?";
  db.query(sql, [slowestTeam.JoukkueNimi], (err, result) => {
    if (err) {
      console.error("Virhe poistettaessa hitainta joukkuetta", err);
      return res.status(500).json({ error: "Virhe poistettaessa hitainta joukkuetta" });
    }
    console.log("Hitain joukkue poistettu onnistuneesti");
    return res.status(200).json({ message: "Hitain joukkue poistettu onnistuneesti" });
  });
});

//Päivittää lohkot uudestaan riippuen joukkueiden määrästä
app.post('/updateBrackets', (req, res) => {
  const sql = "SELECT * FROM joukkueet";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Virhe joukkueiden hakemisessa", err);
      return res.status(500).json({ error: "Virhe joukkueiden hakemisessa" });
    }
    
    result.forEach((team, index) => {
      const teamName = team.JoukkueNimi;
      const bracketNumber = Math.ceil((index + 1) / 6);
      const updateSql = "UPDATE joukkueet SET Lohko = ? WHERE JoukkueNimi = ?";
      
      db.query(updateSql, [bracketNumber, teamName], (err, result) => {
        if (err) {
          console.error(`Virhe lohkon päivittämisessä joukkueelle ${teamName}`, err);
          return res.status(500).json({ error: `Virhe lohkon päivittämisessä joukkueelle ${teamName}` });
        }
        console.log(`Lohko päivitetty onnistuneesti: ${bracketNumber} joukkueelle ${teamName}`);
      });
    });
    
    console.log(`Kaikkien joukkueiden lohkot päivitetty.`);
    return res.status(200).json({ message: `Kaikkien joukkueiden lohkot päivitetty` });
  });
});

app.listen(8081, () => {
  console.log("Palvelin käynnistetty portissa 8081");
});

