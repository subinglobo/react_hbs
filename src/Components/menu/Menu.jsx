import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Menu.css";
import { FaTachometerAlt, FaUsers, FaCog } from "react-icons/fa";
import { FaLeaf } from "react-icons/fa";
import { LuLeaf } from "react-icons/lu";
import { AiFillProfile } from "react-icons/ai";
import { MdAppRegistration } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

const menuItems = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    submenu: [],
  },
  {
    title: "Manage Master",
    icon: <FaCog />,
    submenu: [
      {
        title: "Basic Settings",
        icon: <LuLeaf />,
        submenu: [
          { title: "Designation", icon: <FaLeaf /> },
          { title: "Bank", icon: <FaLeaf /> },
          { title: "Contact Type", icon: <FaLeaf /> },
          { title: "Markup Type", icon: <FaLeaf /> },
          { title: "Currency", icon: <FaLeaf /> },
        ],
      },
      {
        title: "Location Settings",
        icon: <LuLeaf />,
        submenu: [
          { title: "Market Type", icon: <FaLeaf /> },
          { title: "Region", icon: <FaLeaf /> },
          { title: "Country", icon: <FaLeaf /> },
          { title: "province", icon: <FaLeaf /> },
          { title: "Destination", icon: <FaLeaf /> },
        ],
      },
      {
        title: "Mapping Settings",
        icon: <LuLeaf />,
        submenu: [
          { title: "City", icon: <FaLeaf /> },
          { title: "Country", icon: <FaLeaf /> },
          { title: "Hotel", icon: <FaLeaf /> },
        ],
      },
      {
        title: "UnMapping",
        icon: <LuLeaf />,
        submenu: [
          { title: "City", icon: <FaLeaf /> },
          { title: "Country", icon: <FaLeaf /> },
          { title: "Hotel", icon: <FaLeaf /> },
        ],
      },
      {
        title: "Hotel Settings",
        icon: <LuLeaf />,
        submenu: [
          { title: "Hotel Category", icon: <FaLeaf /> },
          { title: "Hotel Type", icon: <FaLeaf /> },
          { title: "Occupancy Type", icon: <FaLeaf /> },
          { title: "Season Type", icon: <FaLeaf /> },
          { title: "Room Category", icon: <FaLeaf /> },
          { title: "Room Type", icon: <FaLeaf /> },
          { title: "Hotel Amenity", icon: <FaLeaf /> },
          { title: "Room Amenity", icon: <FaLeaf /> },
          { title: "Meal Plan", icon: <FaLeaf /> },
        ],
      },
      {
        title: "Agent Settings",
        icon: <LuLeaf />,
        submenu: [{ title: "Agent Category", icon: <FaLeaf /> }],
      },
      {
        title: "Package Settings",
        icon: <LuLeaf />,
        submenu: [
            { title: "Package Category", icon: <FaLeaf /> },
            { title: "Package Type", icon: <FaLeaf /> },
            { title: "Day Activity", icon: <FaLeaf /> },
            { title: "Itinerary", icon: <FaLeaf /> },
            { title: "Visa Details", icon: <FaLeaf /> },
            { title: "Terms and Conditions", icon: <FaLeaf /> },
        
        ],
      },
      {
        title: "Payment Gateway",
        icon: <LuLeaf />,
      },
      {
        title: "Communication Mail",
        icon: <LuLeaf />,
      },
    ],
  },
  { 
    title: "Company Profile" ,
    icon : <AiFillProfile />,
},
  {
    title: "Registration",
    icon:<MdAppRegistration />,
    submenu: [
        {
        title: "Hotel",
        icon: <LuLeaf />,
        },
        {
        title: "Agent",
        icon: <LuLeaf />,
        },
          {
        title: "Employee",
        icon: <LuLeaf />,
        },
        {
        title: "Cab Provider",
        icon: <LuLeaf />,
        },
        {
        title: "Activity Provider",
        icon: <LuLeaf />,
        },
        {
        title: "Package",
        icon: <LuLeaf />,
        },
        {
        title: "Supplier Registration",
        icon: <LuLeaf />,
        },
        
    ],
  },
    {
    title: "New Booking",
    icon:<IoMdAdd  />,
    submenu: [
        {
        title: "Hotel Booking",
        icon: <LuLeaf />,
        },
        {
        title: "Make Your Own Package",
        icon: <LuLeaf />,
        },
          {
        title: "Package Booking",
        icon: <LuLeaf />,
        },
        {
        title: "Offline Booking ",
        icon: <LuLeaf />,
        },
        {
        title: "Tours and Activity",
        icon: <LuLeaf />,
        },
              
    ],
  },
      {
    title: "Booking Details",
    icon:<FaList  />,
    submenu: [
        {
        title: "Hotel Booking List",
        icon: <LuLeaf />,
        },
        {
        title: "Custom booking List",
        icon: <LuLeaf />,
        },
          {
        title: "Package Booking List",
        icon: <LuLeaf />,
        },
        {
        title: "Complete Booking ",
        icon: <LuLeaf />,
        },
        {
        title: "Quotation List",
        icon: <LuLeaf />,
        },
        {
        title: "Offline Booking List",
        icon: <LuLeaf />,
        },
              
    ],
  },
  {
    title: "Components",
    submenu: [{ title: "Button" }, { title: "Card" }],
  },
  { title: "Utilities" },
  { title: "Migrating" },
  { title: "About" },
];

