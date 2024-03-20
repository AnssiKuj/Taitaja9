import React, { useState, useEffect } from 'react';
import '../css/contestant-container.css'; // Assuming CSS file for styling

function AddContestants() {
  const [contestants, setContestants] = useState([]);

  useEffect(() => {
    const fetchContestants = async () => {
      try {
        const response = await fetch('/api/contestants'); // Replace with your endpoint
        const data = await response.json();
        setContestants(data);
      } catch (error) {
        console.error('Error fetching contestants:', error);
        // Handle errors (display message to user, etc.)
      }
    };

    fetchContestants();
  }, []);

  const addContestant = async (name) => {
    try {
      const response = await fetch('/api/contestants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }) // Send contestant data (name)
      });

      const data = await response.json();
      console.log('Server response:', data); // Check response from server

      // Potentially update local state or UI based on response (optional)
    } catch (error) {
      console.error('Error adding contestant:', error);
      alert('Failed to add contestant!'); // Handle error for user
    }
  };

  return (
    <div className='container'>
      <div className='container1'>
        <h2 className="header" onClick={() => addContestant('{/* Prompt for name here */}')}>Lisää kilpailija</h2>  {/* Replace with prompt */}
        <div className="kilpailija-container">
          {contestants.map((contestant, index) => (
            <div key={index} className="kilpailija-item">
              {contestant.name}  // Assuming name property in contestant object
            </div>
          ))}
        </div>
      </div>
      <div className='container2'></div>
    </div>
  );
}

export default AddContestants;






