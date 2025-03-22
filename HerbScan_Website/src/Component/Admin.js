// ./Component/Admin.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Protect admin route by ensuring the logged-in user is an admin.
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dummy data for demonstration.
  const [users, setUsers] = useState([
    { id: 1, username: "user1", blocked: false },
    { id: 2, username: "user2", blocked: false },
  ]);

  const [plants, setPlants] = useState([
    { id: 1, name: "Rose", botanicalName: "Rosa", family: "Rosaceae" },
    { id: 2, name: "Tulip", botanicalName: "Tulipa", family: "Liliaceae" },
  ]);

  const [emails] = useState([
    {
      id: 1,
      sender: "user1@example.com",
      subject: "Issue with image upload",
      content: "I encountered an error while uploading my image.",
    },
  ]);

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
  const handleAddPlant = (e) => {
    e.preventDefault();
    const { plantName, botanicalName, family } = e.target.elements;
    const newPlant = {
      id: plants.length + 1,
      name: plantName.value.trim(),
      botanicalName: botanicalName.value.trim(),
      family: family.value.trim(),
    };
    setPlants([...plants, newPlant]);
    e.target.reset();
  };

  const handleRemovePlant = (id) => {
    if (window.confirm("Are you sure you want to remove this plant?")) {
      setPlants(plants.filter((plant) => plant.id !== id));
    }
  };

  // --- Email Response Handler ---
  const handleRespondEmail = (id) => {
    // For now, simply alert. Later, you might open a modal or call an API.
    alert(`Responding to email with ID: ${id}`);
  };

  // --- Rendering Functions ---

  // Dashboard now displays statistics, a live clock and a placeholder chart.
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
          {/* Replace this placeholder with an actual chart component later */}
          <p>[Graph/Chart Placeholder]</p>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="tab-content">
      <h2>User Management</h2>
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
          {users.map((user) => (
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
      <form onSubmit={handleAddPlant} className="plant-form">
        <div className="form-group">
          <label>Plant Name:</label>
          <input type="text" name="plantName" required />
        </div>
        <div className="form-group">
          <label>Botanical Name:</label>
          <input type="text" name="botanicalName" required />
        </div>
        <div className="form-group">
          <label>Family:</label>
          <input type="text" name="family" required />
        </div>
        <button type="submit">Add Plant</button>
      </form>
      <h3>Existing Plants</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Plant Name</th>
            <th>Botanical Name</th>
            <th>Family</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plants.map((plant) => (
            <tr key={plant.id}>
              <td>{plant.id}</td>
              <td>{plant.name}</td>
              <td>{plant.botanicalName}</td>
              <td>{plant.family}</td>
              <td>
                <button onClick={() => handleRemovePlant(plant.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEmails = () => (
    <div className="tab-content">
      <h2>User Emails</h2>
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
          {emails.map((email) => (
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
    <div className="admin-dashboard">
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
    </div>
  );
};

export default Admin;
