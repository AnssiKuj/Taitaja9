import React, { useState, useEffect } from 'react';
import "../css/contestant-container.css";
import { useNavigate } from 'react-router-dom';

function Timing() {

  const navigate = useNavigate(); // Initialize useNavigate hook

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/joukkueet') // Assuming your server listens on port 8081
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, []);

  const [contestants, setContestants] = useState([]);

  const addContestant = async () => {
    if (contestants.length < 36) {
      const contestantName = prompt("Syötä joukkueen nimi:");

      // Check if user cancelled the prompt
      if (contestantName) {
        try {
          // Send asynchronous POST request to server
          const response = await fetch('/addContestant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contestantName })
          });

          const data = await response.json();
          if (data.message === 'Contestant added successfully') {
            // Update local state only if insertion successful
            setContestants([...contestants, contestantName]);
          } else {
            console.error(data.error); // Handle server-side errors
          }
        } catch (error) {
          console.error(error); // Handle network or other errors
        }
      }
    }
  };

  const handleContestantClick = (contestant) => {
    // Implement your logic for handling contestant click
    navigate(`/contestants/${contestant}`); // Example navigation
  };

  const deleteContestant = (index) => {
    // Implement your logic for deleting a contestant at the given index
    const newContestants = [...contestants];
    newContestants.splice(index, 1);
    setContestants(newContestants);
  };

  return (
    <div className='container'>
      <div className='container1'>
        <h2 className="header" onClick={addContestant}>Lisää kilpailija</h2>
        <div className="kilpailija-container">
          {contestants.map((contestant, index) => (
            <div key={index} className="kilpailija-item">
              <a href="#" onClick={() => handleContestantClick(contestant)}>{contestant}</a>
              <button onClick={() => deleteContestant(index)}>Poista</button>
            </div>
          ))}
        </div>
      </div>
      <div className='container2'>
      </div>
    </div>
  );
}

export default Timing;







