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
        <div className="sidebar-pills-wrapper">
          <nav>
            <ul>
              {[
                { to: "/dashboard", label: "Dashboard" },
                { to: "/products", label: "Manage Products" },
                { to: "/add-product", label: "Add Product" },
                { to: "/bulk-products", label: "Upload Bulk Products" },
                { to: "/visit-store", label: "Visit Store" },
                { to: "/orders-status", label: "Orders Status" },
                { to: "/delivery-status", label: "Delivery Status" },
              ].map((item, index) => (
                <li key={item.to} style={{ "--i": index }}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => (isActive ? "active" : "")}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
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
