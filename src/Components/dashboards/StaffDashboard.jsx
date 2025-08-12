// import React, { useEffect } from 'react';
// import { Chart } from 'chart.js/auto';

// const StaffDashboard = () => {
//   useEffect(() => {
//     // Initialize charts
//     const bookingsCtx = document.getElementById('bookingsChart');
//     const revenueCtx = document.getElementById('revenueChart');
    
//     if (bookingsCtx && revenueCtx) {
//       new Chart(bookingsCtx, {
//         type: 'line',
//         data: {
//           labels: ['Aug 1', 'Aug 2', 'Aug 3', 'Aug 4', 'Aug 5'],
//           datasets: [{
//             label: 'Bookings',
//             data: [20, 35, 50, 40, 65],
//             borderColor: '#6366f1',
//             backgroundColor: 'rgba(99, 102, 241, 0.1)',
//             tension: 0.3
//           }]
//         },
//         options: { responsive: true, plugins: { legend: { display: false } } }
//       });

//       new Chart(revenueCtx, {
//         type: 'bar',
//         data: {
//           labels: ['Aug 1', 'Aug 2', 'Aug 3', 'Aug 4', 'Aug 5'],
//           datasets: [{
//             label: 'Revenue',
//             data: [3000, 4800, 5500, 4000, 6800],
//             backgroundColor: '#10b981'
//           }]
//         },
//         options: { responsive: true, plugins: { legend: { display: false } } }
//       });
//     }
//   }, []);

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <div className="flex">
//         {/* Sidebar */}
//         <aside className="w-64 bg-white shadow-xl p-4 space-y-6 fixed h-full">
//           <div className="text-2xl font-bold text-center">HotelSys</div>
//           <nav className="space-y-3">
//             {['Dashboard', 'Bookings', 'Hotels', 'Agents', 'Inventory', 'Promotions', 'API Clients', 'Settings', 'Logout']
//               .map((item, index) => (
//                 <div key={index} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-200 cursor-pointer">
//                   <span>{['🏠', '📦', '🏨', '👥', '📊', '🏷️', '☁️', '⚙️', '🚪'][index]}</span>
//                   <span>{item}</span>
//                 </div>
//               ))}
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 ml-64 p-6 space-y-6">
//           <div className="flex justify-between items-center">
//             <h1 className="text-3xl font-semibold">Dashboard</h1>
//             <div className="space-x-2">
//               <button className="px-4 py-2 bg-indigo-500 text-white rounded-xl">Add New Hotel</button>
//               <button className="px-4 py-2 bg-green-500 text-white rounded-xl">Add New Agent</button>
//             </div>
//           </div>

//           {/* KPI Cards Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[
//               { title: 'Total Bookings', value: '1,245' },
//               { title: "Today's Bookings", value: '85' },
//               { title: 'Total Revenue', value: '$58,300' },
//               { title: 'Active Agents', value: '112' },
//               { title: 'Hotels Listed', value: '342' },
//               { title: 'API Bookings', value: '413' }
//             ].map((card, index) => (
//               <div key={index} className="bg-white rounded-xl shadow p-6">
//                 <p className="text-gray-500">{card.title}</p>
//                 <p className="text-2xl font-bold">{card.value}</p>
//               </div>
//             ))}
//           </div>

//           {/* Charts */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="bg-white rounded-xl shadow p-6">
//               <h2 className="text-lg font-semibold mb-4">Bookings Over Time</h2>
//               <canvas id="bookingsChart" height="300"></canvas>
//             </div>
//             <div className="bg-white rounded-xl shadow p-6">
//               <h2 className="text-lg font-semibold mb-4">Revenue Trends</h2>
//               <canvas id="revenueChart" height="300"></canvas>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default StaffDashboard;

import React from 'react';

const StaffDashboard = () => {
  return (
    <div className="font-sans bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Agent</h1>
            <h2 className="text-lg text-gray-600">Member</h2>
          </div>
          <div className="text-right">
            <p className="font-medium">Company Name</p>
            <p className="text-blue-600">Journey Mentor</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-lg shadow-sm mr-6 p-4">
          <nav>
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">[Workbench]</h3>
              <ul className="space-y-1">
                <li className="pl-4 py-1 hover:bg-gray-100 rounded">Add New Booking</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">[Manage Bookings]</h3>
              <ul className="space-y-1">
                <li className="pl-4 py-1 hover:bg-gray-100 rounded">Setup Functions</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">[Manage Sub-Agency]</h3>
              <ul className="space-y-1">
                <li className="pl-4 py-1 hover:bg-gray-100 rounded">Manage Users</li>
                <li className="pl-4 py-1 hover:bg-gray-100 rounded">Manage Events</li>
                <li className="pl-4 py-1 hover:bg-gray-100 rounded">Business Rules</li>
                <li className="pl-4 py-1 hover:bg-gray-100 rounded">Alert Rules</li>
                <li className="pl-4 py-1 hover:bg-gray-100 rounded">Budgets</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">[Financial Functions]</h3>
              <ul className="space-y-1">
                <li className="pl-4 py-1 hover:bg-gray-100 rounded">Manage Performance</li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Sub-Agency</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add Sub-Agency
              </button>
            </div>

            {/* Agency Info */}
            <div className="mb-6">
              <table className="w-full mb-4">
                <tbody>
                  <tr>
                    <td className="font-medium py-2 w-1/4">Company Name</td>
                    <td className="py-2">Journey Mentor</td>
                  </tr>
                  <tr>
                    <td className="font-medium py-2">Agency type</td>
                    <td className="py-2">Select agency type</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search everything"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Agency Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border-b">Agency Name</th>
                    <th className="p-3 text-left border-b">Agency Type</th>
                    <th className="p-3 text-left border-b">Start Date</th>
                    <th className="p-3 text-left border-b">Phone</th>
                    <th className="p-3 text-left border-b">Email</th>
                    <th className="p-3 text-left border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">[Journey Mentor] Travel Agency</td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">ABC Travel</td>
                    <td className="p-3">Travel Agency</td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">Smithfield Travel</td>
                    <td className="p-3">Travel Agency</td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">Testing Sub Agency</td>
                    <td className="p-3">Travel Agency</td>
                    <td className="p-3">30/06/2025</td>
                    <td className="p-3">+961 28738382</td>
                    <td className="p-3">kar@g.com</td>
                    <td className="p-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <footer className="mt-8 text-center text-sm text-gray-500">
              Powered by Agent Mentor © Copyright Journey Mentor 2024
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;