import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../css/contestant-container.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Lisätty faTimes rasti-ikonia varten

function AddContestants() {
  const [data, setData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:8081/joukkueet')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, [data]); // Muutettu lisäämään riippuvuus datasta

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
            setData([...data, { JoukkueNimi: contestantName }]); // Päivitetty lisäämään uusi joukkue suoraan frontendin tilaan
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
        // Päivitetään data poistetun joukkueen jälkeen
        const updatedData = data.filter(item => item.JoukkueNimi !== joukkueNimi);
        setData(updatedData);
      })
      .catch(error => {
        console.error('Virhe poistettaessa joukkuetta', error);
        alert('Virhe poistettaessa joukkuetta.');
      });
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
              <button className="delete-button" onClick={() => deleteContestant(d.JoukkueNimi)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
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










