import React, { useState } from 'react';
import "../css/contestant-container.css"

function Timing() {
  const [contestants, setContestants] = useState([]);

  const addContestant = () => {
    if (contestants.length < 36) {
      const contestantName = prompt("Syötä joukkueen nimi:");
      if (contestantName) {
        setContestants(prevContestants => [...prevContestants, contestantName]);
      }
    }
  };

  return (
    <div className='container'>
      <div className='container1'>
        <h2 className="header" onClick={addContestant}>Lisää kilpailija</h2>
        <div className="kilpailija-container">
          {contestants.map((contestant, index) => (
            <div key={index} className="kilpailija-item">
              {contestant}
            </div>
          ))}
        </div>
      </div>
      <div className='container2'></div>
    </div>
  );
}

export default Timing; 







