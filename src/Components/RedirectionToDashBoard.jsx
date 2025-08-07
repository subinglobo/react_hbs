export const redirectToDashboard = (role, navigate) => {

     console.log("roles::" , role);
  const dashboards = {
    "ADMIN": "/adminDashboard",
    "AGENT": "/agentDashboard",
    // "User": "/user-dashboard",
    // Add more roles as needed
  };

  const dashboardPath = dashboards[role] || "/landingPage";
  navigate(dashboardPath);
};