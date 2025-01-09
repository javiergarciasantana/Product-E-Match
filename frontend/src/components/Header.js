import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo" onClick={() => navigate('/home')}>
          Product<span>E</span>Match
        </h1>
        <div className="search-bar">
        <input
          type="text"
          placeholder="Search for jerseys..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        </div>
        <div className="user-actions">
          <button className="profile-btn" onClick={() => navigate('/profile')}>
            Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
