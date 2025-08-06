import React from 'react';
import { Link } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function Header({ title = 'Login Form', user, children }) {
  return (
    <div>
      {/* <h1 className="text-center my-3">{title}</h1>
      {user && <p className="text-center">Welcome, {user}</p>} */}
    
      {children}
    </div>
  );
}

export default Header;