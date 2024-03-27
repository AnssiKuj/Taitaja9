import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../css/contestant-container.css"

function Timing() {

  // Tallentaa kilpailijoiden tiedot
  const [data, setData] = useState([])

  useEffect(()=> {
    // Haetaan kilpailijoiden tiedot palvelimelta
    fetch('http://localhost:8081/joukkueet')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, [])


  const [contestants, setContestants] = useState([]);

  // Funktio, joka lisää uuden kilpailijan tietokantaan
  const addContestant = () => {
    if (contestants.length < 36) {
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
          // Päivittää listan kilpailijoista
          return fetch('http://localhost:8081/joukkueet');
        })
        .then(res => res.json())
        .then(data => {
          // Päivitetään data
          setData(data);
        })
        .catch(error => {
          console.error('Virhelisätessä kilpailijaa', error);
          alert('Virhe lisätessä kilpailijaa.');
        });
      }
    }
  };

  const location = useLocation();
  

  return (
    <div className='container'>
      <div className='container1'>
        {/* Lisää kilpaili clikkaamalla otsikkoa */}
        <h2 className="header" onClick={addContestant}>Lisää kilpailija</h2>
        <div className="kilpailija-container">
          {/* Kilpailijoiden tiedot */}
            {data.map((d, i) => (
              <Link to="/AddContestants" className={`kilpailija-item${location.pathname === "/AddContestants" ? "active" : ""}`}>
              {d.JoukkueNimi}
              </Link>
          ))}
        </div>
      </div>
      <div className='container2'>
      </div>
    </div>
  );
}

export default Timing; 







