import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import State from "./Components/master/State";
import Header from "./Components/Header";
import Register from "./Components/Register";
import Destination from "./Components/master/Destination";
import AdminDashboard from "./Components/dashboards/AdminDashboard";
import CountryApi from "./Components/master/Country";
import Test from "./Components/Test";
import PrivateRoute from "./Components/PrivateRoute"; // Import PrivateRoute
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <Header title="Booking App" user="Admin">
        {/* <NavigationBar /> */}
      </Header>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/states"
            element={
              <PrivateRoute>
                <>
                  <State />
                  <CountryApi />
                  <Destination />
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
            path="/test"
            element={
              <PrivateRoute>
                <Test />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;
