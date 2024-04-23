import React, { useState, useEffect } from 'react';
import '../css/ajanotto.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faSave, faUndo } from '@fortawesome/free-solid-svg-icons';

function Ajanotto() {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState(['Tehtävä 1', 'Tehtävä 2', 'Tehtävä 3']);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState('joukkueet'); // Default value

  useEffect(() => {
    fetchTeams();
  }, [selectedDatabase]); // Fetch teams when selected database changes

  useEffect(() => {
    // Reset the timer when team or task changes
    handleResetTimer();
  }, [selectedTeam, selectedTask]);

  const fetchTeams = () => {
    fetch(`http://localhost:8081/${selectedDatabase}`) // Use selected database in URL
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.log(err));
  };

  // Handle team selection
  const handleTeamSelect = (event) => {
    setSelectedTeam(event.target.value);
  };

  // Handle task selection
  const handleTaskSelect = (event) => {
    setSelectedTask(event.target.value);
  };

  // Start the timer
  const handleStartTimer = () => {
    if (!isTimerRunning && selectedTeam && selectedTask) {
      setIsTimerRunning(true);
      setStartTime(Date.now() - elapsedTime);
    } else if (!selectedTeam || !selectedTask) {
      alert('Valitse ensin joukkue ja tehtävä aloittaaksesi ajanoton.');
    }
  };

  // Stop the timer
  const handleStopTimer = () => {
    setIsTimerRunning(false);
    setElapsedTime(Date.now() - startTime);
  };

  // Save the elapsed time to the database
  const handleSaveTime = () => {
    const formattedTime = formatTime(elapsedTime);
    let saveEndpoint;
  
    // Määritä tallennusosoite valitun tietokannan perusteella
    switch (selectedDatabase) {
      case 'joukkueet':
        saveEndpoint = 'http://localhost:8081/saveTime';
        break;
      case 'kerailyerat':
        saveEndpoint = 'http://localhost:8081/saveCollectionTime';
        break;
      case 'valiera':
        saveEndpoint = 'http://localhost:8081/saveFinalTime';
        break;
      default:
        saveEndpoint = 'http://localhost:8081/saveTime'; // Oletusarvo, jos valittua tietokantaa ei ole määritetty
    }
  
    // Tee fetch-pyyntö tallennusosoitteeseen
    fetch(saveEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ joukkueNimi: selectedTeam, tehtava: selectedTask, aika: formattedTime }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Aika tallennettu onnistuneesti');
        alert('Aika tallennettu onnistuneesti');
      })
      .catch(error => {
        console.error('Virhe tallentaessa aikaa', error);
        alert('Virhe tallentaessa aikaa.');
      });
  };

  // Reset the timer
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setStartTime(null);
    setElapsedTime(0);
  };

  // Update elapsed time
  useEffect(() => {
    let intervalId;
    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isTimerRunning, startTime]);

  // Format time in minutes, seconds, and centiseconds
  const formatTime = (time) => {
    const centiseconds = Math.floor((time / 10) % 100);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}:${centiseconds < 10 ? '0' + centiseconds : centiseconds}`;
  };

  return (
    <div className='container'>
      <div className='container1'>
        <h1>Valitse joukkue ja tehtävä</h1>
        <select className='select' value={selectedDatabase} onChange={(e) => setSelectedDatabase(e.target.value)}>
          <option value="joukkueet">Joukkueet</option>
          <option value="kerailyerat">Keräilyerät</option>
          <option value="valiera">Välierät</option>
        </select>
        <select className='select' value={selectedTeam} onChange={handleTeamSelect}>
          <option value="">Valitse joukkue</option>
          {teams.map((team, index) => (
            <option key={index} value={team.JoukkueNimi}>{team.JoukkueNimi}</option>
          ))}
        </select>
        <select className='select' value={selectedTask} onChange={handleTaskSelect}>
          <option value="">Valitse tehtävä</option>
          {tasks.map((task, index) => (
            <option key={index} value={task}>{task}</option>
          ))}
        </select>
        <div className='timer'>
          <h2>{formatTime(elapsedTime)}</h2>
        </div>
        <button className='button1' onClick={handleStartTimer}>
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button className='button' onClick={handleStopTimer}>
          <FontAwesomeIcon icon={faStop} />
        </button>
        <button className='button' onClick={handleSaveTime}>
          <FontAwesomeIcon icon={faSave} />
        </button>
        <button className='button4' onClick={handleResetTimer}>
          <FontAwesomeIcon icon={faUndo} />
        </button>
      </div>
    </div>
  );
}

export default Ajanotto;

