import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <img src="src/assets/logo.png" alt="RapidAid Logo" className="logo-image" />
            <h1>RapidAid</h1>
          </Link>
        </div>
        <nav className="header-nav">
          <Link 
            to="/submit" 
            className={`nav-link ${isActive('/submit') || isActive('/') ? 'active' : ''}`}
          >
            Submit Request
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;