//Tobar.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoutUI from "./LogoutUI";
import "./componentsStyles/Topbar.css";
import { useVendor } from "./VendorContext";
import { FaUserCircle } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";

import logoImage from "../assets/logo.png";

const Topbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { vendorDetails, logoutVendor } = useVendor();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    setShowLogoutModal(true);
  };

  const renderDropdown = () => (
    <ul className="dropdown-menu">
      <li>
        <Link to="/visit-store" onClick={() => setDropdownOpen(false)}>
          Visit Store
        </Link>
      </li>
      <li>
        <Link to="/orders" onClick={() => setDropdownOpen(false)}>
          Orders
        </Link>
      </li>
      <li>
        <Link to="/edit-profile" onClick={() => setDropdownOpen(false)}>
          Edit Profile
        </Link>
      </li>
      <li>
        <button onClick={handleLogoutClick} className="logout-button">
          Logout
        </button>
      </li>
    </ul>
  );

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="hamburger-btn"
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
          aria-label="Open sidebar">
          <span className="hamburger-icon">☰</span>
        </button>
        <div className="logo-and-phone">
          <div className="logo-image-wrapper">
            <img
              src={logoImage}
              alt="logo"
              className="logo-image-img"
              style={{ width: 96, height: 96 }}
            />
          </div>
          {/* 
          <div className="phone-info">
            <div className="phone-circle">
              <FiPhone className="phone-icon" />
            </div>
            <a className="phone-number" href="tel:+919876543210">
              +91-9876543210
            </a>
          </div> */}
        </div>
        <p className="topbar-message">
          Welcome to the Afr-Trading.com <br /> Vendor Portal
        </p>
      </div>

      <div className="topbar-right">
        <div className="vendor-dropdown" ref={dropdownRef}>
          <button
            className="vendor-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen ? "true" : "false"}
            aria-controls="vendor-dropdown-menu"
            n>
            <div>
              <FaUserCircle className="avatar" />
            </div>
            <div className="vendor-in-topbar">
              <span className="username">
                {vendorDetails?.name || "Vendor"}
              </span>
              <span className="user-designation">{vendorDetails?.email}▼</span>
            </div>
          </button>
          {dropdownOpen && (
            <div id="vendor-dropdown-menu" className="dropdown-menu-wrapper">
              {renderDropdown()}
            </div>
          )}
        </div>
      </div>

      {showLogoutModal && (
        <LogoutUI
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => {
            logoutVendor();
            navigate("/login");
          }}
        />
      )}
    </header>
  );
}

export default Topbar;
