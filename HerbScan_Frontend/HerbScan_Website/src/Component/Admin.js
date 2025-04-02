// ./Component/Admin.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [plants, setPlants] = useState([]);
  const [emails, setEmails] = useState([]);

  // Search states for each tab
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [emailSearchTerm, setEmailSearchTerm] = useState('');
  const [plantSearchTerm, setPlantSearchTerm] = useState('');

  // Modal state for plant management
  const [plantModalOpen, setPlantModalOpen] = useState(false);
  const [plantModalMode, setPlantModalMode] = useState('add'); // 'add' or 'edit'
  const [currentPlant, setCurrentPlant] = useState(null);

  // Context menu state for plants (on right-click)
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

  // Dummy data setup for Users, Plants, and Emails
  useEffect(() => {
    setUsers([
      { id: 1, username: "user1", blocked: false },
      { id: 2, username: "user2", blocked: false },
    ]);
    setPlants([
      { 
        id: 1, 
        familyName: "Rosaceae", 
        subFamilyName: "Rosoideae", 
        tribeName: "Roseae", 
        botanicalName: "Rosa", 
        commonName: "Rose", 
        regionalName: "Gulab", 
        agriculturalExistence: "Yes", 
        seasonExistence: "Summer", 
        medicinalProperties: "Anti-inflammatory", 
        allergicProperties: "None" 
      },
      { 
        id: 2, 
        familyName: "Liliaceae", 
        subFamilyName: "Lilioideae", 
        tribeName: "Tulipeae", 
        botanicalName: "Tulipa", 
        commonName: "Tulip", 
        regionalName: "Tulipa", 
        agriculturalExistence: "Yes", 
        seasonExistence: "Spring", 
        medicinalProperties: "None", 
        allergicProperties: "Mild" 
      },
    ]);
    setEmails([
      {
        id: 1,
        sender: "user1@example.com",
        subject: "Issue with image upload",
        content: "I encountered an error while uploading my image.",
      },
    ]);
  }, []);

  // Logout handler
  const handleSignOut = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // --- User Management Functions ---
  const handleBlockUser = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, blocked: !user.blocked } : user
      )
    );
  };

  const handleRemoveUser = (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // --- Plant Management Functions ---
  const handleAddPlantSubmit = (plantData) => {
    const newId = plants.length ? Math.max(...plants.map(p => p.id)) + 1 : 1;
    const newPlant = { id: newId, ...plantData };
    setPlants([...plants, newPlant]);
  };

  const handleEditPlantSubmit = (plantData) => {
    setPlants(plants.map(p => p.id === plantData.id ? plantData : p));
  };

  const handleDeletePlant = (id) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      setPlants(plants.filter(p => p.id !== id));
    }
  };

  // --- Modal Handlers ---
  const openPlantModal = (mode, plant = null) => {
    setPlantModalMode(mode);
    setCurrentPlant(plant);
    setPlantModalOpen(true);
  };

  const closePlantModal = () => {
    setPlantModalOpen(false);
    setCurrentPlant(null);
  };

  const handlePlantModalSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const plantData = {
      id: currentPlant ? currentPlant.id : null,
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
      handleAddPlantSubmit(plantData);
    } else {
      handleEditPlantSubmit(plantData);
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

  // --- Email Response Handler ---
  const handleRespondEmail = (id) => {
    alert(`Responding to email with ID: ${id}`);
  };

  // --- Filtered Data ---
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredEmails = emails.filter(email =>
    email.sender.toLowerCase().includes(emailSearchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(emailSearchTerm.toLowerCase())
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
            <th>Username</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.blocked ? "Blocked" : "Active"}</td>
              <td>
                <button onClick={() => handleBlockUser(user.id)}>
                  {user.blocked ? "Unblock" : "Block"}
                </button>
                <button onClick={() => handleRemoveUser(user.id)}>Remove</button>
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
              <tr key={plant.id} onContextMenu={(e) => handlePlantRowContextMenu(e, plant.id)}>
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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Subject</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmails.map((email) => (
            <tr key={email.id}>
              <td>{email.id}</td>
              <td>{email.sender}</td>
              <td>{email.subject}</td>
              <td>
                <button onClick={() => handleRespondEmail(email.id)}>
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
          <li
            className="signout"
            onClick={() => {
              localStorage.clear();
              navigate("/login", { replace: true });
            }}
          >
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
              const plantToEdit = plants.find(p => p.id === contextMenu.plantId);
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
    </div>
  );
};

export default Admin;
