import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getTab = () => {
    try {
      const params = new URLSearchParams(location.search);
      return params.get('tab');
    } catch (e) {
      return null;
    }
  };

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const setTab = (tab) => {
    const base = location.pathname || '/';
    const params = new URLSearchParams(location.search);
    if (tab) params.set('tab', tab); else params.delete('tab');
    navigate({ pathname: base, search: params.toString() ? `?${params.toString()}` : '' });
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <img src="src/assets/logo.png" alt="RapidAid Logo" className="logo-image" />
            <h1>{t('appName')}</h1>
          </Link>
        </div>
        {/* Top-left tabs for switching between user and organization views */}
        <nav className="header-tabs">
          <Link
            to="/submit"
            className={`tab-link ${isActive('/submit') || isActive('/') ? 'active' : ''}`}
          >
            {t('users')}
          </Link>
          <Link
            to="/dashboard"
            className={`tab-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            {t('organizations')}
          </Link>
        </nav>

        <nav className="header-nav">
          <Link 
            to="/submit" 
            className={`nav-link ${isActive('/submit') || isActive('/') ? 'active' : ''}`}
          >
            {t('submitRequest')}
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            {t('dashboard')}
          </Link>
        </nav>

        <div className="header-lang">
          <label htmlFor="lang-select" className="sr-only">{t('language')}</label>
          <select id="lang-select" value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;