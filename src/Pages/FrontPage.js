import React from 'react';
import { Link } from 'react-router-dom';

function FrontPage() {
  return (
    <div className='container'>
      <div className='frontpage-container'>
      </div>
      <div className='frontpage-container2'>
        <div className="header">
          <h1>Taitaja9</h1>
        </div>
        <div className="links-container">
            <div className="ajanotto-container">
            <Link to="/Ajanotto" >
                <p>Ajanotto</p>
            </Link>
            </div>
            <div className="tulospalvelu-container">
                <Link to="Tulospalvelu">
                    <p>Tulospalvelu</p>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;
