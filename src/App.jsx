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

function App() {
  return (
    <div className="App">
       <Header title="Booking App" user="Admin">
          {/* <NavigationBar /> */}
        </Header>
      <Router>
       
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/states"
            element={
              <>
                {/* <State /> */}
                <CountryApi />
              {/* <Destination /> */}
              </>
            }
          />
          <Route path="/register" element={<Register />} />
           <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
