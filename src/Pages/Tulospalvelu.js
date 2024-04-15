import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../css/tulospalvelu.css"

function Tulospalvelu() {
  const [data, setData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:8081/joukkueet')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, [data]); // Muutettu lisäämään riippuvuus datasta


  return (
    <div className='container'>
      <div className='container1'>
        <h2 className="header">Tulospalvelu</h2>
        <div className="kilpailija-container">
        {data.map((d, i) => (
        <div key={i} className={`kilpailija-item`}>
            <div className="info">
                <span className="joukkue-nimi">{d.JoukkueNimi}</span>
                <span className="tehtava">{d['Tehtävä 1']}</span>
                <span className="tehtava">{d['Tehtävä 2']}</span>
                <span className="tehtava">{d['Tehtävä 3']}</span>
            </div>
        </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default Tulospalvelu;