const Menu = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [openSubMenus, setOpenSubMenus] = useState({});

  const toggleMenu = (index) => {
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleSubMenu = (parentIndex, subIndex) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [`${parentIndex}-${subIndex}`]: !prev[`${parentIndex}-${subIndex}`],
    }));
  };
  return (
    <div className="">
      <aside
        className="sidebar bg-white text-white p-3"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <h2 className="sidebar-heading mb-4">Hotel Booking System</h2>

        <ul className="list-unstyled">
          {menuItems.map((menu, i) => (
            <li key={i} className="mb-2">
              <div
                className="d-flex justify-content-between align-items-center menu-title"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  menu.submenu && menu.submenu.length > 0 && toggleMenu(i)
                }
              >
                <span>{menu.icon}</span>
                <span>{menu.title}</span>
                {menu.submenu && menu.submenu.length > 0 && (
                  //   <span className={`arrow ${openMenus[i] ? "rotate" : ""}`}>▶</span>
                  <i
                    className={`bi bi-chevron-right arrow ${
                      openMenus[i] ? "rotate" : ""
                    }`}
                  ></i>
                )}
              </div>

              {/* First-level submenu */}
              {menu.submenu && menu.submenu.length > 0 && openMenus[i] && (
                <ul className="list-unstyled ps-3 mt-2">
                  {menu.submenu.map((sub, j) =>
                    typeof sub === "string" ? (
                      <li key={j} className="submenu-item py-1">
                        {sub}
                      </li>
                    ) : (
                      <li key={j}>
                        <div
                          className="d-flex justify-content-between align-items-center submenu-title"
                          style={{ cursor: "pointer" }}
                          onClick={() => sub.submenu && toggleSubMenu(i, j)}
                        >
                          <span className="icon">{sub.icon}</span>
                          <span>{sub.title}</span>
                          {sub.submenu && (
                            <i
                              className={`bi bi-chevron-right arrow ${
                                openSubMenus[`${i}-${j}`] ? "rotate" : ""
                              }`}
                            ></i>
                          )}
                        </div>

                        {/* Second-level submenu */}
                        {sub.submenu && openSubMenus[`${i}-${j}`] && (
                          <ul className="list-unstyled ps-3 mt-1">
                            {sub.submenu.map((inner, k) => (
                              <li key={k} className="submenu-item py-1">
                                {inner.icon && (
                                  <span className="me-2">{inner.icon}</span>
                                )}
                                {inner.title || inner}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Menu;
