import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../css/contestant-container.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Finaali() {
  const [data, setData] = useState([]);
  const location = useLocation();
  const [brackets, setBrackets] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:8081/finaali')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
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

  const calculateTotalTime4 = () => {
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
  
      fetch('http://localhost:8081/saveTotalTime4', {
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
      const bracketName = `Finalistit`;
      if (!brackets[bracketName]) {
        brackets[bracketName] = [];
      }
      brackets[bracketName].push(team);
    });
    return brackets;
  };

  return (
    <div className='container'>
      <div className='container1'>
        <h2 className="header">Finaali</h2>
        <div className="kilpailija-container">
          {Object.entries(divideTeamsIntobrackets()).map(([bracketName, teams]) => (
            <div key={bracketName} className='lohko'>
              <h3>{bracketName}</h3>
              {teams.map((team, i) => (
                <div key={i} className={`kilpailija-item`}>
                  {team.JoukkueNimi}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className='container2'>

        <h2 className='header' onClick={() => {
          calculateTotalTime4();
        }}>Laske kokonaisaika</h2>
      </div>
      <div className="navbutton-container">
        <Link to="/Valiera" className={`${location.pathname === "/Valiera" ? "active" : ""}`}>
          <h2>Edellinen</h2>
        </Link>
        <Link to="/finaali" className={`${location.pathname === "/finaali" ? "active" : ""}`}>
          <h2>Seuraava</h2>
        </Link>
      </div>
    </div>
  );
}

export default Finaali;