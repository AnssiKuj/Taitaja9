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
        {Array.from({ length: 36 }).map((_, index) => {
        const contestant = contestants[index];
        return (
          <div key={index} className="kilpailija-item">
            {contestant ? contestant : ""}
          </div>
          );
          })}
        </div>
      </div>
      <div className='container2'></div>
    </div>
  );
}

export default Timing;





