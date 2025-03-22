// ./Component/Admin.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("dashboard");

  // Protect admin route by ensuring the logged-in user is an admin.
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

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
  const renderDashboard = () => (
    <div className="tab-content">
      <h2>Welcome, Admin!</h2>
      <p>Manage platform details using the options in the sidebar.</p>
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
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <ul className="sidebar-menu">
          <li
            className={selectedTab === "dashboard" ? "active" : ""}
            onClick={() => setSelectedTab("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={selectedTab === "userManagement" ? "active" : ""}
            onClick={() => setSelectedTab("userManagement")}
          >
            User Management
          </li>
          <li
            className={selectedTab === "plantManagement" ? "active" : ""}
            onClick={() => setSelectedTab("plantManagement")}
          >
            Plant Management
          </li>
          <li
            className={selectedTab === "emails" ? "active" : ""}
            onClick={() => setSelectedTab("emails")}
          >
            Emails
          </li>
          <li
            className="signout"
            onClick={() => {
              localStorage.clear();
              navigate("/login", { replace: true });
            }}
          >
            Sign Out
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
