import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useVendor } from "./VendorContext";
import { FaTachometerAlt, FaBox, FaStore } from "react-icons/fa";
import "./componentsStyles/Sidebar.css";

export default function Sidebar({ isMobile, isOpen, onClose }) {
  const { vendorDetails } = useVendor();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown and sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpenDropdown(null);
        if (isMobile && isOpen) onClose();
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isOpen, onClose]);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  const handleDropdown = (menu) => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    if (isMobile) onClose();
    sessionStorage.setItem("logoutIntent", "true");
    navigate("/logout");
  };

  // Remove focus when mobile sidebar closes
  useEffect(() => {
    if (isMobile && !isOpen && document.activeElement?.blur) {
      if (sidebarRef.current?.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    }
  }, [isOpen, isMobile]);

  return (
    <>
      <aside
        ref={sidebarRef}
        tabIndex={-1}
        inert={isMobile && !isOpen ? true : undefined}
        className={`sidebar transition-sidebar ${
          isMobile ? "mobile-sidebar" : ""
        } ${isOpen ? "open" : "closed"}`}>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                end
                onClick={isMobile ? onClose : undefined}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }>
                <FaTachometerAlt className="icon colorful-icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                onClick={isMobile ? onClose : undefined}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }>
                <FaBox className="icon colorful-icon" />
                <span>Products</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/visit-store"
                onClick={isMobile ? onClose : undefined}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }>
                <FaStore className="icon colorful-icon" />
                <span>Visit Store</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      {isMobile && isOpen && (
        <div className="sidebar-overlay" aria-label="Close sidebar" />
      )}
    </>
  );
}
