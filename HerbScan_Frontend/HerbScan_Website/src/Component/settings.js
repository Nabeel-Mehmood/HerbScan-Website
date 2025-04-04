// ./Component/Settings.js
import React, { useState, useEffect, useRef } from 'react';
import Header from '../Component/header';
import Footer from '../Component/footer';
import './settings.css';
import ProfileImageDefault from '../Assets/userprofile_image.jpg';
import leftArrow from '../Assets/left_arrow.png';
import profileIcon from '../Assets/profile.png';
import passwordIcon from '../Assets/password.png';
import helpIcon from '../Assets/help.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isNavContracted, setIsNavContracted] = useState(false); // Sidebar expanded by default
  const navigate = useNavigate();

  // Profile state includes extra fields
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    contact: '',
    bio: '',
    profileImage: ProfileImageDefault,
  });
  // This will store the effective default/fallback image.
  const [defaultImage, setDefaultImage] = useState(ProfileImageDefault);

  // Password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // useRef for hidden file input
  const fileInputRef = useRef(null);

  // Fetch the current user's profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/profile', { withCredentials: true });
      // If the fetched profileImage is missing or equals the simple default string,
      // replace it with the bundled ProfileImageDefault.
      let fetchedImage = res.data.profileImage;
      if (!fetchedImage || fetchedImage === "default_profile.jpg") {
        fetchedImage = ProfileImageDefault;
      }
      setProfile({ ...res.data, profileImage: fetchedImage });
      setDefaultImage(fetchedImage);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const res = await axios.put('/api/profile', profile, { withCredentials: true });
      // After the update, reapply substitution for the profileImage.
      let updatedImage = res.data.profileImage;
      if (!updatedImage || updatedImage === "default_profile.jpg") {
        updatedImage = ProfileImageDefault;
      }
      setProfile({ ...res.data, profileImage: updatedImage });
      setDefaultImage(updatedImage);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  // Trigger file input on change image click.
  const handleChangeImage = () => {
    fileInputRef.current.click();
  };

  // Upload file when selected.
  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Uploading file:", file);
      const formData = new FormData();
      formData.append('profileImage', file);
      try {
        const res = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        if (res.status === 201) {
          console.log("Upload success, new URL:", res.data.profileImage);
          // Update the profile image with the returned URL.
          handleProfileChange('profileImage', res.data.profileImage);
          fetchProfile(); // Refresh profile info.
        }
      } catch (error) {
        console.error('Error uploading image:', error.response?.data || error.message);
        alert('Error uploading image: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  // Delete image: update the profileImage field to be the default image.
  const handleDeleteImage = async () => {
    try {
      const updatedProfile = { ...profile, profileImage: ProfileImageDefault };
      const res = await axios.put('/api/profile', updatedProfile, { withCredentials: true });
      // Set profileImage from response, applying fallback substitution.
      let updatedImage = res.data.profileImage;
      if (!updatedImage || updatedImage === "default_profile.jpg") {
        updatedImage = ProfileImageDefault;
      }
      setProfile({ ...res.data, profileImage: updatedImage });
      setDefaultImage(updatedImage);
      alert("Profile image has been reset to default.");
    } catch (error) {
      console.error("Error resetting profile image:", error);
      alert("Error resetting image");
    }
  };

  // Handle password change.
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match");
      return;
    }
    try {
      const res = await axios.put('/api/profile/password', { oldPassword, newPassword }, { withCredentials: true });
      alert(res.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.response?.data?.error || 'Error changing password');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="tab-content">
            <h2 className="section-title">User Profile</h2>
            <div className="profile-section">
              <img src={profile.profileImage} alt="Profile" className="profile-icon" />
              <div className="image-actions">
                <button onClick={handleChangeImage}>Change Image</button>
                <button onClick={handleDeleteImage}>Delete Image</button>
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={onFileChange}
                />
              </div>
            </div>
            <div className="input-group">
              <label>Name:</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Age:</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => handleProfileChange('age', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Contact:</label>
              <input
                type="text"
                value={profile.contact}
                onChange={(e) => handleProfileChange('contact', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Bio:</label>
              <textarea
                value={profile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
              ></textarea>
            </div>
            <button className="save-button" onClick={handleSaveProfile}>Save</button>
          </div>
        );
      case 'change-password':
        return (
          <div className="tab-content">
            <h2 className="section-title">Change Password</h2>
            <div className="input-group">
              <label>Old Password:</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="save-button" onClick={handleChangePassword}>Save</button>
          </div>
        );
      case 'help':
        return (
          <div className="tab-content">
            <h2 className="section-title">User Guidelines</h2>
            <ul>
              <li>Update your profile details in the Profile tab.</li>
              <li>Change your password in the Change Password tab.</li>
              <li>If you delete your profile image, the default image will be restored.</li>
              <li>Contact support if you encounter issues.</li>
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
          <aside className={`sidebar ${isNavContracted ? 'contracted' : 'expanded'}`}>
            <button className="back-button" onClick={() => navigate('/')}>
              <img src={leftArrow} alt="Back to Home" className="icon" />
              <span className="nav-text">Back to Home</span>
            </button>
            <button
              className="toggle-nav"
              onClick={() => setIsNavContracted(!isNavContracted)}
            >
              <span className="icon-text">{isNavContracted ? '≡' : '≡'}</span>
            </button>
            <ul className="tab-list">
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
          </aside>
          <main className="tab-content-area">
            {renderTabContent()}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Settings;
