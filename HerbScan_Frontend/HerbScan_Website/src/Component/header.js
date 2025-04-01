import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import Logo from '../Assets/logo.png';
import ProfileImage from '../Assets/userprofile_image.jpg'; 
import UserProfile from './userprofile'; 

function Header({ showSearchBar = true }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email && parsedUser.password) {
          setIsLoggedIn(true);
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user'); // Remove invalid user data
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo-container" onClick={() => window.location.href = '/'}>
        <img src={Logo} alt="Logo" className="logo" />
        {!isScrolled && <span className="logo-text">HerbScan</span>}
      </div>

      {showSearchBar && (
        <div className="search-bar-container">
          <input type="text" placeholder="Search..." className="search-bar" />
          <i className="search-icon fas fa-search"></i>
        </div>
      )}

      <nav className="nav-bar">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/explore">Explore</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
        {!isScrolled && (
          isLoggedIn ? (
            <div className="user-profile-container">
              <img src={ProfileImage} alt="Profile" className="profile-icon" onClick={toggleDropdown} />
              {showDropdown && <UserProfile user={user} onLogout={handleLogout} />}
            </div>
          ) : (
            <button
              className="signup-btn"
              onClick={() => (window.location.href = '/login')}
            >
              Sign Up
            </button>
          )
        )}
      </nav>
    </header>
  );
}

export default Header;
