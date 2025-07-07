import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutUI from "./LogoutUI";
import { useVendor } from "./VendorContext";
import { FaUserCircle } from "react-icons/fa";
import logoImage from "../assets/logo.png";
import "./componentsStyles/Topbar.css";

const Topbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef();
  const navigate = useNavigate();
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchValue}`);
  };

  const renderDropdown = () => (
    <ul className="topbar-dropdown-menu">
      <li>
        <Link to="/visit-store" onClick={() => setDropdownOpen(false)}>
          Visit Store
        </Link>
      </li>
      <li>
        <Link to="/orders-status" onClick={() => setDropdownOpen(false)}>
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
          aria-label="Open sidebar"
        >
          <span className="hamburger-icon">☰</span>
        </button>
        <div className="logo-and-phone">
          <div className="logo-image-wrapper">
            <Link
              to="/dashboard"
              className="logo-image-wrapper"
              onClick={() => setDropdownOpen(false)}
            >
              <img
                src={logoImage}
                alt="logo"
                className="logo-image-img"
                style={{ width: 96, height: 96 }}
              />
            </Link>
          </div>
        </div>
        <p className="topbar-message">
          Welcome to the Afr-Trading.com <br /> Vendor Portal
        </p>
      </div>

      <form className="topbar-searchbar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="topbar-searchbar-input"
          placeholder="Search..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        <button className="topbar-searchbar-btn" type="submit">
          Search
        </button>
      </form>

      <div className="topbar-right">
        <div className="topbar-vendor-dropdown" ref={dropdownRef}>
          <button
            className="topbar-vendor-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen ? "true" : "false"}
            aria-controls="topbar-vendor-dropdown-menu"
            aria-label="Vendor menu"
          >
            <div>
              <FaUserCircle className="avatar" />
            </div>
            <div className="topbar-vendor-in-topbar">
              <span className="topbar-username">
                {vendorDetails?.name || "Vendor"}
              </span>
              <span className="topbar-user-designation">
                {vendorDetails?.email}▼
              </span>
            </div>
          </button>
          {dropdownOpen && (
            <div
              id="vendor-dropdown-menu"
              className="topbar-dropdown-menu-wrapper"
            >
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
};

export default Topbar;
