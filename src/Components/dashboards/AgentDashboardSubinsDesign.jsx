import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import '../css/AgentDashboardSubins.css';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const bookingsChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const [expandedDropdown, setExpandedDropdown] = useState(null);

  // Log component renders
  useEffect(() => {
    console.log('AgentDashboard rendered');
  });

  // Log state changes
  useEffect(() => {
    console.log('expandedDropdown updated:', expandedDropdown);
  }, [expandedDropdown]);

  // Toggle dropdown
  const toggleDropdown = (label) => {
    console.log('toggle dropdown click');
    console.log('label:', label);
    console.log('current expandedDropdown:', expandedDropdown);
    setExpandedDropdown(expandedDropdown === label ? null : label);
  };

  // Initialize charts
  useEffect(() => {
    const bookingsCtx = document.getElementById('bookingsChart');
    if (bookingsCtx) {
      if (bookingsChartRef.current) bookingsChartRef.current.destroy();
      bookingsChartRef.current = new Chart(bookingsCtx, {
        type: 'line',
        data: {
          labels: ['Aug 1', 'Aug 2', 'Aug 3', 'Aug 4', 'Aug 5'],
          datasets: [{
            label: 'Bookings',
            data: [20, 35, 50, 40, 65],
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } }
        }
      });
    }

    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
      if (revenueChartRef.current) revenueChartRef.current.destroy();
      revenueChartRef.current = new Chart(revenueCtx, {
        type: 'bar',
        data: {
          labels: ['Aug 1', 'Aug 2', 'Aug 3', 'Aug 4', 'Aug 5'],
          datasets: [{
            label: 'Revenue',
            data: [3000, 4800, 5500, 4000, 6800],
            backgroundColor: '#28a745'
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } }
        }
      });
    }

    return () => {
      if (bookingsChartRef.current) bookingsChartRef.current.destroy();
      if (revenueChartRef.current) revenueChartRef.current.destroy();
    };
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <div className="d-flex min-vh-100">
        {/* Sidebar */}
        <aside className="w-25 bg-white shadow p-4">
          <div className="h3 fw-bold text-center">Hotel Booking System</div>
          <nav className="nav flex-column">
            {[
              { id: 'dashboard', icon: '📊', label: 'Dashboard', path: '/agentDashboard' },
              {
                id: 'manage-master',
                icon: '🏠',
                label: 'Manage Master',
                dropdown: [
                  { icon: '🛏️', label: 'Room Types', path: '/masters/room-types' },
                  { icon: '🛁', label: 'Amenities', path: '/masters/amenities' },
                  { icon: '📍', label: 'Locations', path: '/masters/locations' },
                  { icon: '💰', label: 'Taxes', path: '/masters/taxes' },
                  { icon: '💳', label: 'Payment Methods', path: '/masters/payment-methods' }
                ]
              },
              { id: 'bookings', icon: '📦', label: 'Bookings', path: '/bookings' },
              { id: 'hotels', icon: '🏨', label: 'Hotels', path: '/hotels' },
              { id: 'agents', icon: '👥', label: 'Agents', path: '/agents' },
              { id: 'inventory', icon: '📊', label: 'Inventory', path: '/inventory' },
              { id: 'promotions', icon: '🏷️', label: 'Promotions', path: '/promotions' },
              { id: 'api-clients', icon: '☁️', label: 'API Clients', path: '/api-clients' },
              { id: 'settings', icon: '⚙️', label: 'Settings', path: '/settings' },
            ].map((item) => (
              <div key={item.id}>
                <div
                  className="d-flex align-items-center p-2 rounded hover-bg-light cursor-pointer"
                  onClick={() => {
                    console.log('Clicked item:', item.label);
                    if (item.dropdown) {
                      toggleDropdown(item.label);
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  <span className="me-2">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.dropdown && (
                    <span className="ms-auto">
                      {expandedDropdown === item.label ? '▲' : '▼'}
                    </span>
                  )}
                </div>
                {item.dropdown && (
                  <div>
                    {console.log('Checking dropdown for', item.label, 'expanded:', expandedDropdown, 'match:', expandedDropdown === item.label)}
                    {expandedDropdown === item.label && (
                      <div className="dropdown-items ps-4" style={{ display: 'block', paddingLeft: '1.5rem', backgroundColor: '#f0f0f0' }}>
                        {item.dropdown.map((subItem) => {
                          console.log('subItem:', subItem);
                          return (
                            <div
                              key={subItem.label}
                              className="d-flex align-items-center p-2 rounded hover-bg-light cursor-pointer"
                              style={{ backgroundColor: '#e0e0e0' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Navigating to:', subItem.path);
                                navigate(subItem.path);
                              }}
                            >
                              <span className="me-2">{subItem.icon}</span>
                              <span>{subItem.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div
              className="d-flex align-items-center p-2 rounded hover-bg-light cursor-pointer"
              onClick={() => {
                localStorage.removeItem('authToken');
                navigate('/login');
              }}
            >
              <span className="me-2">🚪</span>
              <span>Logout</span>
            </div>
          </nav>
        </aside>

        {/* Main Dashboard */}
        <main className="flex-grow-1 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 fw-semibold">Dashboard</h1>
            <div>
              <button
                className="btn btn-primary me-2"
                onClick={() => navigate('/hotels/add')}
              >
                Add New Hotel
              </button>
              <button
                className="btn btn-success"
                onClick={() => navigate('/agents/add')}
              >
                Add New Agent
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {[
              { label: 'Total Bookings', value: '1,245', metric: 'total-bookings' },
              { label: "Today's Bookings", value: '85', metric: 'todays-bookings' },
              { label: 'Total Revenue', value: '$58,300', metric: 'total-revenue' },
              { label: 'Active Agents', value: '112', metric: 'active-agents' },
              { label: 'Hotels Listed', value: '342', metric: 'hotels-listed' },
              { label: 'API Bookings', value: '413', metric: 'api-bookings' },
            ].map((kpi) => (
              <div
                key={kpi.metric}
                className="col"
                onClick={() => navigate(`/reports/${kpi.metric.toLowerCase().replace(/\s+/g, '-')}`)}
              >
                <div className="card shadow-sm p-3 hover-shadow cursor-pointer">
                  <p className="text-muted">{kpi.label}</p>
                  <p className="h4 fw-bold">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="row row-cols-1 row-cols-lg-2 g-4 mt-4">
            <div className="col">
              <div
                className="card shadow-sm p-3 hover-shadow cursor-pointer"
                onClick={() => navigate('/reports/bookings')}
              >
                <h2 className="h5 fw-semibold mb-3">Bookings Over Time</h2>
                <canvas id="bookingsChart"></canvas>
              </div>
            </div>
            <div className="col">
              <div
                className="card shadow-sm p-3 hover-shadow cursor-pointer"
                onClick={() => navigate('/reports/revenue')}
              >
                <h2 className="h5 fw-semibold mb-3">Revenue Trends</h2>
                <canvas id="revenueChart"></canvas>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgentDashboard;