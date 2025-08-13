import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import Register from "./pages/Register";
import State from "./pages/master/State";
import Country from "./pages/master/Country";
import Destination from "./pages/master/Destination";
import Hotels from "./pages/master/Hotels";
import PrivateRoute from "./components/PrivateRoute";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import Test from "./pages/Test";
import LandingPage from "./pages/LandingPage";
import { Toaster } from "react-hot-toast";
import Designations from "./pages/master/Designation";
import HotelSearch from "./pages/HotelSearch";
import HotelbookingList from "./pages/list/HotelbookingList";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/select-userRole" element={<SelectRole />} />
        <Route path="/register" element={<Register />} />
        <Route path="/agentDashboard" element={<AgentDashboard />} />
        {/* Protected Routes */}
        <Route
          path="/states"
          element={
            <PrivateRoute>
              <>
                <State />
                <Country />
                <Destination />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/hotels"
          element={
            <PrivateRoute>
              <>
                <Hotels />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/adminDashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/agentDashboard"
          element={
            <PrivateRoute>
              <AgentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking-details/hotel-booking-list"
          element={
            <PrivateRoute>
              <HotelbookingList />
            </PrivateRoute>
          }
        />
        <Route
          path="/staffDashboard"
          element={
            <PrivateRoute>
              <StaffDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/landingPage"
          element={
            <PrivateRoute>
              <LandingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/test"
          element={
            <PrivateRoute>
              <Test />
            </PrivateRoute>
          }
        />
        <Route path="/masters/designations" element={<Designations />} />
        <Route path="/new-booking/hotel" element={<HotelSearch />} />
        <Route path="/masters/destination" element={<Destination />} />
      </Routes>

      {/* Toast container */}
      <Toaster
        // position="top-center"
        containerStyle={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: "#4bb543",
              secondary: "#fff",
            },
          },
          error: {
            duration: 6000,
            iconTheme: {
              primary: "#ff3333",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}
