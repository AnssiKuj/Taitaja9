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
        <h2 className="header">Alkuerä</h2>
        <div className="kilpailija-container">
        {data.map((d, i) => (
        <div key={i} className={`kilpailija-item`}>
            <div className="info">
                <span className="joukkue-nimi">{d.JoukkueNimi}</span>
                <span className="tehtava">{d['Tehtävä 1']}</span>
                <span className="tehtava">{d['Tehtävä 2']}</span>
                <span className="tehtava">{d['Tehtävä 3']}</span>
                <span className="tehtava">{d.KokonaisAika}</span>
            </div>
        </div>
        ))}
        </div>
      </div>
      <div className="navbutton-container">
        <Link to="/" className={`${location.pathname === "/" ? "active" : ""}`}>
          <h2>Edellinen</h2>
        </Link>
        <Link to="/TulospalveluKeraily" className={`${location.pathname === "/TulospalveluKeraily" ? "active" : ""}`}>
          <h2>Seuraava</h2>
        </Link>
      </div>
    </div>
  );
}

export default Tulospalvelu;