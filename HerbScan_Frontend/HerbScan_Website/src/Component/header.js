// ./Component/header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import Logo from '../Assets/logo.png';
import ProfileImage from '../Assets/userprofile_image.jpg';
import UserProfile from './userprofile';

function Header({ showSearchBar = true, onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(`${apiUrl}/session`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    verifyAuth();
  }, [apiUrl]);

  const handleLogout = async (shouldRedirect) => {
    try {
      const response = await fetch(`${apiUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setUser(null);
        if (shouldRedirect && window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  // Handler triggered when the user clicks search or presses Enter.
  const handleSearch = () => {
    if (onSearch && typeof onSearch === "function") {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo-container" onClick={() => window.location.href = '/'}>
        <img src={Logo} alt="Logo" className="logo" />
        {!isScrolled && <span className="logo-text">HerbScan</span>}
      </div>

      {showSearchBar && (
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-bar" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <i className="search-icon fas fa-search" onClick={handleSearch}></i>
        </div>
      )}

      <nav className="nav-bar">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/explore">Explore</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          {user?.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
        </ul>
        {!isScrolled && (
          isLoggedIn ? (
            <div className="user-profile-container">
              <img
                src={ProfileImage}
                alt="Profile"
                className="profile-icon"
                onClick={toggleDropdown}
              />
              {showDropdown && (
                <UserProfile
                  user={user}
                  onLogout={() => handleLogout(true)}
                  onProfileClick={() => window.location.href = '/profile'}
                />
              )}
            </div>
          ) : (
            <button className="signup-btn" onClick={() => window.location.href = '/login'}>
              Sign Up
            </button>
          )
        )}
      </nav>
    </header>
  );
}

export default Header;
