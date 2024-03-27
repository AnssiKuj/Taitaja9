import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../css/contestant-container.css"

function Timing() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/joukkueet')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, []);

  const [contestants, setContestants] = useState([]);
  const location = useLocation();

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
            return fetch('http://localhost:8081/joukkueet');
          })
          .then(res => res.json())
          .then(data => {
            setData(data);
          })
          .catch(error => {
            console.error('Virhelisätessä kilpailijaa', error);
            alert('Virhe lisätessä kilpailijaa.');
          });
      }
    }
  };

  return (
    <div className='container'>
      <div className='container1'>
        <h2 className="header" onClick={addContestant}>Lisää kilpailija</h2>
        <div className="kilpailija-container">
          {data.map((d, i) => (
            <Link
              key={i}
              to={`/Joukkue${i + 1}`} // Luo dynaamiset reitit kilpailijoille
              className={`kilpailija-item${location.pathname === `/Joukkue${i + 1}` ? "active" : ""}`}
            >
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








