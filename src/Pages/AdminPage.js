import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../css/contestant-container.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function AddContestants() {
  const [data, setData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:8081/joukkueet')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, []);

  const addContestant = () => {
    if (data.length < 36) {
      const contestantName = prompt("Syötä joukkueen nimi:");
      if (contestantName) {
        fetch('http://localhost:8081/insertContestant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ JoukkueNimi: contestantName }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            console.log('Kilpailija lisätty onnistuneesti');
            setData([...data, { JoukkueNimi: contestantName }]);
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
        const updatedData = data.filter(item => item.JoukkueNimi !== joukkueNimi);
        setData(updatedData);
      })
      .catch(error => {
        console.error('Virhe poistettaessa joukkuetta', error);
        alert('Virhe poistettaessa joukkuetta.');
      });
  };

  const shuffleTeams = () => {
    const shuffledData = [...data];
    for (let i = shuffledData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
    }
    setData(shuffledData);
  };

  const removeSlowest = () => {
    fetch('http://localhost:8081/removeSlowestPerBlock', {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Hitain joukkue jokaisesta lohkosta poistettu onnistuneesti');
        fetch('http://localhost:8081/joukkueet')
          .then(res => res.json())
          .then(data => setData(data))
          .catch(err => console.log(err));
      })
      .catch(error => {
        console.error('Virhe poistettaessa hitainta joukkuetta lohkosta', error);
        alert('Virhe poistettaessa hitainta joukkuetta lohkosta.');
      });
  };

  // Jaa joukkueet lohkoihin ja nimetään lohkot
  const divideTeamsIntoBlocks = () => {
    const blocks = {};
    data.forEach((team, index) => {
      const blockName = `Lohko ${index % 6 + 1}`;
      if (!blocks[blockName]) {
        blocks[blockName] = [];
      }
      blocks[blockName].push(team);
    });
    return blocks;
  };

  return (
    <div className='container'>
      <div className='container1'>
        <h2 className="header" onClick={addContestant}>Lisää kilpailija</h2>
        <div className="kilpailija-container">
          {Object.entries(divideTeamsIntoBlocks()).map(([blockName, teams]) => (
            <div key={blockName} className='lohko'>
              <h3>{blockName}</h3>
              {teams.map((team, i) => (
                <div key={i} className={`kilpailija-item`}>
                  {team.JoukkueNimi}
                  <button className="delete-button" onClick={() => deleteContestant(team.JoukkueNimi)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className='container2'>
        <h2>Jaa joukkueet eriin</h2>
        <button onClick={shuffleTeams}>Jaa ja sekoita</button>
        <button onClick={removeSlowest}>Poista hitaimmat</button>
      </div>
      <div className="navbutton-container">
        <Link to="/" className={`${location.pathname === "/" ? "active" : ""}`}>
          <h2>Edellinen</h2>
        </Link>
        <Link to="/Ajanotto" className={`${location.pathname === "/Ajanotto" ? "active" : ""}`}>
          <h2>Seuraava</h2>
        </Link>
      </div>
    </div>
  );
}

export default AddContestants;




