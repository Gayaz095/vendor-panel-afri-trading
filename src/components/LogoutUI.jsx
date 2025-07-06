import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVendor } from "./VendorContext";
import "./componentsStyles/LogoutUI.css";

function LogoutUI({ onCancel }) {
  const modalRef = useRef();
  const navigate = useNavigate();
  const { logoutVendor } = useVendor();

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  const handleLogout = () => {
    logoutVendor(); // Clear context + sessionStorage
    onCancel(); // Close modal

    // Force a full page navigation to /login (clears history)
    window.location.href = "/login";
  };

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal" ref={modalRef}>
        <h3>Logout Confirmation</h3>
        <p>Are you sure you want to logout?</p>
        <div className="logout-modal-actions">
          <button className="logout-modal-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="logout-modal-confirm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutUI;
