import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../css/contestant-container.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

function AddContestants() {
  const [data, setData] = useState([]);
  const location = useLocation();
  const [brackets, setBrackets] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:8081/joukkueet')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  };

  const addContestant = () => {
    if (data.length < 36) {
      const contestantName = prompt("Syötä joukkueen nimi:");
      const bracketNumber = Math.floor(data.length / 6) + 1; // Lohkon laskeminen
      if (contestantName) {
        fetch('http://localhost:8081/insertContestant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ JoukkueNimi: contestantName, Lohko: bracketNumber }), // Lisätty Lohko
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          console.log('Kilpailija lisätty onnistuneesti');
          fetchData(); // Päivitä data lisäämisen jälkeen
        })
        .catch(error => {
          console.error('Virhe lisättäessä kilpailijaa', error);
          alert('Virhe lisättäessä kilpailijaa.');
        });
      }
    } else {
      alert('Maksimimäärä kilpailijoita saavutettu.');
    }
  };
  
  const deleteContestant = (joukkueNimi) => {
    fetch(`http://localhost:8081/deleteContestant/${joukkueNimi}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Joukkue poistettu onnistuneesti');
        fetchData(); // Päivitä data poiston jälkeen
      })
      .catch(error => {
        console.error('Virhe poistettaessa joukkuetta', error);
        alert('Virhe poistettaessa joukkuetta.');
      });
  };

  const calculateTotalTimeInSeconds = (team) => {
    let totalSeconds = 0;
    Object.keys(team).forEach(key => {
      if (key.includes('Tehtävä')) {
        const taskTime = team[key];
        if (taskTime) {
          const [minutes, seconds, hundredths] = taskTime.split(':').map(part => parseInt(part));
          totalSeconds += minutes * 60 + seconds + hundredths / 100;
        }
      }
    });
    return totalSeconds;
  };

  const calculateTotalTime = () => {
    data.forEach(team => {
      let totalMinutes = 0;
      let totalSeconds = 0;
      let totalHundredths = 0;
      Object.keys(team).forEach(key => {
        if (key.includes('Tehtävä')) {
          const taskTime = team[key];
          if (taskTime) {
            const [minutes, seconds, hundredths] = taskTime.split(':').map(part => parseInt(part));
            totalMinutes += minutes;
            totalSeconds += seconds;
            totalHundredths += hundredths;
          }
        }
      });
  
      totalMinutes += Math.floor(totalSeconds / 60);
      totalSeconds %= 60;
      totalSeconds += Math.floor(totalHundredths / 100);
      totalHundredths %= 100;
  
      const formattedTime = `${totalMinutes}:${totalSeconds < 10 ? '0' + totalSeconds : totalSeconds}:${totalHundredths < 10 ? '0' + totalHundredths : totalHundredths}`;
  
      fetch('http://localhost:8081/saveTotalTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ joukkueNimi: team.JoukkueNimi, kokonaisAika: formattedTime }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Kokonaisaika tallennettu onnistuneesti');
        fetchData(); // Päivitä data tallennuksen jälkeen
      })
      .catch(error => {
        console.error('Virhe tallentaessa kokonaisaikaa', error);
        alert('Virhe tallentaessa kokonaisaikaa.');
      });
    });
  };
  

  const divideTeamsIntobrackets = () => {
    const brackets = {};
    data.forEach((team, index) => {
      const bracketName = `Lohko ${team.Lohko}`;
      if (!brackets[bracketName]) {
        brackets[bracketName] = [];
      }
      brackets[bracketName].push(team);
    });
    return brackets;
  };


  const deleteSlowestTeamInBracket = () => {
    const brackets = divideTeamsIntobrackets();
    
    Object.keys(brackets).forEach(bracketName => {
      const bracketTeams = brackets[bracketName];
      if (bracketTeams.length === 0) {
        alert(`${bracketName} on tyhjä.`);
        return;
      }
    
      let slowestTeamIndex = 0;
      let slowestTimeInSeconds = 0;
    
      bracketTeams.forEach((team, index) => {
        const totalTime = calculateTotalTimeInSeconds(team);
        if (totalTime > slowestTimeInSeconds) {
          slowestTimeInSeconds = totalTime;
          slowestTeamIndex = index;
        }
      });
    
      const slowestTeam = bracketTeams[slowestTeamIndex];
      deleteContestant(slowestTeam.JoukkueNimi);
    });
  };


  const moveToValiera = () => {
    fetch('http://localhost:8081/moveToValiera', {
      method: 'POST'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Voittajat siirretty välierään onnistuneesti');
        fetchData();
      })
      .catch(error => {
        console.error('Virhe siirrettäessä voittajia välierään', error);
        alert('Virhe siirrettäessä voittajia välierään.');
      });
  };


  const deleteContestantAndMoveToValiera = (joukkueNimi) => {
    fetch(`http://localhost:8081/deleteContestantAndMoveToValiera/${joukkueNimi}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Joukkue poistettu ja siirretty välierään onnistuneesti');
        fetchData(); // Päivitä data poiston jälkeen
      })
      .catch(error => {
        console.error('Virhe poistettaessa joukkuetta ja siirrettäessä välierään', error);
        alert('Virhe poistettaessa joukkuetta ja siirrettäessä välierään.');
      });
  };


  const moveToCollectionRound = () => {
    fetch('http://localhost:8081/moveToCollectionRound', {
      method: 'POST'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Joukkueet siirretty keräilyerään onnistuneesti');
        fetchData(); // Päivitä data siirron jälkeen
      })
      .catch(error => {
        console.error('Virhe siirrettäessä joukkueita keräilyerään', error);
        alert('Virhe siirrettäessä joukkueita keräilyerään.');
      });
  };
  

  return (
    <div className='container'>
      <div className='container1'>
        <h2 className="header" onClick={addContestant}>Lisää kilpailija</h2>
        <div className="kilpailija-container">
          {Object.entries(divideTeamsIntobrackets()).map(([bracketName, teams]) => (
            <div key={bracketName} className='lohko'>
              <h3>{bracketName}</h3>
              {teams.map((team, i) => (
                <div key={i} className={`kilpailija-item`}>
                  {team.JoukkueNimi}
                  <button className="delete-button" onClick={() => deleteContestantAndMoveToValiera(team.JoukkueNimi)}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className='container2'>

        <h2 className='header' onClick={() => {
          calculateTotalTime();
        }}>Laske kokonaisaika</h2>
        <h2 className='header' onClick={moveToValiera}>Siirrä voittajat välierään</h2>
        <h2 className='header' onClick={moveToCollectionRound}>Siirrä joukkueet keräilyerään</h2>
      </div>
      <div className="navbutton-container">
        <Link to="/" className={`${location.pathname === "/" ? "active" : ""}`}>
          <h2>Edellinen</h2>
        </Link>
        <Link to="/KerailyErat" className={`${location.pathname === "/KerailyErat" ? "active" : ""}`}>
          <h2>Seuraava</h2>
        </Link>
      </div>
    </div>
  );
}

export default AddContestants;


