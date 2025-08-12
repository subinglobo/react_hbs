
import React, { useState } from 'react';
import { Nav, Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Sidebar(){
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const items = [
    ['Dashboard', '/'],
    ['Bookings', '/bookings'],
    ['Hotels', '/hotels'],
    ['Agents', '/agents'],
    ['Inventory', '/inventory'],
    ['Promotions', '/promotions'],
    ['API Clients', '/api-clients'],
    ['Settings', '/settings'],
  ];

  return (
    <>
      {/* Hamburger for small screens */}
      <Button variant="link" className="hamburger d-lg-none" onClick={handleShow}>
        ☰
      </Button>

      {/* Sidebar for large screens */}
      <aside className="sidebar d-none d-lg-block">
        <div className="brand">Globosoft</div>
        <Nav className="flex-column">
          {items.map(([label, to])=>(
            <Nav.Item key={label} className="nav-item-custom">
              <Nav.Link as={Link} to={to} className="d-flex align-items-center">
                <span className="me-2">{getIcon(label)}</span>
                <span>{label}</span>
              </Nav.Link>
            </Nav.Item>
          ))}
          <Nav.Item className="mt-auto">
            <Nav.Link className="d-flex align-items-center logout">
              <span className="me-2">🚪</span><span>Logout</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </aside>

      {/* Offcanvas for small screens */}
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Globosoft</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {items.map(([label, to])=>(
              <Nav.Item key={label}>
                <Nav.Link as={Link} to={to} onClick={handleClose}>
                  <span className="me-2">{getIcon(label)}</span>{label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function getIcon(label){
  switch(label){
    case 'Dashboard': return '🏠';
    case 'Bookings': return '📦';
    case 'Hotels': return '🏨';
    case 'Agents': return '👥';
    case 'Inventory': return '📊';
    case 'Promotions': return '🏷️';
    case 'API Clients': return '☁️';
    case 'Settings': return '⚙️';
    default: return '•';
  }
}
