import React, { useState } from "react";

import Menu from "../menu/Menu";





function AgentDashboard() {

  return (
    <div className="dashboard d-flex">

        <Menu />
            <main className="main-content flex-grow-1 p-4">
         <h1>Agent Dashboard</h1>
        <p>Select a menu option to view details.</p>
       </main>

    </div>
    
  );
}

export default AgentDashboard;
