import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/CustomNavbar.css";

const CustomNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login"); // Redirect to login page after logout
  };

  return (
   <Navbar fixed="top" bg="light" expand="lg" className="shadow-sm">
  <Container fluid>
    <Navbar.Brand href="/">
      <img
        src={`${process.env.PUBLIC_URL}/images/logo-1.jpg`}
        alt="Logo"
        height="32"
        className="d-inline-block align-top"
      />
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
      <Button variant="outline-danger" onClick={handleLogout}>
        Logout
      </Button>
    </Navbar.Collapse>
  </Container>
</Navbar>
  );
};

export default CustomNavbar;