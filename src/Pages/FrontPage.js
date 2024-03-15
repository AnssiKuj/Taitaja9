import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function FrontPage() {

  const location = useLocation();
  return (
    <div className='container'>
      <div className='FrontPage-container1'>
      </div>
      <div className='container2'>
        <div className="header">
          <h1>Taitaja9</h1>
        </div>
        <div className="links-container">
            <div className="ajanotto-container">
              <Link to="/Timing" className={`form-page-nav-block ${location.pathname === "/Timing" ? "active" : ""}`}>
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
