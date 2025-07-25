import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVendor } from "../VendorContext/VendorContext";
import "./LogoutUI.css";

function LogoutUI({ onCancel, currentPath }) {
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

    function handleEscKey(event) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onCancel]);

  const handleLogout = () => {
    logoutVendor(); //Clear context + sessionStorage
    onCancel(); // Close modal
    navigate("/login", { replace: true, state: { from: currentPath } });
  };

  return (
    <div className="logout-modal-overlay">
      <div
        className="logout-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true">
        <h3 className="logout-modal-title">Logout Confirmation</h3>
        <p className="logout-modal-message">Are you sure you want to logout?</p>
        <div className="logout-modal-actions">
          <button
            className="logout-modal-cancel"
            onClick={onCancel}
            aria-label="Cancel logout">
            Cancel
          </button>
          <button
            className="logout-modal-confirm"
            onClick={handleLogout}
            aria-label="Confirm logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutUI;
