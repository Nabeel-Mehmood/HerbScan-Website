import React, { useState } from 'react';
import Header from '../Component/header';
import Footer from '../Component/footer';
import './settings.css';
import ProfileImage from '../Assets/userprofile_image.jpg';
import leftArrow from '../Assets/left_arrow.png';
import generalIcon from '../Assets/general.png';
import profileIcon from '../Assets/profile.png';
import passwordIcon from '../Assets/password.png';
import helpIcon from '../Assets/help.png';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isNavContracted, setIsNavContracted] = useState(true); // Set initial state to true
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="tab-content">
            <h2 className="section-title">General</h2>
            <div className="input-group">
              <label>Username:</label>
              <input type="text" placeholder="Enter your username" />
            </div>
            <div className="input-group">
              <label>Email:</label>
              <input type="email" placeholder="Enter your email" />
            </div>
            <button className="save-button">Save</button>
          </div>
        );
      case 'profile':
        return (
          <div className="tab-content">
            <h2 className="section-title">User Profile</h2>
            <div className="profile-section">
              <img src={ProfileImage} alt="Profile" className="profile-icon" />
              <div className="image-actions">
                <button>Change Image</button>
                <button>Delete Image</button>
              </div>
            </div>
            <div className="input-group">
              <label>Name:</label>
              <input type="text" placeholder="Enter your name" />
            </div>
            <div className="input-group">
              <label>Age:</label>
              <input type="number" placeholder="Enter your age" />
            </div>
            <div className="input-group">
              <label>Contact:</label>
              <input type="text" placeholder="Enter your contact" />
            </div>
            <div className="input-group">
              <label>Bio:</label>
              <textarea placeholder="Enter your bio"></textarea>
            </div>
            <button className="save-button">Save</button>
          </div>
        );
      case 'change-password':
        return (
          <div className="tab-content">
            <h2 className="section-title">Change Password</h2>
            <div className="input-group">
              <label>Old Password:</label>
              <input type="password" placeholder="Enter old password" />
            </div>
            <div className="input-group">
              <label>New Password:</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <div className="input-group">
              <label>Confirm Password:</label>
              <input type="password" placeholder="Confirm new password" />
            </div>
            <button className="save-button">Save</button>
          </div>
        );
      case 'help':
        return (
          <div className="tab-content">
            <h2 className="section-title">User Guidelines</h2>
            <ul>
              <li>Use the General tab to set your username and email.</li>
              <li>Use the Profile tab to update your profile picture and personal details.</li>
              <li>Change your password using the Change Password tab.</li>
              <li>Refer to this Help section for guidance on website usage.</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <Header showSearchBar={false} />
      <div className="settings-content">
        <h1 className="page-title">Edit Profile</h1>
        <div className="settings-layout">
          <div className={`sidebar ${isNavContracted ? 'contracted' : ''}`}>
            <button className="back-button" onClick={() => navigate('/')}>
              <img src={leftArrow} alt="Back to Home" className="icon" />
              <span className="nav-text">Back to Home</span>
            </button>
            <button 
                className="toggle-nav" 
                onClick={() => setIsNavContracted(!isNavContracted)}
            >
                <span className="icon-text">☰</span>
            </button>
            <ul className={`tab-list ${isNavContracted ? 'contracted' : ''}`}>
              <li
                onClick={() => handleTabClick('general')}
                className={activeTab === 'general' ? 'active' : ''}
              >
                <img src={generalIcon} alt="General" className="icon" />
                <span className="nav-text">General</span>
              </li>
              <li
                onClick={() => handleTabClick('profile')}
                className={activeTab === 'profile' ? 'active' : ''}
              >
                <img src={profileIcon} alt="Profile" className="icon" />
                <span className="nav-text">Profile</span>
              </li>
              <li
                onClick={() => handleTabClick('change-password')}
                className={activeTab === 'change-password' ? 'active' : ''}
              >
                <img src={passwordIcon} alt="Change Password" className="icon" />
                <span className="nav-text">Change Password</span>
              </li>
              <li
                onClick={() => handleTabClick('help')}
                className={activeTab === 'help' ? 'active' : ''}
              >
                <img src={helpIcon} alt="Help" className="icon" />
                <span className="nav-text">Help</span>
              </li>
            </ul>
          </div>
          <div className="tab-content-area">{renderTabContent()}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Settings;
