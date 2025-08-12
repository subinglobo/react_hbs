
import React, { useState } from 'react';
import { Nav, Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Sidebar(){
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (groupKey) => {
    setOpenGroups((prev)=> ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const items = [
    { label: 'Dashboard', to: '/' },
    {
      label: 'Manage Masters',
      to: '/manage-masters',
      groups: [
        {
          label: 'Basic settings',
          children: [
            { label: 'Designation', to: '/masters/designations' },
            { label: 'Bank', to: '/masters/bank' },
            { label: 'Assign Menu', to: '/masters/assign-menu' },
          ],
        },
        {
          label: 'Location settings',
          children: [
            { label: 'Countries', to: '/masters/countries' },
            { label: 'Cities', to: '/masters/cities' },
            { label: 'Areas', to: '/masters/areas' },
          ],
        },
        {
          label: 'Hotel settings',
          children: [
            { label: 'Room Types', to: '/masters/room-types' },
            { label: 'Amenities', to: '/masters/amenities' },
            { label: 'Meal Plans', to: '/masters/meal-plans' },
          ],
        },
      ],
    },
    { label: 'Company Profile', to: '/company-profile', children: ['Overview', 'Teams', 'Settings'] },
    { label: 'Registration', to: '/registration', children: ['New Agent', 'New Hotel', 'New Client'] },
    { label: 'New Booking', to: '/new-booking', children: ['Accommodation', 'Transfer', 'Tours'] },
    { label: 'Bookings', to: '/bookings', children: ['All', 'Pending', 'Cancelled'] },
    { label: 'Invoice', to: '/invoice', children: ['Create', 'List', 'Reports'] },
    { label: 'Inhouse Accounts', to: '/inhouse-accounts', children: ['Ledger', 'Payments', 'Reconciliation'] },
    { label: 'Assigned Agents', to: '/assigned-agents', children: ['All Agents', 'Teams', 'Regions'] },
    { label: 'Calender', to: '/calender', children: ['Month', 'Week', 'Day'] },
    { label: 'Extranet Contract', to: '/extranet-contract', children: ['Hotels', 'Rates', 'Allotments'] },
    { label: 'Report', to: '/report', children: ['Sales', 'Bookings', 'Revenue'] },
    { label: 'Offer', to: '/offer', children: ['Create', 'Active', 'Archived'] },
    { label: 'Upload Offer Image', to: '/upload-offer-image', children: ['Upload', 'Library'] },
  ];

  return (
    <>
      {/* Hamburger for small screens */}
      <Button variant="link" className="hamburger d-lg-none" onClick={handleShow}>
        ☰
      </Button>

      {/* Sidebar for large screens */}
      <aside className="sidebar d-none d-lg-block">
        <Nav className="flex-column">
          {items.map((item)=>{
            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
            const hasGroups = Array.isArray(item.groups) && item.groups.length > 0;
            return (
              <Nav.Item
                key={item.label}
                className={`nav-item-custom ${(hasChildren || hasGroups) ? 'nav-item-has-children' : ''}`}
              >
                <Nav.Link as={Link} to={item.to} className="d-flex align-items-center justify-content-between">
                  <span className="d-flex align-items-center">
                    <span className="me-2">{getIcon(item.label)}</span>
                    <span>{item.label}</span>
                  </span>
                  {(hasChildren || hasGroups) && <span className="caret">▾</span>}
                </Nav.Link>
                {(hasChildren || hasGroups) && (
                  <div className="submenu">
                    {hasChildren && item.children.map((child)=> (
                      <Nav.Link as={Link} to={item.to} key={`${item.label}-${child}`} className="submenu-link">
                        {child}
                      </Nav.Link>
                    ))}
                    {hasGroups && item.groups.map((group)=> {
                      const groupKey = `${item.label}-${group.label}`;
                      const isOpen = !!openGroups[groupKey];
                      return (
                        <div key={group.label} className="submenu-group">
                          <button
                            type="button"
                            className={`submenu-accordion-header d-flex justify-content-between align-items-center ${isOpen ? 'open' : ''}`}
                            onClick={(e)=>{ e.preventDefault(); toggleGroup(groupKey); }}
                          >
                            <span>{group.label}</span>
                            <span className="caret-small">{isOpen ? '▴' : '▾'}</span>
                          </button>
                          {isOpen && (
                            <div className="submenu-children">
                              {group.children.map((sub)=> (
                                <Nav.Link
                                  as={Link}
                                  to={sub.to || item.to}
                                  key={`${groupKey}-${sub.label}`}
                                  className="submenu-link"
                                >
                                  {sub.label}
                                </Nav.Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Nav.Item>
            );
          })}
        </Nav>
      </aside>

      {/* Offcanvas for small screens */}
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Globosoft</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {items.map((item)=>{
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const hasGroups = Array.isArray(item.groups) && item.groups.length > 0;
              return (
                <Nav.Item key={item.label} className={`nav-item-custom ${(hasChildren || hasGroups) ? 'nav-item-has-children' : ''}`}>
                  <Nav.Link as={Link} to={item.to} onClick={handleClose} className="d-flex align-items-center justify-content-between">
                    <span className="d-flex align-items-center">
                      <span className="me-2">{getIcon(item.label)}</span>
                      <span>{item.label}</span>
                    </span>
                  </Nav.Link>
                  {(hasChildren || hasGroups) && (
                    <div className="submenu">
                      {hasChildren && item.children.map((child)=> (
                        <Nav.Link
                          as={Link}
                          to={item.to}
                          key={`${item.label}-mobile-${child}`}
                          onClick={handleClose}
                          className="submenu-link"
                        >
                          {child}
                        </Nav.Link>
                      ))}
                      {hasGroups && item.groups.map((group)=> {
                        const groupKey = `${item.label}-${group.label}`;
                        const isOpen = !!openGroups[groupKey];
                        return (
                          <div key={`${group.label}-mobile`} className="submenu-group">
                            <button
                              type="button"
                              className={`submenu-accordion-header d-flex justify-content-between align-items-center ${isOpen ? 'open' : ''}`}
                              onClick={(e)=>{ e.preventDefault(); toggleGroup(groupKey); }}
                            >
                              <span>{group.label}</span>
                              <span className="caret-small">{isOpen ? '▴' : '▾'}</span>
                            </button>
                            {isOpen && (
                              <div className="submenu-children">
                                {group.children.map((sub)=> (
                                  <Nav.Link
                                    as={Link}
                                    to={sub.to || item.to}
                                    key={`${groupKey}-mobile-${sub.label}`}
                                    onClick={handleClose}
                                    className="submenu-link"
                                  >
                                    {sub.label}
                                  </Nav.Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Nav.Item>
              );
            })}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function getIcon(label){
  switch(label){
    case 'Dashboard': return '🏠';
    case 'Manage Masters': return '🧩';
    case 'Company Profile': return '🏢';
    case 'Registration': return '📝';
    case 'New Booking': return '🆕';
    case 'Bookings': return '📚';
    case 'Invoice': return '🧾';
    case 'Inhouse Accounts': return '🏦';
    case 'Assigned Agents': return '👥';
    case 'Calender': return '🗓️';
    case 'Extranet Contract': return '📑';
    case 'Report': return '📈';
    case 'Offer': return '🏷️';
    case 'Upload Offer Image': return '🖼️';
    default: return '•';
  }
}
