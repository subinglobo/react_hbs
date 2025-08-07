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
import { Toaster } from 'react-hot-toast';
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
     {/* Toast container */}
      <Toaster
        // position="top-center"
         containerStyle={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: '#4bb543',
              secondary: '#fff',
            },
          },
          error: {
            duration: 6000,
            iconTheme: {
              primary: '#ff3333',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
