import React from 'react'

const DashboardRedirections = (role, navigate) => {

  console.log("roles::" , role);
  const dashboards = {
    "ADMIN": "/adminDashboard",
    "AGENT": "/agentDashboard",
    "STAFF": "/staffDashboard",
    // Add more roles as needed
  };

  const dashboardPath = dashboards[role] || "/landingPage";
  navigate(dashboardPath);
  return (
    <div></div>
  )
}

export default DashboardRedirections;