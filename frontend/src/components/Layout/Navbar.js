import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null; // Don't render navbar for non-authenticated users
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          Task Manager
        </Link>
      </div>
      
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">
          Dashboard
        </Link>
        <Link to="/tasks" className="navbar-item">
          Tasks
        </Link>
        <Link to="/tasks/create" className="navbar-item">
          Create Task
        </Link>
      </div>
      
      <div className="navbar-end">
        <div className="navbar-user">
          <span className="user-name">{user?.name}</span>
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;