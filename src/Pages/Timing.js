import React, { useState } from 'react';

function Timing() {
  const [contestants, setContestants] = useState([]);

  const addContestant = () => {
    if (contestants.length < 36) {
      const newContestantId = contestants.length + 1;
      setContestants(prevContestants => [...prevContestants, `Joukkue ${newContestantId}`]);
    }
  };

  return (
    <div className='container'>
      <div className='container1'>
        <button onClick={addContestant}>Add Contestant</button>
        <div className="grid-container">
          {Array.from({ length: 36 }).map((_, index) => {
            const contestant = contestants[index];
            return (
              <div key={index} className="grid-item">
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





