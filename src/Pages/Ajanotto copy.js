import React, { useState, useEffect } from 'react';

function Ajanotto() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [centiseconds, setCentiseconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    fetch('http://localhost:8081/joukkueet')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.log(err));
  };

  const handleTeamSelect = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleStartTimer = () => {
    if (selectedTeam) {
      setIsTimerRunning(true);
    } else {
      alert('Valitse ensin joukkue aloittaaksesi ajanoton.');
    }
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
  };

  useEffect(() => {
    let intervalId;
    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setCentiseconds(prevCentiseconds => (prevCentiseconds + 1) % 100);
        setSeconds(prevSeconds => {
          if (prevSeconds === 59) {
            setMinutes(prevMinutes => prevMinutes + 1);
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 10);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isTimerRunning]);

  return (
    <div>
      <h1>Valitse joukkue:</h1>
      <select value={selectedTeam} onChange={handleTeamSelect}>
        <option value="">Valitse joukkue</option>
        {teams.map((team, index) => (
          <option key={index} value={team.JoukkueNimi}>{team.JoukkueNimi}</option>
        ))}
      </select>
      <button onClick={handleStartTimer}>Aloita ajanotto</button>
      <button onClick={handleStopTimer}>Pysäytä ajanotto</button>
      <div>
        {/* Näytetään ajastimen arvo */}
        <h2>Ajanotto: {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}:{centiseconds < 10 ? `0${centiseconds}` : centiseconds}</h2>
      </div>
    </div>
  );
}

export default Ajanotto;




