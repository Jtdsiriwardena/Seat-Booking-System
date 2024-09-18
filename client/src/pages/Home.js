import React from 'react';
import { Link } from 'react-router-dom';
import mobile from './images/mobile.png';
import sltLogo from './images/logo.png';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="header">
        <img src={sltLogo} alt="SLT Logo" className="logo" />
        <div className="button-group">
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        </div>
      </header>

      <div className="main-content">
        <div className="text-section">
          <h1>Your Gateway to Easy and Quick Seat Booking!</h1>
          <h2>Book Your Seat with Ease!</h2>
        </div>
        <div className="image-section">
          <img src={mobile} alt="Woman booking a seat" />
        </div>
      </div>

      <footer className="footer">
        <p>© 2024 Sri Lanka Telecom. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
