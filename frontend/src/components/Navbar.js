import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🍳 Recipe App
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/" className="navbar-link">Home</Link>
              <Link to="/favorites" className="navbar-link">My Favorites</Link>
              <span className="navbar-user">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


