import React, { useState, useEffect } from 'react';
import { createConnection } from 'mysql2/promise';

function Timing() {
  const [contestants, setContestants] = useState([]);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const connect = async () => {
      const conn = await createConnection({
        host: 'localhost',
        user: 'your_username',
        password: 'your_password',
        database: 'your_database_name'
      });
      setConnection(conn);
    };

    connect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (connection) {
        try {
          const [results] = await connection.execute('SELECT name FROM contestants');
          setContestants(results.map(row => row.name));
        } catch (error) {
          console.error('Error fetching contestants:', error);
        }
      }
    };

    connect();
    fetchData();
  }, [connection]);

  const addContestant = async () => {
    if (contestants.length < 36) {
      const contestantName = prompt("Syötä joukkueen nimi:");
      if (contestantName) {
        if (connection) {
          try {
            await connection.execute('INSERT INTO contestants (name) VALUES (?)', [contestantName]);
            setContestants(prevContestants => [...prevContestants, contestantName]);
          } catch (error) {
            console.error('Error adding contestant:', error);
          }
        }
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







