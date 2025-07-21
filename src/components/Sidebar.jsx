import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useVendor } from "./VendorContext";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaPlus,
  FaCloudUploadAlt,
  FaMoneyBill,
  FaStore,
  FaClipboardList,
  FaShippingFast,
  FaChevronDown,
  FaUserEdit,
} from "react-icons/fa";
import "./componentsStyles/Sidebar.css";

export default function Sidebar({ isMobile, isOpen, onClose }) {
  const { vendorDetails } = useVendor();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

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
        <div className="sidebar-pills-wrapper">
          <nav>
            <ul>
              <li key="/dashboard" style={{ "--i": 0 }}>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaTachometerAlt className="icon" />
                  Dashboard
                </NavLink>
              </li>

              {/* Dropdown for Manage Products */}
              <li
                className={`has-dropdown ${
                  openDropdown === "products" ? "open" : ""
                }`}
                style={{ "--i": 1 }}>
                <button
                  type="button"
                  className="dropdown-toggle"
                  onClick={() => handleDropdown("products")}>
                  <FaBoxOpen className="icon" />
                  Manage Products
                  <FaChevronDown className="arrow" />
                </button>
                <ul className="dropdown-menu">
                  <li key="/add-product">
                    <NavLink
                      to="/add-product"
                      className={({ isActive }) => (isActive ? "active" : "")}>
                      <FaPlus className="icon" />
                      Add & Edit Product
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li key="/visit-store" style={{ "--i": 2 }}>
                <NavLink
                  to="/visit-store"
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaStore className="icon" />
                  Visit Store
                </NavLink>
              </li>
              <li key="/orders-status" style={{ "--i": 3 }}>
                <NavLink
                  to="/orders-status"
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaClipboardList className="icon" />
                  Orders
                </NavLink>
              </li>
              <li key="/delivery-status" style={{ "--i": 4 }}>
                <NavLink
                  to="/delivery-status"
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaShippingFast className="icon" />
                  Delivery Status
                </NavLink>
              </li>
              <li key="/payments" style={{ "--i": 5 }}>
                <NavLink
                  to="/payments"
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaMoneyBill className="icon" />
                  Payments
                </NavLink>
              </li>
              <li key="/edit-profile" style={{ "--i": 6 }}>
                <NavLink
                  to="/edit-profile"
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaUserEdit className="icon" />
                  Edit Profile
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      {isMobile && isOpen && (
        <div className="sidebar-overlay" aria-label="Close sidebar" />
      )}
    </>
  );
}
