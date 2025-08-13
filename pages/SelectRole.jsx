import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SelectRole.css";
import DashboardRedirections from "../components/DashboardRedirections";

const SelectRole = () => {
  console.log("SelectRole component rendered");
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log("Location state:", state);

  const roles = state?.roles || [];

  // Redirect to login if no state or roles
  if (!state || !state.roles || state.roles.length === 0) {
    console.log("No roles provided, redirecting to /login");
    navigate("/login");
    return null;
  }

  // Map roles to icons and descriptions
  const roleData = roles.map((role) => {
    let icon, description;
    switch (role.toLowerCase()) {
      case "admin":
        icon = "fas fa-user-shield";
        description = "Full system access with all privileges";
        break;
      case "agent":
        icon = "fas fa-user-tie";
        description = "Manage bookings and customer interactions";
        break;
      default:
        icon = "fas fa-user";
        description = "Custom role with specific permissions";
        break;
    }
    return { name: role, icon, description };
  });

  const handleRoleSelection = (role) => {
    console.log("Selected role:", role);
    DashboardRedirections(role, navigate);
    localStorage.setItem("currentActiveRole" , role);
  };

  return (
    <div className="select-role-page">
      <div className="role-container">
      
      <h1>Select Your Role</h1>
      <div className="role-grid">
        {roleData.map((role, index) => (
          <div
            className="role-card"
            key={index}
            onClick={() => handleRoleSelection(role.name)}
          >
            <div className="role-icon">
              <i className={role.icon}></i>
            </div>
            <h3 className="role-title">{role.name}</h3>
            <p className="role-desc">{role.description}</p>
          </div>
        ))}
      </div>
      {/* <div className="instructions">
        <h3>Instructions to Customize This Template</h3>
        <p>All elements are fully editable - change colors, sizes, and content as needed</p>
        <div className="edit-features">
          <div className="feature">Change icon colors</div>
          <div className="feature">Resize cards</div>
          <div className="feature">Add more roles</div>
          <div className="feature">Edit text</div>
          <div className="feature">Customize hover effects</div>
        </div>
      </div> */}
      </div>
    </div>
  );
};

export default SelectRole;