// ./Component/UserProfile.js
import React, { useEffect, useRef, useState } from 'react';
import './userprofile.css';
import DefaultProfileImage from '../Assets/userprofile_image.jpg';

function UserProfile({ user, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const dropdownRef = useRef(null);

  // Close dropdown on scroll.
  useEffect(() => {
    const handleScroll = () => {
      setIsDropdownOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown if clicking outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {isDropdownOpen && (
        <div className="user-profile-dropdown" ref={dropdownRef}>
          <div className="user-info">
            <img
              src={user.profileImage || DefaultProfileImage}
              alt="Profile"
              className="profile-picture"
            />
            <div className="user-details">
              <h3>{user.name}</h3>
            </div>
          </div>
          <div className="profile-actions">
            <button onClick={() => (window.location.href = '/history')}>History</button>
            <button onClick={() => (window.location.href = '/settings')}>Settings</button>
            <button className="logout-button" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserProfile;
