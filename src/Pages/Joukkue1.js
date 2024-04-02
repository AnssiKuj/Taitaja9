import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Joukkue1() {
  const [joukkue, setJoukkue] = useState({});
  const { joukkueId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8081/joukkueet/${joukkueId}`)
      .then(res => res.json())
      .then(data => setJoukkue(data))
      .catch(err => console.log(err));
  }, [joukkueId]);

  return (
    <div>
      <h1>{joukkue.JoukkueNimi}</h1>
      <h1>Testi</h1>
      {/* Muut joukkueen tiedot */}
    </div>
  );
}

export default Joukkue1;
