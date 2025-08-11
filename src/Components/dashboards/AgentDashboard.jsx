import React, { useState } from "react";
import Menu from "../menu/Menu";
import { Line  , Bar} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import CustomNavbar from "../CustomNavbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);



function AgentDashboard() {

    // Chart data for "Bookings Over Time"
  const bookingsData = {
    labels: ["Aug 1", "Aug 2", "Aug 3", "Aug 4", "Aug 5"],
    datasets: [
      {
        label: "Bookings",
        data: [22, 35, 50, 40, 65],
        borderColor: "#6366F1",
        backgroundColor: "transparent",
        tension: 0.4,
      },
    ],
  };

  // Chart data for "Revenue Trends"
  const revenueData = {
    labels: ["Aug 1", "Aug 2", "Aug 3", "Aug 4", "Aug 5"],
    datasets: [
      {
        label: "Revenue",
        data: [3000, 4800, 5500, 3900, 6800],
        backgroundColor: "#10B981",
      },
    ],
  };

  return (
   <div className="dashboard-layout">
      {/* Top Navbar */}
      <CustomNavbar />

      {/* Sidebar + Content */}
      <div className="dashboard-body">
        <Menu />
        <main className="main-content p-4">
          {/* Top header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Dashboard</h2>
            <div>
              <button className="btn btn-primary me-2">Add New Hotel</button>
              <button className="btn btn-success">Add New Agent</button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            {[
              ["Total Bookings", "1,245"],
              ["Today's Bookings", "85"],
              ["Total Revenue", "$58,300"],
              ["Active Agents", "112"],
              ["Hotels Listed", "342"],
              ["API Bookings", "413"],
            ].map(([label, value], idx) => (
              <div key={idx} className="col-md-4 col-lg-2">
                <div className="stat-card">
                  <p className="label">{label}</p>
                  <h4>{value}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="chart-card">
                <h5>Bookings Over Time</h5>
                <Line data={bookingsData} />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="chart-card">
                <h5>Revenue Trends</h5>
                <Bar data={revenueData} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AgentDashboard;
