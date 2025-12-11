import React, { useState, useRef, useEffect, useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';

const CustomHeader = () => {
  const { config: appConfig, authenticatedUser } = useContext(AppContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header className="learning-header" style={{
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      <a className="sr-only sr-only-focusable" href="#main-content">
        Skip to main content.
      </a>
      <div className="container-xl py-2 d-flex align-items-center">

        <a
          href={appConfig.LMS_BASE_URL + '/dashboard'}
          className="logo d-flex align-items-center me-4"
        >
          <img
            className="d-block"
            src="/static/images/logo.png"
            alt="Лого компании"
            style={{ height: '40px' }}
          />
        </a>

        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
          <a
            href={appConfig.LMS_BASE_URL + '/dashboard'}
            className="nav-link me-3"
            style={{
              whiteSpace: 'nowrap',
              padding: '0.5rem 1rem',
              color: '#6c757d',
              fontWeight: '500',
              textDecoration: 'none',
              borderRadius: '0',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              display: 'inline-block',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#2c3e50';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#6c757d';
            }}
          >
            Мои курсы
          </a>
          <div
            style={{
              position: 'absolute',
              bottom: '-2px',
              left: '1rem',
              right: '1rem',
              height: '3px',
              backgroundColor: 'transparent',
              transition: 'background-color 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#15376d';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          />
        </div>

        <div className="flex-grow-1"></div>

        {authenticatedUser && (
          <div
            ref={dropdownRef}
            className={`pgn__dropdown pgn__dropdown-light dropdown ${isDropdownOpen ? 'show' : ''}`}
          >
            <button
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              aria-label="Опции пользователя"
              type="button"
              className="dropdown-toggle btn btn-outline-primary d-flex align-items-center"
              onClick={toggleDropdown}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                className="svg-inline--fa fa-circle-user fa-lg d-md-none me-2"
                role="img"
                viewBox="0 0 512 512"
                style={{ height: '20px' }}
              >
                <path
                  fill="currentColor"
                  d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"
                />
              </svg>
              <span data-hj-suppress="true" className="d-none d-md-inline">
                {authenticatedUser.username}
              </span>
            </button>
            <div className={`dropdown-menu-right dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
              <a href={appConfig.LMS_BASE_URL + '/dashboard'} className="pgn__dropdown-item dropdown-item">
                Панель управления
              </a>
              <a
                href={`${appConfig.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`}
                className="pgn__dropdown-item dropdown-item"
              >
                Профиль
              </a>
              <a href={appConfig.ACCOUNT_SETTINGS_URL} className="pgn__dropdown-item dropdown-item">
                Учётная запись
              </a>
              <a href={appConfig.LOGOUT_URL} className="pgn__dropdown-item dropdown-item">
                Выход
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CustomHeader;