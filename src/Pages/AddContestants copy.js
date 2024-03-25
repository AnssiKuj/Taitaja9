import React, { useState, useEffect } from 'react';
import "../css/contestant-container.css"

function Timing() {

  const [data, setData] = useState([])

  useEffect(()=> {
    fetch('http://localhost:8081/joukkueet')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, [])

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
      <div className='container2'>
            <table>
              <thead>
                <th>Nimi</th>
                <th>Aika</th>
              </thead>
              <tbody>
                {data.map((d ,i) =>(
                  <tr key={i}>
                    <td>{d.JoukkueNimi}</td>
                    <td>{d.JoukkueAika}</td>
                  </tr>
                ))}
              </tbody>
            </table>
      </div>
    </div>
  );
}

export default Timing; 







