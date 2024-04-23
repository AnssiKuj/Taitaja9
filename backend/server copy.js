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

// Haetaan data tietokannasta
app.get('/kerailyerat', (req, res) => {
  const sql = "SELECT * FROM kerailyerat";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Haetaan data tietokannasta
app.get('/valiera', (req, res) => {
  const sql = "SELECT * FROM valiera";
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


// Tallennetaan aika joukkueiden tietokantaan
app.post('/saveTime', (req, res) => {
  const { joukkueNimi, tehtava, aika } = req.body;
  const sql = `UPDATE joukkueet SET \`${tehtava}\` = ? WHERE JoukkueNimi = ?`;
  db.query(sql, [aika, joukkueNimi], (err, result) => {
    if (err) {
      console.error("Virhe tallentaessa aikaa", err);
      return res.status(500).json({ error: "Virhe tallentaessa aikaa" });
    }
    console.log("Aika tallennettu joukkueiden tietokantaan onnistuneesti");
    return res.status(200).json({ message: "Aika tallennettu joukkueiden tietokantaan onnistuneesti" });
  });
});

// Tallennetaan aika keräilyerien tietokantaan
app.post('/saveCollectionTime', (req, res) => {
  const { joukkueNimi, tehtava, aika } = req.body;
  // Muuta SQL-kysely vastaamaan keräilyerien tietokantarakennetta
  const sql = `UPDATE kerailyerat SET \`${tehtava}\` = ? WHERE JoukkueNimi = ?`;
  db.query(sql, [aika, joukkueNimi], (err, result) => {
    if (err) {
      console.error("Virhe tallentaessa aikaa keräilyeriin", err);
      return res.status(500).json({ error: "Virhe tallentaessa aikaa keräilyeriin" });
    }
    console.log("Aika tallennettu keräilyerien tietokantaan onnistuneesti");
    return res.status(200).json({ message: "Aika tallennettu keräilyerien tietokantaan onnistuneesti" });
  });
});

// Tallennetaan aika välierien tietokantaan
app.post('/saveFinalTime', (req, res) => {
  const { joukkueNimi, tehtava, aika } = req.body;
  // Muuta SQL-kysely vastaamaan välierien tietokantarakennetta
  const sql = `UPDATE valiera SET \`${tehtava}\` = ? WHERE JoukkueNimi = ?`;
  db.query(sql, [aika, joukkueNimi], (err, result) => {
    if (err) {
      console.error("Virhe tallentaessa aikaa välieriin", err);
      return res.status(500).json({ error: "Virhe tallentaessa aikaa välieriin" });
    }
    console.log("Aika tallennettu välierien tietokantaan onnistuneesti");
    return res.status(200).json({ message: "Aika tallennettu välierien tietokantaan onnistuneesti" });
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


// Modify the moveToValiera endpoint to move only the winners to "valiera" table
app.post('/moveToValiera', (req, res) => {
  const moveSql = "INSERT INTO valiera (JoukkueNimi, KokonaisAika) SELECT JoukkueNimi, KokonaisAika FROM joukkueet WHERE (Lohko, KokonaisAika) IN (SELECT Lohko, MIN(KokonaisAika) FROM joukkueet GROUP BY Lohko)";
  db.query(moveSql, (moveErr, moveResult) => {
    if (moveErr) {
      console.error("Virhe siirrettäessä voittajia välierään", moveErr);
      return res.status(500).json({ error: "Virhe siirrettäessä voittajia välierään" });
    }
    console.log("Voittajat siirretty välierään onnistuneesti");
    
    // After moving to "valiera" table, delete teams from current table
    const deleteSql = "DELETE FROM joukkueet WHERE (Lohko, KokonaisAika) IN (SELECT Lohko, MIN(KokonaisAika) FROM joukkueet GROUP BY Lohko)";
    db.query(deleteSql, (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Virhe joukkueiden poistamisessa", deleteErr);
        return res.status(500).json({ error: "Virhe joukkueiden poistamisessa" });
      }
      console.log("Joukkueet poistettu onnistuneesti");
      return res.status(200).json({ message: "Voittajat siirretty välierään ja joukkueet poistettu onnistuneesti" });
    });
  });
});


app.post('/moveToValiera', (req, res) => {
  const moveSql = "INSERT INTO valiera (JoukkueNimi, KokonaisAika) SELECT JoukkueNimi, KokonaisAika FROM joukkueet WHERE (Lohko, KokonaisAika) IN (SELECT Lohko, MIN(KokonaisAika) FROM joukkueet GROUP BY Lohko)";
  db.query(moveSql, (moveErr, moveResult) => {
    if (moveErr) {
      console.error("Virhe siirrettäessä voittajia välierään", moveErr);
      return res.status(500).json({ error: "Virhe siirrettäessä voittajia välierään" });
    }
    console.log("Voittajat siirretty välierään onnistuneesti");
    
    // After moving to "valiera" table, delete teams from current table
    const deleteSql = "DELETE FROM joukkueet WHERE (Lohko, KokonaisAika) IN (SELECT Lohko, MIN(KokonaisAika) FROM joukkueet GROUP BY Lohko)";
    db.query(deleteSql, (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Virhe joukkueiden poistamisessa", deleteErr);
        return res.status(500).json({ error: "Virhe joukkueiden poistamisessa" });
      }
      console.log("Joukkueet poistettu onnistuneesti");
      return res.status(200).json({ message: "Voittajat siirretty välierään ja joukkueet poistettu onnistuneesti" });
    });
  });
});


app.post('/moveToValiera2', (req, res) => {
  const moveSql = "INSERT INTO valiera (JoukkueNimi, KokonaisAika) SELECT JoukkueNimi, KokonaisAika FROM kerailyerat WHERE (Lohko, KokonaisAika) IN (SELECT Lohko, MIN(KokonaisAika) FROM kerailyerat GROUP BY Lohko)";
  db.query(moveSql, (moveErr, moveResult) => {
    if (moveErr) {
      console.error("Virhe siirrettäessä voittajia välierään", moveErr);
      return res.status(500).json({ error: "Virhe siirrettäessä voittajia välierään" });
    }
    console.log("Voittajat siirretty välierään onnistuneesti");
    
    // After moving to "valiera" table, delete teams from current table
    const deleteSql = "DELETE FROM kerailyerat WHERE (Lohko, KokonaisAika) IN (SELECT Lohko, MIN(KokonaisAika) FROM kerailyerat GROUP BY Lohko)";
    db.query(deleteSql, (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Virhe joukkueiden poistamisessa", deleteErr);
        return res.status(500).json({ error: "Virhe joukkueiden poistamisessa" });
      }
      console.log("Joukkueet poistettu onnistuneesti");
      return res.status(200).json({ message: "Voittajat siirretty välierään ja joukkueet poistettu onnistuneesti" });
    });
  });
});

// Poista joukkue ja siirrä se välierään
app.delete('/deleteContestantAndMoveToValiera/:JoukkueNimi', (req, res) => {
  const JoukkueNimi = req.params.JoukkueNimi;
  
  // Siirrä joukkue välieraan
  const moveSql = "INSERT INTO valiera (JoukkueNimi, KokonaisAika) SELECT JoukkueNimi, KokonaisAika FROM joukkueet WHERE JoukkueNimi = ?";
  db.query(moveSql, [JoukkueNimi], (moveErr, moveResult) => {
    if (moveErr) {
      console.error("Virhe siirrettäessä joukkuetta välierään", moveErr);
      return res.status(500).json({ error: "Virhe siirrettäessä joukkuetta välierään" });
    }

    // Jos siirto onnistui, poista joukkue nykyisestä taulusta
    const deleteSql = "DELETE FROM joukkueet WHERE JoukkueNimi = ?";
    db.query(deleteSql, [JoukkueNimi], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Virhe joukkueen poistamisessa", deleteErr);
        return res.status(500).json({ error: "Virhe joukkueen poistamisessa" });
      }

      console.log("Joukkue poistettu ja siirretty välierään onnistuneesti");
      return res.status(200).json({ message: "Joukkue poistettu ja siirretty välierään onnistuneesti" });
    });
  });
});

// Siirrä joukkueet keräilyerään ja poista ne nykyisestä taulusta
app.post('/moveToCollectionRound', (req, res) => {
  const moveSql = "INSERT INTO kerailyerat (JoukkueNimi, KokonaisAika) SELECT JoukkueNimi, KokonaisAika FROM joukkueet WHERE (Lohko, KokonaisAika) IN (SELECT Lohko, MIN(KokonaisAika) FROM joukkueet GROUP BY Lohko)";
  db.query(moveSql, (moveErr, moveResult) => {
    if (moveErr) {
      console.error("Virhe siirrettäessä joukkueita keräilyerään", moveErr);
      return res.status(500).json({ error: "Virhe siirrettäessä joukkueita keräilyerään" });
    }
    console.log("Joukkueet siirretty keräilyerään onnistuneesti");

    // Poista joukkueet nykyisestä taulusta
    const deleteSql = "DELETE FROM joukkueet WHERE (Lohko, KokonaisAika) IN (SELECT Lohko, MIN(KokonaisAika) FROM joukkueet GROUP BY Lohko)";
    db.query(deleteSql, (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Virhe joukkueiden poistamisessa", deleteErr);
        return res.status(500).json({ error: "Virhe joukkueiden poistamisessa" });
      }
      console.log("Joukkueet poistettu nykyisestä taulusta");
      return res.status(200).json({ message: "Joukkueet siirretty keräilyerään ja poistettu nykyisestä taulusta onnistuneesti" });
    });
  });
});

app.listen(8081, () => {
  console.log("Palvelin käynnistetty portissa 8081");
});

