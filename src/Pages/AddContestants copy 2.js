import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../css/contestant-container.css"

function AddContestants() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/joukkueet')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  });

  const [contestants, setContestants] = useState([]);
  const location = useLocation();

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
            // Fetch the updated list of contestants after adding a new one
            return fetch('http://localhost:8081/joukkueet');
          })
          .then(res => res.json())
          .then(data => {
            // Update the contestants state
            setData(data);
            setContestants(data); // Update the contestants state here
          })
          .catch(error => {
            console.error('Virhelisätessä kilpailijaa', error);
            alert('Virhe lisätessä kilpailijaa.');
          });
      }
    } else {
      alert('Maximum number of contestants reached.');
    }
  };

  return (
    <div className='container'>
      <div className='container1'>
        <h2 className="header" onClick={addContestant}>Lisää kilpailija</h2>
        <div className="kilpailija-container">
          {data.map((d, i) => (
            <div
              key={i}
              className={`kilpailija-item`}
            >
              {d.JoukkueNimi}
            </div>
          ))}
        </div>
      </div>
      <div className='container2'>
        <h2 className="header">Lisää tehtävä</h2>
      </div>
      <div className="navbutton-container">
        <Link to="/" className={`${location.pathname === "/" ? "active" : ""}`}>
          <p>Edellinen</p>
        </Link>
        <Link to="/Ajanotto" className={`${location.pathname === "/Ajanotto" ? "active" : ""}`}>
          <p>Seuraava</p>
        </Link>
      </div>
    </div>
  );
}

export default AddContestants;








