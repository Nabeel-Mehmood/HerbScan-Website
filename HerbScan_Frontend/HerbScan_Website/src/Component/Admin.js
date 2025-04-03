// ./Component/Admin.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

// Helper function to generate a unique ID (for display only)
// Only used for users since the backend returns only "name" and "blocked".
const generateUniqueId = () =>
  '_' + Math.random().toString(36).substr(2, 9);

const Admin = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // State arrays for data from the backend.
  const [users, setUsers] = useState([]);
  const [plants, setPlants] = useState([]);
  const [emails, setEmails] = useState([]);

  // New states for email modal and multiple email selection.
  const [emailSearchTerm, setEmailSearchTerm] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(null);

  // Search states for users and plants.
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [plantSearchTerm, setPlantSearchTerm] = useState('');

  // Modal state for plant management.
  const [plantModalOpen, setPlantModalOpen] = useState(false);
  const [plantModalMode, setPlantModalMode] = useState('add'); // 'add' or 'edit'
  const [currentPlant, setCurrentPlant] = useState(null);

  // Context menu state for plants (on right-click).
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, plantId: null });

  // Protect admin route using session-based authentication.
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/auth/session', { withCredentials: true });
        if (response.data.user.role !== 'admin') {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        navigate('/login', { replace: true });
      }
    };
    checkSession();
  }, [navigate]);

  // Update the current time every second.
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real user data from the backend.
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users', { withCredentials: true });
      // Map the user records to add a locally generated unique _id for display.
      const usersWithId = response.data.map(user => ({
        ...user,
        _id: generateUniqueId()
      }));
      setUsers(usersWithId);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch plants from the backend.
  const fetchPlants = async () => {
    try {
      const response = await axios.get('/api/plants', { withCredentials: true });
      setPlants(response.data);
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

  // Fetch emails from the backend.
  const fetchEmails = async () => {
    try {
      const response = await axios.get('/api/emails', { withCredentials: true });
      setEmails(response.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  // Refresh data whenever the selected tab changes.
  useEffect(() => {
    if (selectedTab === "dashboard" || selectedTab === "userManagement") {
      fetchUsers();
    }
    if (selectedTab === "dashboard" || selectedTab === "plantManagement") {
      fetchPlants();
    }
    if (selectedTab === "dashboard" || selectedTab === "emails") {
      fetchEmails();
    }
  }, [selectedTab]);

  // Logout handler.
  const handleSignOut = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // --- User Management Functions ---
  // Uses user.name as identifier when calling backend endpoints.
  const handleBlockUser = async (userName) => {
    try {
      await axios.patch(`/api/users/${userName}/block`, {}, { withCredentials: true });
      fetchUsers(); // Refresh the list.
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
    }
  };

  const handleRemoveUser = async (userName) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        await axios.delete(`/api/users/${userName}`, { withCredentials: true });
        fetchUsers(); // Refresh the list.
      } catch (error) {
        console.error('Error removing user:', error);
      }
    }
  };

  // --- Plant Management Functions ---
  const handleAddPlantSubmit = async (plantData) => {
    try {
      await axios.post('/api/plants', plantData, { withCredentials: true });
      fetchPlants();
    } catch (error) {
      console.error("Error adding plant:", error);
    }
  };

  const handleEditPlantSubmit = async (plantData) => {
    try {
      await axios.put(`/api/plants/${currentPlant._id}`, plantData, { withCredentials: true });
      fetchPlants();
    } catch (error) {
      console.error("Error updating plant:", error);
    }
  };

  const handleDeletePlant = async (plantId) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        await axios.delete(`/api/plants/${plantId}`, { withCredentials: true });
        fetchPlants();
      } catch (error) {
        console.error("Error deleting plant:", error);
      }
    }
  };

  // --- Modal Handlers for Plants ---
  const openPlantModal = (mode, plant = null) => {
    setPlantModalMode(mode);
    setCurrentPlant(plant);
    setPlantModalOpen(true);
  };

  const closePlantModal = () => {
    setPlantModalOpen(false);
    setCurrentPlant(null);
  };

  const handlePlantModalSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const plantData = {
      familyName: form.familyName.value.trim(),
      subFamilyName: form.subFamilyName.value.trim(),
      tribeName: form.tribeName.value.trim(),
      botanicalName: form.botanicalName.value.trim(),
      commonName: form.commonName.value.trim(),
      regionalName: form.regionalName.value.trim(),
      agriculturalExistence: form.agriculturalExistence.value.trim(),
      seasonExistence: form.seasonExistence.value.trim(),
      medicinalProperties: form.medicinalProperties.value.trim(),
      allergicProperties: form.allergicProperties.value.trim()
    };
    if (plantModalMode === 'add') {
      await handleAddPlantSubmit(plantData);
    } else {
      await handleEditPlantSubmit(plantData);
    }
    closePlantModal();
  };

  // --- Context Menu for Plants ---
  const handlePlantRowContextMenu = (e, plantId) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, plantId });
  };

  const handleHideContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  // --- Email Functions ---
  const handleSelectAllEmails = (checked) => {
    if (checked) {
      setSelectedEmails(emails.map(email => email._id));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleEmailCheckboxChange = (emailId, checked) => {
    if (checked) {
      setSelectedEmails(prev => [...prev, emailId]);
    } else {
      setSelectedEmails(prev => prev.filter(id => id !== emailId));
    }
  };

  const handleDeleteSelectedEmails = async () => {
    if (window.confirm("Are you sure you want to delete selected emails?")) {
      try {
        for (let id of selectedEmails) {
          await axios.delete(`/api/emails/${id}`, { withCredentials: true });
        }
        setSelectedEmails([]);
        fetchEmails();
      } catch (error) {
        console.error("Error deleting selected emails:", error);
      }
    }
  };

  const handleRespondEmail = (email) => {
    setCurrentEmail(email);
    setEmailModalOpen(true);
  };

  const handleEmailModalSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const reply = form.reply.value.trim();
    // In a real system, you might call an endpoint to send a reply.
    alert(`Reply sent to ${currentEmail.sender}: ${reply}`);
    // After replying, delete the email from the database.
    try {
      await axios.delete(`/api/emails/${currentEmail._id}`, { withCredentials: true });
      fetchEmails();
    } catch (error) {
      console.error("Error deleting email after response:", error);
    }
    setEmailModalOpen(false);
    setCurrentEmail(null);
  };

  // --- Filtered Data ---
  const filteredUsers = users.filter(user =>
    user.name && user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredPlants = plants.filter(plant => {
    const term = plantSearchTerm.toLowerCase();
    return (
      plant.familyName.toLowerCase().includes(term) ||
      plant.subFamilyName.toLowerCase().includes(term) ||
      plant.tribeName.toLowerCase().includes(term) ||
      plant.botanicalName.toLowerCase().includes(term) ||
      plant.commonName.toLowerCase().includes(term) ||
      plant.regionalName.toLowerCase().includes(term) ||
      plant.agriculturalExistence.toLowerCase().includes(term) ||
      plant.seasonExistence.toLowerCase().includes(term) ||
      plant.medicinalProperties.toLowerCase().includes(term) ||
      plant.allergicProperties.toLowerCase().includes(term)
    );
  });

  const filteredEmails = emails.filter(email =>
    (email.name && email.name.toLowerCase().includes(emailSearchTerm.toLowerCase())) ||
    email.sender.toLowerCase().includes(emailSearchTerm.toLowerCase()) ||
    (email.message && email.message.toLowerCase().includes(emailSearchTerm.toLowerCase()))
  );

  // --- Rendering Functions ---

  const renderDashboard = () => (
    <div className="tab-content dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <div className="date-time">
          {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
        </div>
      </div>
      <div className="stats-cards">
        <div className="card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="card">
          <h3>Total Plants</h3>
          <p>{plants.length}</p>
        </div>
        <div className="card">
          <h3>Emails Received</h3>
          <p>{emails.length}</p>
        </div>
        <div className="card">
          <h3>Blocked Users</h3>
          <p>{users.filter(u => u.blocked).length}</p>
        </div>
      </div>
      <div className="dashboard-charts">
        <h3>Activity Graph</h3>
        <div className="chart-placeholder">
          <p>[Graph/Chart Placeholder]</p>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="tab-content">
      <h2>User Management</h2>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search Users..." 
          value={userSearchTerm} 
          onChange={(e) => setUserSearchTerm(e.target.value)} 
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.blocked ? "Blocked" : "Active"}</td>
              <td>
                <button onClick={() => handleBlockUser(user.name)}>
                  {user.blocked ? "Unblock" : "Block"}
                </button>
                <button onClick={() => handleRemoveUser(user.name)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPlantManagement = () => (
    <div className="tab-content">
      <h2>Plant Management</h2>
      <div className="plant-controls">
        <input 
          type="text" 
          placeholder="Search Plants..." 
          value={plantSearchTerm} 
          onChange={(e) => setPlantSearchTerm(e.target.value)} 
        />
        <button onClick={() => openPlantModal('add')}>Add Plant</button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Family Name</th>
              <th>Sub-Family Name</th>
              <th>Tribe Name</th>
              <th>Botanical Name</th>
              <th>Common Name</th>
              <th>Regional Name</th>
              <th>Agricultural Existence</th>
              <th>Season Existence</th>
              <th>Medicinal Properties</th>
              <th>Allergic Properties</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlants.map((plant) => (
              <tr key={plant._id} onContextMenu={(e) => handlePlantRowContextMenu(e, plant._id)}>
                <td>{plant.familyName}</td>
                <td>{plant.subFamilyName}</td>
                <td>{plant.tribeName}</td>
                <td>{plant.botanicalName}</td>
                <td>{plant.commonName}</td>
                <td>{plant.regionalName}</td>
                <td>{plant.agriculturalExistence}</td>
                <td>{plant.seasonExistence}</td>
                <td>{plant.medicinalProperties}</td>
                <td>{plant.allergicProperties}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEmails = () => (
    <div className="tab-content">
      <h2>User Emails</h2>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search Emails..." 
          value={emailSearchTerm} 
          onChange={(e) => setEmailSearchTerm(e.target.value)} 
        />
      </div>
      {selectedEmails.length > 0 && (
        <button onClick={handleDeleteSelectedEmails}>Delete Selected</button>
      )}
      <table>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={filteredEmails.length > 0 && selectedEmails.length === filteredEmails.length}
                onChange={(e) => handleSelectAllEmails(e.target.checked)}
              />
            </th>
            <th>Name</th>
            <th>Sender</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmails.map((email) => (
            <tr key={email._id}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedEmails.includes(email._id)}
                  onChange={(e) => handleEmailCheckboxChange(email._id, e.target.checked)}
                />
              </td>
              <td>{email.name}</td>
              <td>{email.sender}</td>
              <td>{email.message}</td>
              <td>
                <button onClick={() => handleRespondEmail(email)}>
                  Respond
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-dashboard" onClick={handleHideContextMenu}>
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>{sidebarCollapsed ? "AP" : "Admin Panel"}</h2>
          <button
            className="collapse-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>
        <ul className="sidebar-menu">
          <li
            className={selectedTab === "dashboard" ? "active" : ""}
            onClick={() => setSelectedTab("dashboard")}
          >
            {sidebarCollapsed ? "D" : "Dashboard"}
          </li>
          <li
            className={selectedTab === "userManagement" ? "active" : ""}
            onClick={() => setSelectedTab("userManagement")}
          >
            {sidebarCollapsed ? "U" : "User Management"}
          </li>
          <li
            className={selectedTab === "plantManagement" ? "active" : ""}
            onClick={() => setSelectedTab("plantManagement")}
          >
            {sidebarCollapsed ? "P" : "Plant Management"}
          </li>
          <li
            className={selectedTab === "emails" ? "active" : ""}
            onClick={() => setSelectedTab("emails")}
          >
            {sidebarCollapsed ? "E" : "Emails"}
          </li>
          <li className="signout" onClick={handleSignOut}>
            {sidebarCollapsed ? "X" : "Sign Out"}
          </li>
        </ul>
      </aside>
      <main className="admin-main">
        {selectedTab === "dashboard" && renderDashboard()}
        {selectedTab === "userManagement" && renderUserManagement()}
        {selectedTab === "plantManagement" && renderPlantManagement()}
        {selectedTab === "emails" && renderEmails()}
      </main>

      {/* Context Menu for Plants */}
      {contextMenu.visible && (
        <div 
          className="context-menu" 
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={handleHideContextMenu}
        >
          <div 
            className="context-menu-item" 
            onClick={() => {
              handleDeletePlant(contextMenu.plantId);
              handleHideContextMenu();
            }}
          >
            Delete
          </div>
          <div 
            className="context-menu-item" 
            onClick={() => {
              const plantToEdit = plants.find(p => p._id === contextMenu.plantId);
              openPlantModal('edit', plantToEdit);
              handleHideContextMenu();
            }}
          >
            Edit
          </div>
        </div>
      )}

      {/* Modal for Add/Edit Plant */}
      {plantModalOpen && (
        <div className="modal-overlay" onClick={closePlantModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{plantModalMode === 'add' ? 'Add Plant' : 'Edit Plant'}</h3>
            <form onSubmit={handlePlantModalSubmit}>
              <div className="form-group">
                <label>Family Name:</label>
                <input type="text" name="familyName" defaultValue={currentPlant ? currentPlant.familyName : ''} required />
              </div>
              <div className="form-group">
                <label>Sub-Family Name:</label>
                <input type="text" name="subFamilyName" defaultValue={currentPlant ? currentPlant.subFamilyName : ''} required />
              </div>
              <div className="form-group">
                <label>Tribe Name:</label>
                <input type="text" name="tribeName" defaultValue={currentPlant ? currentPlant.tribeName : ''} required />
              </div>
              <div className="form-group">
                <label>Botanical Name:</label>
                <input type="text" name="botanicalName" defaultValue={currentPlant ? currentPlant.botanicalName : ''} required />
              </div>
              <div className="form-group">
                <label>Common Name:</label>
                <input type="text" name="commonName" defaultValue={currentPlant ? currentPlant.commonName : ''} required />
              </div>
              <div className="form-group">
                <label>Regional Name:</label>
                <input type="text" name="regionalName" defaultValue={currentPlant ? currentPlant.regionalName : ''} required />
              </div>
              <div className="form-group">
                <label>Agricultural Existence:</label>
                <input type="text" name="agriculturalExistence" defaultValue={currentPlant ? currentPlant.agriculturalExistence : ''} required />
              </div>
              <div className="form-group">
                <label>Season Existence:</label>
                <input type="text" name="seasonExistence" defaultValue={currentPlant ? currentPlant.seasonExistence : ''} required />
              </div>
              <div className="form-group">
                <label>Medicinal Properties:</label>
                <input type="text" name="medicinalProperties" defaultValue={currentPlant ? currentPlant.medicinalProperties : ''} required />
              </div>
              <div className="form-group">
                <label>Allergic Properties:</label>
                <input type="text" name="allergicProperties" defaultValue={currentPlant ? currentPlant.allergicProperties : ''} required />
              </div>
              <div className="modal-buttons">
                <button type="submit">{plantModalMode === 'add' ? 'Add' : 'Update'}</button>
                <button type="button" onClick={closePlantModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Email Response */}
      {emailModalOpen && currentEmail && (
        <div className="modal-overlay" onClick={() => setEmailModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Responding to {currentEmail.name}</h3>
            <form onSubmit={handleEmailModalSubmit}>
              <div className="form-group">
                <label>Send to:</label>
                <input type="text" name="to" readOnly defaultValue={currentEmail.sender} />
              </div>
              <div className="form-group">
                <label>Message:</label>
                <textarea name="message" readOnly defaultValue={currentEmail.message}></textarea>
              </div>
              <div className="form-group">
                <label>Reply:</label>
                <textarea name="reply" required></textarea>
              </div>
              <div className="modal-buttons">
                <button type="submit">Send</button>
                <button type="button" onClick={() => setEmailModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
