import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header>
      <h1>Product-E-Match</h1>
      <div className="user-actions">
        <button onClick={() => navigate('/profile')}>Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
