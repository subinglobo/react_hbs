import React from 'react'
import CustomisedNavbar from '../CustomisedNavbar';
import Sidebar from '../Sidebar';



const AdminDashboard = () => {
  return (
    <div>
      <Sidebar />
      <CustomisedNavbar />
      <h1 style={{textAlign : 'center'}}>Welcome Admin</h1>
    </div>
  )
}

export default AdminDashboard;