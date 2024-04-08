import React, { useState, useEffect } from 'react';
import '../css/ajanotto.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faSave, faUndo } from '@fortawesome/free-solid-svg-icons';


function Ajanotto() {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState(['Tehtävä 1', 'Tehtävä 2', 'Tehtävä 3']); // Muutettu tehtävien nimet
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    // Nollaa ajastimen, kun joukkuetta tai tehtävää vaihdetaan
    handleResetTimer();
  }, [selectedTeam, selectedTask]);

  const fetchTeams = () => {
    fetch('http://localhost:8081/joukkueet')
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.log(err));
  };

  const handleTeamSelect = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleTaskSelect = (event) => {
    setSelectedTask(event.target.value);
  };

  const handleStartTimer = () => {
    if (!isTimerRunning && selectedTeam && selectedTask) {
      setIsTimerRunning(true);
      setStartTime(Date.now() - elapsedTime); // Aloita ajanlasku aiemmalta kohdalta
    } else if (!selectedTeam || !selectedTask) {
      alert('Valitse ensin joukkue ja tehtävä aloittaaksesi ajanoton.');
    }
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    setElapsedTime(Date.now() - startTime);
  };

  const handleSaveTime = () => {
    const formattedTime = formatTime(elapsedTime);
    //Tallenna aika tehtävä kohtaisesti
    fetch('http://localhost:8081/saveTime', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ joukkueNimi: selectedTeam, tehtava: selectedTask, aika: formattedTime }), // Lisää valittu Joukkue ja tehtävä
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

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setStartTime(null);
    setElapsedTime(0);
  };

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
